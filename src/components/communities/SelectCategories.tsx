'use client';

import { Badge, Flex, For, HStack, Spinner, Text } from '@chakra-ui/react';

import { useCategories } from '@/hooks/communities/useCategories';

type SelectCategoriesProps = {
  value: string[];
  onChange: (value: { id: string; included: boolean }) => void;
};

export const SelectCategories = ({
  value,
  onChange,
}: SelectCategoriesProps) => {
  const { data: categories, isLoading: categoriesAreLoading } = useCategories(
    {},
  );

  if (categoriesAreLoading) {
    return (
      <HStack>
        <Spinner />
        <Text>Categories are loading...</Text>
      </HStack>
    );
  }

  if (!categories) return <Text>Sorry, but we cannot load categories now</Text>;

  return (
    <Flex w='full' wrap='wrap' gap='3' cursor='pointer'>
      <For each={categories}>
        {({ id, name }) => {
          const included = value.includes(id);

          return (
            <Badge
              size='md'
              key={id}
              variant={included ? 'subtle' : 'outline'}
              onClick={() => onChange({ id, included })}
            >
              {name}
            </Badge>
          );
        }}
      </For>
    </Flex>
  );
};
