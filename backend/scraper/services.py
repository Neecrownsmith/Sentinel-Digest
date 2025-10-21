import feedparser
import requests
from bs4 import BeautifulSoup
import time
import re
from fake_useragent import UserAgent
import os
import sys
import django
# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from scraper.models import ScrapedArticle, NewsSource

def get_latest_articles(feed_url=None):
    # feed_url is a NewsSource instance; use its feed_url attribute (string)
    feed = feedparser.parse(feed_url.feed_url)
    links = []
    for entry in feed.entries:
        link = entry.link
        if not ScrapedArticle.objects.filter(url=link).exists():
            links.append(link)
    return links


def save_links(feed_url):
    website = re.search(r"https?://([^/]+)", feed_url.feed_url)
    print(f"🔄 Checking {website.group(1).lower()} for new articles...")

    links = get_latest_articles(feed_url)

    for link in links:
        if not ScrapedArticle.objects.filter(url=link).exists():
            ScrapedArticle.objects.update_or_create(
                url=link,
                defaults={
                    "source": feed_url,
                }
            )
            print(f"🆕 New article found: {link}")
        else:
            print(f"✔️ Already seen: {link}")

def get_latest_urls():
    url_list = NewsSource.objects.filter(is_active=True)
    all_links = []
    for feed_url in url_list:
        links = get_latest_articles(feed_url)
        save_links(feed_url)
        all_links.extend(links)
    return all_links

if __name__ == "__main__":
    latest = get_latest_urls()
    print(f"Total new articles found: {len(latest)}")