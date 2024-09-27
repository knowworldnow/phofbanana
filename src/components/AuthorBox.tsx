import Image from 'next/image';

interface AuthorBoxProps {
  authorName: string;
}

const authorData = {
  'Anmita Das': {
    role: 'Blogger and Web Developer',
    description: 'Anmita Das is an EEE graduate from CUET and a dedicated web developer. Alongside her professional work, she has a passion for blogging and enjoys writing on a wide range of topics. Anmita believes in spreading real, reliable information through her blogs, helping readers gain knowledge and insights on various subjects.',
    image: '/anmita.webp'
  },
  'Shoumya Chowdhury': {
    role: 'Blogger and Web Developer',
    description: 'Shoumya Chowdhury, an EEE graduate from CUET, is currently working as a web developer. Apart from his career, Shoumya is enthusiastic about blogging, sharing well-researched content on diverse topics. He is committed to providing authentic information and values the opportunity to engage with readers through his writing.',
    image: '/shoumya.webp'
  }
};

export default function AuthorBox({ authorName }: AuthorBoxProps) {
  const author = authorData[authorName as keyof typeof authorData];

  if (!author) {
    return null;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row">
        <div className="flex items-center mb-4 sm:mb-0 sm:mr-6">
          <Image
            src={author.image}
            alt={`${authorName}'s profile picture`}
            width={80}
            height={80}
            className="rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold">{authorName}</h3>
            <p className="text-gray-600 dark:text-gray-400">{author.role}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-300">{author.description}</p>
        </div>
      </div>
    </div>
  );
}
