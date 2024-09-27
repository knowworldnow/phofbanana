import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Daily Fornex',
  description: 'Meet the passionate team behind Daily Fornex, delivering insightful content on finance, technology, and more.',
  openGraph: {
    title: 'About Us - Daily Fornex',
    description: 'Meet the passionate team behind Daily Fornex, delivering insightful content on finance, technology, and more.',
    url: 'https://dailyfornex.com/about',
    siteName: 'Daily Fornex',
    images: [
      {
        url: 'https://dailyfornex.com/og-image-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Daily Fornex Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  description: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
    <div className="relative w-full aspect-square">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        style={{ border: 'none', outline: 'none' }}
      />
    </div>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{name}</h2>
      <p className="text-sm text-primary mb-4">{role}</p>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Meet Our Team</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <TeamMember
          name="Anmita Das"
          role="Web Developer & Content Creator"
          image="/anmita.webp"
          description="Anmita Das, an EEE graduate from CUET, is a dedicated web developer with a passion for blogging. She writes on diverse topics, committed to spreading reliable information and insights to her readers."
        />

        <TeamMember
          name="Shoumya Chowdhury"
          role="Web Developer & Content Strategist"
          image="/shoumya.webp"
          description="Shoumya Chowdhury, an EEE graduate from CUET, is a web developer and enthusiastic blogger. He shares well-researched content on various topics, focusing on providing authentic information to engage readers."
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Our Mission</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
          At Daily Fornex, we are dedicated to delivering accurate, insightful, and engaging content across a wide spectrum of topics. Our team of passionate writers and researchers work tirelessly to bring you the latest information and in-depth analysis on subjects that matter most to you. We strive to be your trusted source for knowledge and inspiration in the digital age.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Join Our Journey</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          We&apos;re always looking for passionate individuals to join our team. If you&apos;re excited about creating impactful content and sharing knowledge with the world, we&apos;d love to hear from you!
        </p>
        <Link href="/contact" className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary-dark transition-colors duration-200">
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
