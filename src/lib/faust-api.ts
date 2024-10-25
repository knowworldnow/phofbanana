import { gql } from '@apollo/client';
import { client } from './apollo-client';
import { Post, Category, Page, CommentInput, GetAllPostsResult, GetPageBySlugResult, GetPostBySlugResult, GetCategoriesResult, GetPostsByCategoryResult, GetCategoryBySlugResult, GetAllCategoriesResult, SearchPostsResult } from '../types';

export async function getLatestPosts({ first = 20, after = null }: { first?: number; after?: string | null } = {}): Promise<GetAllPostsResult> {
  const { data } = await client.query<GetAllPostsResult>({
    query: gql`
      query GetLatestPosts($first: Int!, $after: String) {
        posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    variables: { first, after },
  });

  return data;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await client.query<GetPostBySlugResult>({
    query: gql`
      query GetPostBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          title
          content
          date
          excerpt
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          comments(where: { status: "APPROVE" }) {
            nodes {
              id
              content
              date
              author {
                node {
                  name
                  email
                  isRestricted
                  avatar {
                    url
                  }
                }
              }
            }
          }
          faqItems {
            question
            answer
          }
        }
      }
    `,
    variables: { slug },
  });

  return data.post;
}
export async function getRelatedPosts(categoryId: string, currentPostId: string, first: number = 4): Promise<Post[]> {
  if (!categoryId) {
    console.error('categoryId is undefined or null');
    return [];
  }

  console.log('Fetching related posts with:', { categoryId, currentPostId, first });

  try {
    const { data } = await client.query<{ posts: { nodes: Post[] } }>({
      query: gql`
        query GetRelatedPosts($categoryId: ID!, $currentPostId: ID!, $first: Int!) {
          posts(
            first: $first,
            where: { categoryIn: [$categoryId], notIn: [$currentPostId] }
          ) {
            nodes {
              id
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              author {
                node {
                  name
                }
              }
            }
          }
        }
      `,
      variables: { categoryId, currentPostId, first },
    });

    console.log('Related posts fetched:', data.posts.nodes);
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await client.query<GetCategoriesResult>({
    query: gql`
      query GetCategories {
        categories(first: 100) {
          nodes {
            id
            name
            slug
            count
            description
          }
        }
      }
    `,
  });

  return data.categories.nodes;
}

export async function getPostsByCategory(categorySlug: string, first: number, after: string | null = null) {
  const { data } = await client.query<GetPostsByCategoryResult>({
    query: gql`
      query GetPostsByCategory($categorySlug: String!, $first: Int!, $after: String) {
        posts(where: { categoryName: $categorySlug }, first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    variables: { categorySlug, first, after },
  });

  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await client.query<GetCategoryBySlugResult>({
    query: gql`
      query GetCategoryBySlug($slug: ID!) {
        category(id: $slug, idType: SLUG) {
          id
          name
          slug
          count
          description
        }
      }
    `,
    variables: { slug },
  });

  return data.category;
}

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await client.query<GetAllCategoriesResult>({
    query: gql`
      query GetAllCategories {
        categories(first: 100) {
          nodes {
            id
            name
            slug
            count
            description
          }
        }
      }
    `,
  });

  return data.categories.nodes;
}

export async function searchPosts(searchTerm: string, first: number = 10): Promise<Post[]> {
  const { data } = await client.query<SearchPostsResult>({
    query: gql`
      query SearchPosts($searchTerm: String!, $first: Int!) {
        posts(first: $first, where: { search: $searchTerm }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    variables: { searchTerm, first },
  });

  return data.posts.nodes;
}

export async function submitComment(postId: string, name: string, email: string, content: string) {
  const commentInput = {
    post_id: parseInt(postId, 10),
    author_name: name,
    author_email: email,
    content: content,
  };

  console.log('Submitting comment:', commentInput);

  const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/custom/v1/submit-comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentInput),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  const responseData = await response.json();
  console.log('Response data:', responseData);

  if (!response.ok) {
    throw new Error(`Failed to submit comment: ${responseData.message || response.statusText}`);
  }

  return responseData;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data } = await client.query<GetPageBySlugResult>({
    query: gql`
      query GetPageBySlug($slug: ID!) {
        page(id: $slug, idType: URI) {
          id
          title
          content
          date
          slug
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `,
    variables: { slug },
  });

  return data.page;
}

export async function getAllPosts(): Promise<Post[]> {
  const { data } = await client.query<GetAllPostsResult>({
    query: gql`
      query GetAllPosts {
        posts(first: 1000, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            excerpt
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
                mimeType
              }
            }
            author {
              node {
                name
                databaseId
              }
            }
            categories {
              nodes {
                name
                slug
                databaseId
              }
            }
          }
        }
      }
    `,
  });

  return data.posts.nodes;
}

export async function getAllPages(): Promise<Page[]> {
  const { data } = await client.query<{ pages: { nodes: Page[] } }>({
    query: gql`
      query GetAllPages {
        pages(first: 1000) {
          nodes {
            id
            title
            slug
            date
            excerpt
          }
        }
      }
    `,
  });

  return data.pages.nodes;
}
