import { Box } from '@chakra-ui/react';

import { SearchUsers } from '@/components/users/SearchUsers';

const UsersPage = () => {
  return (
    <Box mt='36' maxW='2xl' mx='auto'>
      <SearchUsers />
    </Box>
  );
};

export default UsersPage;
