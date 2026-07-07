const LOGO_URL =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/85c661c4-3d31-4162-87f9-898d5ae1514d.png';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = 'h-9 md:h-10' }: LogoProps) => (
  <img
    src={LOGO_URL}
    alt="Дымов Керамика"
    className={`w-auto scale-[0.7] object-contain ${className.includes('origin-') ? '' : 'origin-left'} ${className}`}
  />
);

export default Logo;