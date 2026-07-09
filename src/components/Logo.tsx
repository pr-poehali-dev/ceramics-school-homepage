const LOGO_URL =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/85c661c4-3d31-4162-87f9-898d5ae1514d.png';

interface LogoProps {
  className?: string;
  scale?: boolean;
}

const Logo = ({ className = 'h-[1.8rem] md:h-8', scale = true }: LogoProps) => (
  <img
    src={LOGO_URL}
    alt="Дымов Керамика"
    className={`w-auto object-contain ${scale ? 'scale-[0.7]' : ''} ${className.includes('origin-') ? '' : 'origin-left'} ${className}`}
  />
);

export default Logo;