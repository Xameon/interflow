import { Box } from '@chakra-ui/react';

import { CreateCommunityForm } from '@/components/communities/CreateCommunityForm';

const CreateCommunityPage = () => {
  return (
    <Box maxW='xl' mx='auto' mt='8'>
      <CreateCommunityForm />
    </Box>
  );
};

export default CreateCommunityPage;
