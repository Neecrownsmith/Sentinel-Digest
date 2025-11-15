# ✅ **FULL SEO DEVELOPMENT CHECKLIST**

---

# 1️⃣ ARCHITECTURE & PLANNING

### **Site Structure**

* Logical, shallow hierarchy (3 clicks or fewer to any page)
* Clear, topic-cluster architecture
* Consistent URL patterns (no dynamic junk like `?id=123`)

### **URL Best Practices**

* Use clean, human-readable URLs
* Hyphens, not underscores
* Lowercase only
* Avoid date-based URLs unless necessary
* Canonical version decided (www vs non-www, http vs https)

---

# 2️⃣ PERFORMANCE & CORE WEB VITALS

### **Core Web Vitals Targets**

* **LCP** < 2.5s
* **CLS** < 0.1
* **INP** < 200 ms

### **Performance Optimizations**

* Use **lazy loading** for images and videos
* Compress images (AVIF/WebP)
* Serve assets via CDN
* Minify CSS/JS
* Avoid render-blocking scripts
* Use HTTP/2 or HTTP/3
* Preload critical resources (fonts, key CSS)
* Cache aggressively (server + client)

---

# 3️⃣ TECHNICAL SEO ELEMENTS (THE BASICS)

### **Metadata**

* Unique `<title>` tags on every page (50–60 chars)
* Unique `<meta description>` on every page (140–160 chars)
* Proper `<h1>` (one per page)
* Semantic HTML hierarchy for H2, H3…

### **Canonical Tags**

* `<link rel="canonical" href="URL">` on all pages
  Prevents duplicate content issues.

### **Indexing Control**

* Robots.txt configured correctly
* No accidental `noindex` during development
* Use `<meta robots="noindex, nofollow">` only when needed

### **Sitemap**

* `sitemap.xml`
* Submit to Search Console / Bing Webmaster Tools
* Automatically updated if possible

---

# 4️⃣ CONTENT & ONSITE SEO

### **Keywords & Relevance**

* Target one primary keyword per page
* Include keyword in:

  * Title
  * H1
  * URL (optional)
  * First 100 words
  * Image filenames & alt text
* Avoid keyword stuffing

### **Content Structure**

* Clear subheadings
* Short paragraphs
* Use bullet points
* Include helpful visuals, diagrams, or videos

### **Topical Authority**

* Create supporting pages (topic clusters)
* Internal linking to related content
* Insert breadcrumbs

---

# 5️⃣ INTERNAL LINKING & NAVIGATION

### **Internal Linking Best Practices**

* Use descriptive anchor text (“best gaming laptops” not “click here”)
* Link important pages often
* Use breadcrumbs
* Ensure footer links are logical, not spammy

### **Orphan Pages**

* Ensure every page has at least one internal link leading to it

---

# 6️⃣ STRUCTURED DATA (SCHEMA)

Add JSON-LD schema for:

* **Organization / Website**
* **BreadcrumbList**
* **Article** / **Product** / **Service** / **LocalBusiness**
* **FAQPage**, if using FAQs
* **Sitelinks Search Box**

Structured data boosts:

* rich snippets
* click-through rate
* crawl understanding

---

# 7️⃣ IMAGE & MEDIA OPTIMIZATION

### **Images**

* Use WebP/AVIF
* Include descriptive alt text
* Use responsive images (`srcset`)
* Proper caching headers

### **Videos**

* Host on YouTube or a CDN
* Lazy load if embedding

---

# 8️⃣ MOBILE & RESPONSIVE DESIGN

### **Critical Requirements**

* Mobile-first design
* Responsive layout
* Touch-friendly buttons
* Avoid intrusive mobile popups
* Use fluid typography and container queries

---

# 9️⃣ ACCESSIBILITY (ALSO BOOSTS SEO)

* Correct HTML semantics
* Labels for all inputs
* ARIA only when needed
* High color contrast
* Keyboard-navigable
* Alt text for all images
* Landmarks (`<main>`, `<nav>`, etc.)

---

# 🔟 SECURITY & INFRASTRUCTURE

* HTTPS enforced
* Secure headers

  * HSTS
  * X-Content-Type-Options
  * CSP
* Use a fast server
* Cloudflare or other CDN
* Avoid downtime
* Clean URLs (no backend tech leakage)

---

# 1️⃣1️⃣ CRAWLABILITY & LOG FILES

### **Server-Side Rendering (SSR) or Static**

If SEO is a priority, choose:

* **Static generation** (Next.js, Astro, Hugo, Jekyll)
* **SSR** for dynamic sites

Avoid heavy client-side rendering (CSR-only React).

### **Crawl Budget Optimization**

* No infinite URL loops
* Avoid parameter pages unless needed
* Paginate long lists
* Use canonical tags on filtered/sorted pages

---

# 1️⃣2️⃣ ANALYTICS & TRACKING

* Google Search Console
* Google Analytics / GA4
* Bing Webmaster Tools
* Add website to Google Business Profile if local

---

# 1️⃣3️⃣ LAUNCH CHECKLIST

Before going live:

* Remove all test content
* Remove all temporary `noindex`
* Ensure sitemap is reachable
* Test robots.txt
* Check all 404s
* Validate structured data
* Speed test with Lighthouse & PageSpeed Insights

---

# 1️⃣4️⃣ BONUS: ADVANCED SEO

### If you want to go even deeper:

* Multi-language support with hreflang
* Edge caching for HTML
* Pre-rendering dynamic content
* Paginated schema for blog categories
* Implement search intent mapping
* Create evergreen content calendars
* Automated internal linking algorithms

---

