import { Box, For, Heading, Text, VStack } from '@chakra-ui/react';

import { getPosts } from '@/lib/api/posts';

const PostsPage = async () => {
  const posts = res.data;

  return (
    <Box>
      <For each={posts}>
        {post => (
          <VStack key={post.id}>
            <Heading>{post.title}</Heading>
            <Text>{post.description}</Text>
          </VStack>
        )}
      </For>
    </Box>
  );
};

export default PostsPage;
