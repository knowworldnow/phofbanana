import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitComment } from '../lib/faust-api';

interface CommentFormProps {
  postId: string;
}

interface CommentInput {
  author_name: string;
  author_email: string;
  content: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: CommentInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const result = await submitComment({
        ...data,
        post: postId,
      });
      if (result.createComment.success) {
        reset();
        setSubmitSuccess(true);
      } else {
        setSubmitError('Failed to submit comment. Please try again.');
      }
    } catch (error) {
      setSubmitError('An error occurred while submitting the comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <h3 className="text-xl font-semibold">Leave a Comment</h3>
      <div>
        <label htmlFor="author_name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="author_name"
          {...register('author_name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.author_name && <p className="mt-1 text-sm text-red-600">{errors.author_name.message}</p>}
      </div>
      <div>
        <label htmlFor="author_email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="author_email"
          {...register('author_email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.author_email && <p className="mt-1 text-sm text-red-600">{errors.author_email.message}</p>}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          id="content"
          rows={4}
          {...register('content', { required: 'Comment is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      {submitSuccess && <p className="text-sm text-green-600">Comment submitted successfully and is awaiting moderation.</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
