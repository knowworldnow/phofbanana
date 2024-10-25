import React from 'react';
import Image from 'next/image';
import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Image
                src={comment.author.node.avatar?.url || '/default-avatar.png'}
                alt={`${comment.author.node.name}'s avatar`}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <div className="font-semibold text-gray-800 dark:text-white">{comment.author.node.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(comment.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div 
              className="mt-2 text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: comment.content.rendered }} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
