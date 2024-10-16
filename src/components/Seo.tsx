import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  ogImageAlt: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType,
  ogImage,
  ogImageAlt,
  publishedTime,
  modifiedTime,
  author,
  siteName,
}) => {
  const formattedCanonicalUrl = canonicalUrl.replace(/\/$/, '');

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={formattedCanonicalUrl} />
      
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={formattedCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={siteName} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={formattedCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
      <meta property="linkedin:title" content={title} />
      <meta property="linkedin:description" content={description} />
      <meta property="linkedin:image" content={ogImage} />
      
      <meta name="pinterest:title" content={title} />
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={ogImage} />
      
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={ogImage} />
    </Head>
  );
};

export default SEO;
