import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
}

function setMetaTag(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOgTag(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMetaTag('description', description);
    setOgTag('og:title', title);
    setOgTag('og:description', description);
  }, [title, description]);
}

export default usePageMeta;
