export interface FAQItem {
  question: string;
  answer: string;
}

export interface CommentAuthor {
  name: string;
  email?: string;
  isRestricted?: boolean;
  avatar?: {
    url: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  date: string;
  author: {
    node: CommentAuthor;
  };
}

export interface CommentInput {
  post: number;
  author_name: string;
  author_email: string;
  content: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  author: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
  categories: {
    nodes: Category[];
  };
  comments?: {
    nodes: Comment[];
  };
  faqItems?: FAQItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
  excerpt?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
}

export interface PostCardProps {
  post: {
    slug: string;
    title: string;
    featuredImage?: {
      node: {
        sourceUrl: string;
        altText?: string;
      };
    };
    author: {
      node: {
        name: string;
        avatar?: {
          url: string;
        };
      };
    };
    date: string;
    categories: {
      nodes: {
        name: string;
        slug: string;
      }[];
    };
  };
}

export interface GetAllPostsResult {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Post[];
  };
}

export interface GetPageBySlugResult {
  page: Page | null;
}

export interface GetPostBySlugResult {
  post: Post | null;
}

export interface GetCategoriesResult {
  categories: {
    nodes: Category[];
  };
}

export interface GetPostsByCategoryResult {
  posts: {
    nodes: Post[];
  };
}

export interface GetCategoryBySlugResult {
  category: Category | null;
}

export interface GetAllCategoriesResult {
  categories: {
    nodes: Category[];
  };
}

export interface SearchPostsResult {
  posts: {
    nodes: Post[];
  };
}

export interface GetAllPagesResult {
  pages: {
    nodes: Page[];
  };
}

export interface SubmitCommentResult {
  createComment: {
    success: boolean;
    comment: Comment;
  };
}
