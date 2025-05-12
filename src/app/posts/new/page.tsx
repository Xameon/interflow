import { Box } from '@chakra-ui/react';

import { CreatePostForm } from '@/components/posts/CreatePostForm';

export const CreatePostPage = () => {
  return (
    <Box maxW='xl' mx='auto' mt='8'>
      <CreatePostForm />
    </Box>
  );
};

export default CreatePostPage;
