import os
from dotenv import load_dotenv
import openai
import json
import sys
import django
import uuid

load_dotenv()

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()


from scraper.services import get_latest_job_urls, scrape_job
from jobs.models import Job, Category, Log
from scraper.models import ScrapedJob
from core.template import get_failed_service_template
from core.utils import EmailService
from django.utils import timezone
from social_media.services import SocialMediaService
from similarity.checker import check_duplicate, encode_job


KNOWN_CATEGORIES = ["job", "internship", "bootcamp", "graduate program", "scholarship", "grant"]

# Create log entry with unique ID
log_id = f"log-{timezone.now().strftime('%Y%m%d-%H%M%S')}-{str(uuid.uuid4())[:8]}"
log = Log.objects.create(log_id=log_id, status='running')

# Tracking variables
successful_count = 0
failed_count = 0
skipped_count = 0
duplicate_count = 0  # Track duplicates separately
total_tokens = 0


try:
    jobs = get_latest_job_urls()
    log.new_job_count = len(jobs)
    log.save

    print(f"\n{'='*70}")
    print(f"Starting Job process for {len(jobs)} articles")
    print(f"Log ID: {log.log_id}")
    print(f"{'='*70}\n")

    for index, url in enumerate(jobs, 1):
        print(f"Processing Job {index}/{len(jobs)}: {url}")
        try:
            # Check if job already exists (check by ScrapedJob URL)
            existing_scraped_job = ScrapedJob.objects.filter(url=url).first()
            if existing_scraped_job and Job.objects.filter(source_url=existing_scraped_job).exists():
                print(f"  [*] Job already exists in database, skipping: {url}")
                skipped_count += 1
                continue


            # Scrape the job data
            scraped_data = scrape_job(url)
            if not scraped_data:
                print(f"  [!] Failed to scrape job: {url}")
                failed_count += 1
                continue

            # Check for duplicates
            duplicate_result = check_duplicate(
                job_text=scraped_data.get('role', '') + " " + scraped_data.get('description', ''),
                model_type='job'
            )
            
            if duplicate_result['is_duplicate']:
                print(f"  [*] Duplicate job detected, skipping: {url}")
                print(f"  [*] Similarity: {duplicate_result['similarity_score']:.2%} to '{duplicate_result.get('similar_job_role', 'Unknown')}'")

                # Increment publication_count for the similar job
                similar_job = duplicate_result['similar_job']
                if hasattr(similar_job, 'publication_count'):
                    similar_job.publication_count += 1
                    similar_job.save(update_fields=['publication_count'])
                    print(f"  [*] Incremented publication_count to {similar_job.publication_count}")

                # Record duplicate in ScrapedJob to avoid re-scraping
                ScrapedJob.objects.get_or_create(url=url)
                duplicate_count += 1
                continue

            # Get or create ScrapedJob instance
            scraped_job_obj, _ = ScrapedJob.objects.get_or_create(url=url)

            # Get or create category
            category_name = scraped_data.get('category', 'Job')
            if category_name.lower().strip() in KNOWN_CATEGORIES:
                category_name = category_name.capitalize()
            else:
                category_name = 'Job'
            
            category, created = Category.objects.get_or_create(name=category_name)

            # Create Job entry
            new_job = Job.objects.create(
                role=scraped_data.get('role', ''),
                description=scraped_data.get('description', ''),
                category=category,
                source_url=scraped_job_obj,
                apply_link=scraped_data.get('apply_link', '')
            )

            # Encode job for similarity checking
            encode_job(new_job)

            successful_count += 1
            print(f"  [+] Job saved: {new_job.role} | Category: {category.name}")

        except Exception as e:
            failed_count += 1
            print(f"  [!] Error processing job {url}: {str(e)}")
            if not log.error_message:
                log.error_message = f"First error at {url}: {str(e)}"

            else:
                log.error_message += f"\n{url}: {str(e)}"

            log.save()


        # break # Remove this break statement to process all jobs

    log.end_time = timezone.now()
    log.total_jobs_processed = len(jobs)
    log.successful_jobs = successful_count
    log.failed_jobs = failed_count
    log.skipped_jobs = skipped_count + duplicate_count

    if duplicate_count > 0:
        dup_msg = f" ({duplicate_count} duplicate jobs detected and skipped)"
        log.error_message = (log.error_message or '') + dup_msg
    
    # Determine final status
    if successful_count == len(jobs):
        log.status = 'completed'

    elif successful_count > 0:
        log.status = 'partial'
    else:
        log.status = 'failed'

    log.calculate_duration()
    log.save()

    print(f"\n{'='*70}")
    print(f"Job processing completed. Log ID: {log.log_id}")
    print(f"Successful: {successful_count}")
    print(f"Failed: {failed_count}")
    print(f"Skipped: {skipped_count + duplicate_count}")
    print(f"Status: {log.status}")
    print(f"Duration: {log.time_taken}")
    print(f"{'='*70}\n")

except Exception as e:
    # Handle catastrophic failure
    log.end_time = timezone.now()
    log.status = 'failed'
    log.error_message = f"Critical error: {str(e)}"
    log.calculate_duration()
    log.save()

    message = get_failed_service_template("Job", log.log_id, e)
    EmailService.send_email_to_admins(message, subject=f"Job Failed: Log {log.log_id}", is_html=True)