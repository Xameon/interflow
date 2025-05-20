'use client';

import { Flex } from '@chakra-ui/react';
import { useWindowSize } from '@uidotdev/usehooks';

import { DesktopHeader } from './components/DesktopHeader';
import { MobileHeader } from './components/MobileHeader';
import { NavActions } from './components/NavActions';

export const NavHeader = () => {
  const windowSize = useWindowSize();

  const mobile = (windowSize.width ?? 0) < 720;

  return (
    <Flex
      as='header'
      css={{
        justifyContent: mobile ? 'space-between' : 'center',
        w: 'full',
        p: '4',
        position: 'sticky',
        boxShadow: 'sm',
        roundedBottom: 'md',
      }}
    >
      {!mobile ? <DesktopHeader /> : <MobileHeader />}
      <NavActions />
    </Flex>
  );
};
