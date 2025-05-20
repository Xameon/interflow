'use client';

import { Box, FileUpload, FileUploadRootProps, Icon } from '@chakra-ui/react';
import { LuUpload } from 'react-icons/lu';

export const ImagesUploader = ({ ...props }: FileUploadRootProps) => {
  return (
    <FileUpload.Root
      {...props}
      accept='image/png, image/jpeg, image/jpg'
      maxFileSize={10 * 1024 * 1024}
    >
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size='md' color='fg.muted'>
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color='fg.muted'>.png, .jpg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map(file => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreviewImage h='5rem' w='5rem' />
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger />
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
    </FileUpload.Root>
  );
};
