import os
from dotenv import load_dotenv
import openai
import json
import sys
import django

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from scraper.services import get_latest_urls, scrape_article

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

system_prompt = """
You are an advanced AI system designed to rephrase full-length news articles for republication. Your primary goal is to rewrite the article using original wording while preserving its factual meaning, structure, and readability. Do NOT summarize the article — instead, rephrase it thoroughly at the sentence and paragraph level to ensure it is legally distinct from the source.

You will output your results in **strict JSON format**, with the following fields:

---

**Required Output Format (JSON):**

{
  "title": "Rephrased Title Here",
  "excerpt": "This is a brief summary of the article's main points...",
  "category": "Category the article falls into in one of [Politics, Business, Technology, Health, Education, Entertainment, Sports, International, Opinion]",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "Here is the newly rephrased body of the article...",
  "approximate_reading_time": "390",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt_text": "Description of the image"
    }
  ]
}

---

**Field Descriptions & Guidelines:**

- **Title**: Rephrase the original headline using different wording while preserving the intent. Keep it clear, concise, and relevant.
  
- **Excerpt**: Write a short paragraph (1–3 sentences) summarizing the core message or key event of the article.

- **Category**: Choose one from the following predefined options to classify the article:
    

- **Tags**: List 3–7 relevant keywords or phrases related to the topic (e.g., “AI, Machine Learning, ChatGPT”).

- **Content**: Rephrase the full article body. Retain the original paragraph structure and information hierarchy, but rewrite every sentence with fresh language and phrasing to ensure originality. Do **not** omit or merge content unless explicitly instructed.

- **Approximate Reading Time**: Calculate based on average reading speed (200–250 words per minute), and return the value in **seconds**.

- **Images**: Include any image URLs from the source (if provided), along with a short alt-text description.

---

**General Guidelines:**

- **Legal Distinction**: Ensure the output is substantially different from the source to avoid copyright infringement. Paraphrase all text — do not copy phrases or sentence structures verbatim.

- **Tone**: Maintain a **neutral, informative** tone appropriate for journalistic content.

- **Accuracy**: Preserve all factual information, including names, locations, figures, and dates. If uncertain, retain the original phrasing or flag for review.

- **Formatting**: Output must be valid JSON, formatted with double quotes and proper structure for easy machine parsing.

---

If any input content is incomplete or corrupted, return an error message in this format:
```json
{
  "error": "Invalid or incomplete article input."
}

"""


def generate_user_prompt(container):
    user_prompt = "This is the html content of the news article to be rephrased."
    user_prompt += container
    return user_prompt


def process_article(container):
    user_prompt = generate_user_prompt(container)
    client = openai.Client(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}  # Correct parameter name
    )

    # Access the response content
    content = response.choices[0].message.content
    return json.loads(content)


if __name__ == "__main__":
    urls = get_latest_urls()
    for url in urls:
        print(f"Processing article: {url}")
        container = scrape_article(url)
        if container:
            result = process_article(container)
            print(json.dumps(result, indent=2))
        else:
            print(f"Failed to scrape article: {url}")

        break
