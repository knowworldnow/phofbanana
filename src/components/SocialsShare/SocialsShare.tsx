import Image from 'next/image';
import { FC } from 'react';

interface SocialsShareProps {
  link: string;
}

const SocialsShare: FC<SocialsShareProps> = ({ link }) => {
  const socials = [
    {
      name: 'Facebook',
      url: `https://facebook.com/sharer/sharer.php?u=${link}`,
      icon: '/images/socials/facebook.svg',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${link}`,
      icon: '/images/socials/x-twitter.svg',
    },
    {
      name: 'Instagram',
      url: `https://instagram.com`,
      icon: '/images/socials/instagram.svg',
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${link}`,
      icon: '/images/socials/pinterest.svg',
    },
  ];

  return (
    <div className="nc-SocialsShare flex items-center gap-4">
      <span className="text-neutral-900 dark:text-neutral-100">Feel free to share:</span>
      <div className="flex gap-3">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-12 w-12 rounded-full shadow-lg shadow-neutral-800/5 ring-1 ring-neutral-900/5 dark:border dark:border-neutral-700/50 dark:bg-neutral-400 dark:ring-0"
          >
            <Image src={social.icon} alt={social.name} width={24} height={24} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialsShare;
