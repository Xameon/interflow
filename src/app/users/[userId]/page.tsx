import { Box } from '@chakra-ui/react';

import { UserProfile } from '@/components/users/UserProfile';
import { APIRequestContext } from '@/models';

const UserPage = async ({ params }: APIRequestContext<{ userId: string }>) => {
  const { userId } = await params;

  return (
    <Box
      css={{
        maxW: '4xl',
        mx: 'auto',
      }}
    >
      <UserProfile userId={userId} />
    </Box>
  );
};

export default UserPage;
