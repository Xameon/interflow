'use client';

import {
  Box,
  IconButton,
  Image,
  Flex,
  VStack,
  HStack,
  Button,
  Center,
} from '@chakra-ui/react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type ImageCarouselProps = {
  images: string[];
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <VStack gap='4'>
      <Box overflow='hidden' ref={emblaRef}>
        <Flex ml='-4'>
          {images.map((src, index) => (
            <Center
              key={index}
              flex='0 0 100%'
              pl='4'
              maxH='lg'
              overflow='hidden'
            >
              <Center roundedTop='lg' overflow='hidden' w='full' h='full'>
                <Image
                  src={src}
                  alt={`Post image ${index + 1}`}
                  style={{ objectFit: 'cover' }}
                />
              </Center>
            </Center>
          ))}
        </Flex>
      </Box>
      {images.length > 1 && (
        <HStack justify='space-between' w='full' px='4'>
          <HStack>
            <IconButton
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              variant='surface'
              size='sm'
            >
              <MdChevronLeft />
            </IconButton>
            <IconButton
              onClick={scrollNext}
              disabled={!canScrollNext}
              variant='surface'
              size='sm'
            >
              <MdChevronRight />
            </IconButton>
          </HStack>
          <HStack>
            {images.map((_, index) => (
              <Button
                key={index}
                onClick={() => scrollTo(index)}
                variant={index === selectedIndex ? 'solid' : 'outline'}
                rounded='full'
                width='3'
                height='3'
                minW='10px'
                p='0'
              />
            ))}
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};
