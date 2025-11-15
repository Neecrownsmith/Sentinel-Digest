import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../../utils/env';

const BRAND_NAME = 'Sentinel Digest';
const DEFAULT_TITLE = `${BRAND_NAME} | Insightful News, Jobs, and Trends`;
const DEFAULT_DESCRIPTION = 'Stay ahead with Sentinel Digest. Discover curated news, analysis, and career opportunities tailored for future-focused professionals.';
const DEFAULT_IMAGE = '';

function resolveUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return normalizeAbsoluteUrl(pathOrUrl);
  }

  if (!SITE_URL) {
    return '';
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL.replace(/\/$/, '')}${normalizedPath}`;
}

function normalizeAbsoluteUrl(url) {
  try {
    return new URL(url).toString();
  } catch (error) {
    console.warn('Invalid URL passed to SEO component, ignoring', url);
    return '';
  }
}

function toJsonLdArray(jsonLd) {
  if (!jsonLd) {
    return [];
  }

  return Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [jsonLd];
}

function Seo({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  noIndex = false,
  jsonLd,
  keywords,
  children,
}) {
  const resolvedTitle = title ? `${title} | ${BRAND_NAME}` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = resolveUrl(canonicalPath);
  const ogImage = resolveUrl(image) || DEFAULT_IMAGE;
  const robotsValue = noIndex ? 'noindex, nofollow' : 'index, follow';
  const jsonLdPayloads = toJsonLdArray(jsonLd);

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsValue} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={metaDescription} />
      {canonicalUrl && (
        <>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:url" content={canonicalUrl} />
        </>
      )}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {jsonLdPayloads.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      {children}
    </Helmet>
  );
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalPath: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  noIndex: PropTypes.bool,
  jsonLd: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  keywords: PropTypes.string,
  children: PropTypes.node,
};

export default Seo;
