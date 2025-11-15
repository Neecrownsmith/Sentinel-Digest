import requests
from bs4 import BeautifulSoup
import html2text
import os 
import sys
import django
from dotenv import load_dotenv

load_dotenv()

frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
site_url = 'jobs.smartyacad.com'
# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from jobs.models import Job
from scraper.models import ScrapedJob



def parse_category(category_str):
    """Parse and normalize category string"""
    category_str = category_str.lower().strip()
    if 'intern' in category_str:
        return 'Internship'
    elif 'bootcamp' in category_str:
        return 'Bootcamp'
    elif 'graduate' in category_str or 'grad' in category_str or 'fellowship' in category_str or 'training' in category_str:
        return 'Graduate Program'
    elif 'scholarship' in category_str:
        return 'Scholarship'
    elif 'grant' in category_str:
        return 'Grant'
    else:
        return 'Job'
    

def decode_cloudflare_email(encoded):
    """Decode Cloudflare email protection"""
    try:
        r = int(encoded[:2], 16)
        email = ''.join([chr(int(encoded[i:i+2], 16) ^ r) for i in range(2, len(encoded), 2)])
        return email
    except:
        return None

def html_to_string(html_list):
    paragraph_list = []
    for p in html_list:
        links = p.find_all('a', href=True)
        for link in links:
            href = link['href']
            
            # Handle Cloudflare email protection
            if '/cdn-cgi/l/email-protection' in href:
                encoded = href.split('#')[-1] if '#' in href else None
                if not encoded and link.get('data-cfemail'):
                    encoded = link.get('data-cfemail')
                
                if encoded:
                    decoded_email = decode_cloudflare_email(encoded)
                    if decoded_email:
                        link['href'] = f"mailto:{decoded_email}"
                        link.string = decoded_email
                continue
            
            # Handle internal job links
            if site_url in href:
                try:
                    scraped_job = ScrapedJob.objects.filter(url=href).first()
                    if scraped_job:
                        opportunity = Job.objects.filter(source_url=scraped_job).first()
                        if opportunity:
                            link['href'] = f"{frontend_url}/opportunity/{opportunity.slug}"
                        else:
                            link['href'] = href.replace(site_url, f"{frontend_url}/opportunity")
                except Exception as e:
                    print(f"Error finding opportunity for {href}: {e}")

        # Also handle span elements with __cf_email__ attribute
        email_spans = p.find_all('span', {'class': '__cf_email__'})
        for span in email_spans:
            encoded = span.get('data-cfemail')
            if encoded:
                decoded_email = decode_cloudflare_email(encoded)
                if decoded_email:
                    span.replace_with(decoded_email)

        printable_html = str(p)
        if 'apply' in printable_html.lower() and '[' in printable_html.lower():
            # Skip application instructions paragraphs
            continue

        paragraph_list.append(printable_html)

    return paragraph_list

def scrape_data(soup):
    role = soup.find('h1', class_='elementor-heading-title').text.strip()
    section = soup.find('section', class_='elementor-section')
    container = section.find_all('div', class_='elementor-widget-container')[0]
    paragraphs = container.find_all(['p', 'ul', 'ol', 'h2', 'h3', 'h4','h5','h6'])
    apply_link = next(
        (link.get('href') for heading in container.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        for link in heading.find_all('a', href=True)
        if 'apply' in heading.get_text().lower()),
        None
    )

    html_elements = html_to_string(paragraphs)

    h = html2text.HTML2Text()
    h.body_width = 0  # Don't wrap lines
    h.inline_links = True  # Keep links inline instead of footnotes

    markdown_list = [h.handle(el).strip() for el in html_elements]
    content = "\n\n".join(markdown_list)  # Use double newline for better spacing
    category = soup.find('div', class_='elementor-widget-container').text.strip().strip("/").strip().lower()
    return {
        "role": role,
        "description": content,
        "category": parse_category(category),
        "apply_link": apply_link  
    }   


if __name__=='__main__':
    url = 'https://jobs.smartyacad.com/2025-bode-amao-foundation-scholarships/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    data = scrape_data(soup)
    print(data['description'])