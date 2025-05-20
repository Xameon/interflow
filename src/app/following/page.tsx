import { Box } from '@chakra-ui/react';

import { PostsList } from '@/components/posts/PostsList';

const FollowingPage = async () => {
  return (
    <Box
      css={{
        maxW: '6xl',
        mx: 'auto',
        mt: '8',
      }}
    >
      <PostsList params={{ onlyFromFollowed: true }} />
    </Box>
  );
};

export default FollowingPage;
