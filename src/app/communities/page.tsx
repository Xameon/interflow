import { Box } from '@chakra-ui/react';

import { CommunitiesList } from '@/components/communities/CommunitiesList';

const CommunitiesPage = async () => {
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
      <CommunitiesList />
    </Box>
  );
};

export default CommunitiesPage;
