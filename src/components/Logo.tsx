import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative w-[240px] h-[80px]">
        <Image
          src="/logo.webp"
          alt="pH of Banana Logo"
          fill
          sizes="(max-width: 768px) 180px, 240px"
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
