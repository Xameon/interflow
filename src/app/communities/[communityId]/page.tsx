import { Box } from '@chakra-ui/react';

import { CommunityProfile } from '@/components/communities/CommunityProfile';
import { APIRequestContext } from '@/models';

const CommunityPage = async ({
  params,
}: APIRequestContext<{ communityId: string }>) => {
  const { communityId } = await params;

  return (
    <Box
      css={{
        maxW: '3xl',
        mx: 'auto',
      }}
    >
      <CommunityProfile communityId={communityId} />
    </Box>
  );
};

export default CommunityPage;
