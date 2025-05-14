import { Box } from '@chakra-ui/react';

import { PostsList } from '@/components/posts/PostsList';

const PostsPage = async () => {
  return (
    <Box
      css={{
        maxW: '6xl',
        mx: 'auto',
        mt: '8',
      }}
    >
      <PostsList />
    </Box>
  );
};

export default PostsPage;
