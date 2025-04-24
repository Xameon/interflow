import { Box } from '@chakra-ui/react';

import { PostsList } from '@/components/posts/PostsList';

const PostsPage = async () => {
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
      <PostsList />
    </Box>
  );
};

export default PostsPage;
