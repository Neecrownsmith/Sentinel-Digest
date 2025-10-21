import os
import sys
import django

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import re
from scraper.models import NewsSource

# Raw data (feed URLs with inline comments)
url_dict = {
    "https://www.arise.tv/feed/": "scraped",
    "https://www.bellanaija.com/feed/": "scraped",
    "https://dailytrust.com/feed/": "scraped",
    "https://guardian.ng/feed/": "scraped",
    "https://www.lindaikejisblog.com/feed": "scraped",
    "https://www.premiumtimesng.com/feed": "scraped",  
    "https://www.vanguardngr.com/feed/": "scraped",
    "https://ynaija.com/feed/": "scraped",
    "https://tribuneonlineng.com/feed/": "unscraped",
    "https://www.yabaleftonline.ng/feed/": "unscraped",
    "https://dailypost.ng/feed/": "unscraped",
    "https://thenationonlineng.net/feed/": "unscraped"
}

for url, is_scraped in url_dict.items():
    if is_scraped.lower() == "scraped":
        is_active = True
    else:
        is_active = False

    # Extract base domain and name
    match = re.match(r"https?://([^/]+)", url)
    base_domain = match.group(1) if match else url
    name = base_domain.replace("www.", "").split(".")[0].capitalize()

    # Save to DB
    news_source, created = NewsSource.objects.update_or_create(
        feed_url=url,
        defaults={
            "name": name,
            "base_url": f"https://{base_domain}",
            "is_active": is_active
        }
    )

    print(f"{'🆕 Created' if created else '✅ Updated'}: {name} ({'Active' if is_active else 'Inactive'})")


    