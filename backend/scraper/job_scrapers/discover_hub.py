import requests
from bs4 import BeautifulSoup
import html2text


def scrape_data(soup):
    role = soup.find('h1', class_='elementor-heading-title').text.strip()
    section = soup.find('section', class_='elementor-section')
    container = section.find_all('div', class_='elementor-widget-container')[0]
    paragraphs = container.find_all(['p', 'ul'])

    html_elements = [str(i) for i in paragraphs]

    h = html2text.HTML2Text()

    markdown_list = [h.handle(el).strip() for el in html_elements]
    content = "\n".join(markdown_list)
    category = soup.find('div', class_='elementor-widget-container').text.strip().strip("/").strip().lower()
    return {  "role": role,
     "description": content,
     "category": category     
}   


if __name__=='__main__':
    url = 'https://jobs.smartyacad.com/full-stack-developer-at-nova/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    data = scrape_data(soup)

    print(f"Data is {data}")
