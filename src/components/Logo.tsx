import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.webp"
        alt="pH of Banana Logo"
        width={240}
        height={80}
        className="w-auto h-12 md:h-16"
        priority
      />
    </Link>
  );
};

export default Logo;
