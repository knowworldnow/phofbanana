import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

const socialLinks = [
  { name: 'Facebook', icon: '/facebook.svg', url: 'https://fb.com/dailyfornex' },
  { name: 'Twitter', icon: '/twitter.svg', url: 'https://twitter.com/dailyfornex' },
  { name: 'Instagram', icon: '/instagram.svg', url: 'https://instagram.com/dailyfornex' },
  { name: 'Pinterest', icon: '/pinterest.svg', url: 'https://pinterest.com/dailyfornex' },
  { name: 'YouTube', icon: '/youtube.svg', url: 'https://youtube.com/dailyfornex' },
];

export const metadata: Metadata = {
  title: 'Contact Us - Daily Fornex',
  description: 'Get in touch with Daily Fornex for inquiries about forex news, financial updates, and market analysis. Reach us via email or social media.',
  openGraph: {
    title: 'Contact Daily Fornex',
    description: 'Connect with Daily Fornex for the latest in forex news and financial insights. Reach out via email or our social media channels.',
    url: 'https://dailyfornex.com/contact',
    siteName: 'Daily Fornex',
    images: [
      {
        url: 'https://dailyfornex.com/og-image-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Daily Fornex',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Daily Fornex',
    description: 'Reach out to Daily Fornex for forex news, financial updates, and market analysis.',
    images: ['https://dailyfornex.com/twitter-image-contact.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Contact Us</h1>
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          We&apos;d love to hear from you! If you have any questions about forex news, financial updates, or market analysis, please don&apos;t hesitate to reach out to us.
        </p>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Email Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You can contact us directly via email at:{' '}
            <a href="mailto:admin@dailyfornex.com" className="text-blue-600 hover:underline">
              admin@dailyfornex.com
            </a>
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Connect on Social Media</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Follow us and reach out on our social media platforms for the latest forex news and financial insights:
          </p>
          <div className="flex flex-wrap justify-between gap-2">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Image src={link.icon} alt={`${link.name} icon`} width={24} height={24} className="mr-2" />
                <span className="text-gray-800 dark:text-gray-200">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          We aim to respond to all inquiries about forex news and financial updates within 24-48 hours. Thank you for your interest in Daily Fornex!
        </p>
      </div>
    </div>
  );
}
