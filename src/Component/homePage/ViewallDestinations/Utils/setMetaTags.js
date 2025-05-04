export const setMetaTags = ({
    title,
    description,
    keywords,
    robots,
    canonical,
    structuredData,
  }) => {
    // Set document title
    document.title = title;
  
    // Helper to set or create meta tag
    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
  
    // Helper to set or create link tag
    const setLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };
  
    // Set meta tags
    if (description) setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    if (robots) setMeta('robots', robots);
    if (canonical) setLink('canonical', canonical);
  
    // Set structured data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(structuredData);
    }
  
    // Return cleanup function
    return () => {
      if (description) {
        const meta = document.querySelector(`meta[name="description"]`);
        if (meta && meta.content === description) meta.remove();
      }
      if (keywords) {
        const meta = document.querySelector(`meta[name="keywords"]`);
        if (meta && meta.content === keywords) meta.remove();
      }
      if (robots) {
        const meta = document.querySelector(`meta[name="robots"]`);
        if (meta && meta.content === robots) meta.remove();
      }
      if (canonical) {
        const link = document.querySelector(`link[rel="canonical"]`);
        if (link && link.href === canonical) link.remove();
      }
      if (structuredData && script) {
        script.remove();
      }
    };
  };