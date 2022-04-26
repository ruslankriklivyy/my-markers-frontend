import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Link, Text } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

interface UploadFileProps {
  defaultValue?: string;
  onInput: (file: File | null) => void;
}

const UploadFile: FC<UploadFileProps> = ({ defaultValue, onInput }) => {
  const [file, setFile] = useState<File | null>(null);
  const [defaultFileLink, setDefaultFileLink] = useState<string | null>(null);

  const onDrop = useCallback((files: File[]) => {
    if (files) {
      const file = files[0];
      onInput(file);
      setFile(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = () => {
    setFile(null);
    setDefaultFileLink(null);
    onInput(null);
  };

  useEffect(() => {
    defaultValue && setDefaultFileLink(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <div className={'upload-file'} {...getRootProps()}>
        <input multiple={false} {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag 'n' drop some file here, or click</p>
        )}
      </div>
      {file && (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          mt={1}
        >
          <Text fontSize="sm">{file.name}</Text>
          <DeleteIcon
            w={4}
            h={4}
            color={'red.500'}
            style={{ cursor: 'pointer' }}
            onClick={removeFile}
          />
        </Box>
      )}
      {!file && defaultFileLink && (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          mt={1}
        >
          <Link
            href={defaultFileLink}
            color={'green.500'}
            style={{ fontSize: 16 }}
            isExternal
          >
            Link
          </Link>
          <DeleteIcon
            w={4}
            h={4}
            color={'red.500'}
            style={{ cursor: 'pointer' }}
            onClick={removeFile}
          />
        </Box>
      )}
    </>
  );
};

export default UploadFile;
