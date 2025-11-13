import feedparser
import requests
from bs4 import BeautifulSoup
import time
import re
from fake_useragent import UserAgent
import os
import sys
import django
import html2text


# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from scraper.models import ScrapedArticle, NewsSource, JobSource, ScrapedJob
from core.utils import EmailService
from core.template import get_missing_scraper_template, get_failed_scraper_template

def get_latest_articles(feed_url=None, scraped_orm_model=None):
    # feed_url is a NewsSource instance; use its feed_url attribute (string)
    feed = feedparser.parse(feed_url.feed_url)
    links = []
    for entry in feed.entries:
        link = entry.link
        if not scraped_orm_model.objects.filter(url=link).exists():
            links.append(link)
    return links


def save_links(feed_url, scraped_orm_model=None):
    website = re.search(r"https?://([^/]+)", feed_url.feed_url)
    print(f"🔄 Checking {website.group(1).lower()} for new content...")

    links = get_latest_articles(feed_url, scraped_orm_model=scraped_orm_model)

    for link in links:
        if not scraped_orm_model.objects.filter(url=link).exists():
            scraped_orm_model.objects.update_or_create(
                url=link,
                defaults={
                    "source": feed_url,
                }
            )
            print(f"🆕 New article found: {link}")
        else:
            print(f"✔️ Already seen: {link}")

def get_latest_news_urls():
    url_list = NewsSource.objects.filter(is_active=True)
    all_links = []
    for feed_url in url_list:
        links = get_latest_articles(feed_url, scraped_orm_model=ScrapedArticle)
        save_links(feed_url, scraped_orm_model=ScrapedArticle)
        all_links.extend(links)
    return all_links


def scrape_article(url):
    # Extract base domain and name
    match = re.match(r"https?://([^/]+)", url)
    base_domain = match.group(1) if match else url
    site = base_domain.replace("https://", "").replace('www.',"").lower()
    
    # from core_logic.logics.quillbot.chatgpt import prompt_gemini
    ua = UserAgent()
    headers = {
        "User-Agent": ua.random,
        "Accept-Language": "en-US,en;q=0.9"
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    container = None
    try:
        if site == 'arise.tv':
            container = soup.find("article")
        elif site == 'bellanaija.com':
            container = soup.find("div", id="mvp-article-cont")
        elif site == 'dailytrust.com':
            container = soup.find("div", class_ = "article-container")
        elif site == 'guardian.ng':
            container = soup.find("section", class_="main-content").article
        elif site == 'lindaikejisblog.com':
            container = soup.find("div", class_="col-md-12")
        elif site == 'premiumtimesng.com':
            container = soup.find('div', class_='jeg_content')
        elif site == 'ynaija.com':
            container = soup.find("article", class_="blog-item")
        # elif site == 'vanguardngr.com':
        #     container
        else:
            message = get_missing_scraper_template(site)
            EmailService.send_email_to_admins(message, subject=f"Scraper Missing: {site}", is_html=True)

    except Exception as e:
        message = get_failed_scraper_template(site, e)
        EmailService.send_email_to_admins(message, subject=f"Scraper Failed: {site}", is_html=True)

    if container:
        return container.prettify()
    return container


def get_latest_job_urls():
    url_list = JobSource.objects.filter(is_active=True)
    all_links = []
    for feed_url in url_list:
        links = get_latest_articles(feed_url, scraped_orm_model=ScrapedJob)
        save_links(feed_url, scraped_orm_model=ScrapedJob)
        all_links.extend(links)
    return all_links


def scrape_job(url):
    # Extract base domain and name
    match = re.match(r"https?://([^/]+)", url)
    base_domain = match.group(1) if match else url
    site = base_domain.replace("https://", "").replace('www.',"").lower()
    print(f"Scraping job from site: {site}")
    
    # from core_logic.logics.quillbot.chatgpt import prompt_gemini
    ua = UserAgent()
    headers = {
        "User-Agent": ua.random,
        "Accept-Language": "en-US,en;q=0.9"
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    data = None
    try:
        if site == 'jobs.smartyacad.com':
            from scraper.job_scrapers.discover_hub import scrape_data
            data = scrape_data(soup)
            
        
        else:
            message = get_missing_scraper_template(site)
            EmailService.send_email_to_admins(message, subject=f"Scraper Missing: {site}", is_html=True)

    except Exception as e:
        message = get_failed_scraper_template(site, e)
        EmailService.send_email_to_admins(message, subject=f"Scraper Failed: {site}", is_html=True)

    if data:
        data["source_url"] = url
        
    return data

if __name__ == "__main__":
    # url = "https://www.arise.tv/umahi-orders-ccecc-to-redo-aba-port-harcourt-road-threatens-arrest-contract-termination/"
    # url = "https://dailytrust.com/fg-to-construct-10-new-airports-in-nigeria/"
    # container = scrape_article(url)
    # print(container)

    url = "https://jobs.smartyacad.com/abbey-mortgage-bank-is-hiring/"
    scrape_job(url)

    # job_list = get_latest_job_urls()
    # print(f"Total new job URLs found: {len(job_list)} with top 5 as {job_list[:5]}")
