import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';

const socialLinks = [
  { name: 'Facebook', icon: '/facebook.svg', url: 'https://fb.com/phofbanana' },
  { name: 'Twitter', icon: '/twitter.svg', url: 'https://twitter.com/phofbanana' },
  { name: 'Instagram', icon: '/instagram.svg', url: 'https://instagram.com/phofbanana' },
  { name: 'Pinterest', icon: '/pinterest.svg', url: 'https://pinterest.com/phofbanana' },
  { name: 'YouTube', icon: '/youtube.svg', url: 'https://youtube.com/phofbanana' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-black text-gray-600 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left Column - Logo and Contact Info */}
          <div className="mb-6 md:mb-0">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="mt-4 mb-2">Your every feedback is important.</p>
            <p>Kindly email us at: <a href="mailto:admin@phofbanana.com" className="text-blue-500 hover:underline">admin@phofbanana.com</a></p>
          </div>

          {/* Right Column - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Part */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} pH of Banana All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image 
                  src={social.icon} 
                  alt={`${social.name} icon`} 
                  width={48} 
                  height={48} 
                  className="w-15 h-15" 
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
