import { useEffect, useState } from 'react';
import func2url from '../../backend/func2url.json';

interface BannerData {
  enabled: boolean;
  text: string;
}

const AnnouncementBanner = () => {
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    let active = true;
    fetch(func2url.banner)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BannerData | null) => {
        if (active && data) setBanner(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!banner || !banner.enabled || !banner.text.trim()) return null;

  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="container flex min-h-[40px] items-center justify-center py-2 text-center text-xs leading-snug sm:text-sm">
        <p className="max-w-4xl">{banner.text}</p>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
