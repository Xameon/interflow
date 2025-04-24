import { Box, For, Heading, Text, Image, Center } from '@chakra-ui/react';
import { cookies } from 'next/headers';

import { PostActions } from '@/components/posts/PostActions';
import { jwtTokenVerify } from '@/lib';
import pool from '@/lib/db';
import { DatabasePost, Post } from '@/models/posts.model';

const getPostsFromDB = async (): Promise<Post[]> => {
  const result = await pool.query(`
    SELECT
  p.id,
  p.title,
  p.description,
  p.created_at,
  p.updated_at,
  u.name AS author_name,
  u.avatar_url AS author_avatar_url,
  u.id AS author_id,
  (
    SELECT json_agg(image_url)
    FROM post_images
    WHERE post_id = p.id
  ) AS image_urls,
  (
    SELECT COUNT(*)
    FROM likes
    WHERE post_id = p.id
  ) AS likes_count,
  (
    SELECT COUNT(*)
    FROM comments
    WHERE post_id = p.id
  ) AS comments_count
FROM posts p
JOIN users u ON u.id = p.user_id
WHERE p.deleted_at IS NULL
ORDER BY p.created_at DESC;
`);

  return (result.rows as DatabasePost[]).map(dbPost => {
    const {
      author_id,
      author_avatar_url,
      author_name,
      created_at,
      updated_at,
      image_urls,
      likes_count,
      comments_count,
      ...restData
    } = dbPost;

    return {
      ...restData,
      author: {
        id: author_id,
        avatarUrl: author_avatar_url,
        username: author_name,
      },
      createdAt: created_at,
      commentsCount: comments_count,
      likesCount: likes_count,
      updatedAt: updated_at,
      imageUrls: image_urls,
    };
  });
};

const PostsPage = async () => {
  const cookiesList = await cookies();

  const posts = await getPostsFromDB();

  const token = cookiesList.get('token');

  const jwtPayload = await jwtTokenVerify(token?.value);

  const userId = jwtPayload?.id;

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxW: '4xl',
        mx: 'auto',
      }}
    >
      <For each={posts}>
        {post => (
          <Box
            key={post.id}
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              padding: '1rem',
              rounded: 'lg',
              shadow: 'sm',
              justifyContent: 'start',
            }}
          >
            <Heading>{post.title}</Heading>
            <Center>
              {post.imageUrls?.[0] && (
                <Image
                  src={post.imageUrls[0]}
                  alt='Post Image'
                  width='md'
                  height='md'
                />
              )}
            </Center>
            <Text>{post.description}</Text>
            <Text>Created: {post.createdAt.toLocaleString()}</Text>
            <Text>Author: {post.author.username}</Text>
            {userId === post.author.id && <PostActions id={post.id} />}
          </Box>
        )}
      </For>
    </Box>
  );
};

export default PostsPage;
