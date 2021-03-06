import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import CustomModal from './custom-modal';
import 'cropperjs/dist/cropper.css';
import { DeleteIcon } from '@chakra-ui/icons';

export interface UploadImageData {
  url: string;
  _id?: string;
}

interface UploadImageProps {
  image?: File | UploadImageData | null;
  onInput: (file: File) => void;
  onRemove: () => void;
}

const UploadImage: FC<UploadImageProps> = ({ image, onInput, onRemove }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [previewPhoto, setPreviewPhoto] = useState('');
  const cropperRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((files: File[]) => {
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setPreviewPhoto(URL.createObjectURL(file));
      onOpen();
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const saveCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;

    cropper.getCroppedCanvas().toBlob((blob: Blob) => {
      const newFile = new File([blob], 'file');
      onInput(newFile);
    });
    setPreviewPhoto(cropper.getCroppedCanvas().toDataURL());
    onClose();
  };

  const removePreview = () => {
    setPreviewPhoto('');
    onRemove();
  };

  useEffect(() => {
    if (image && 'url' in image) {
      setPreviewPhoto(image.url);
    }
  }, [image]);

  return (
    <>
      {isOpen && previewPhoto && (
        <CustomModal isOpen={isOpen} onClose={onClose}>
          <Box mt={5}>
            <Cropper
              src={previewPhoto}
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={16 / 9}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              responsive={true}
              autoCropArea={1}
              aspectRatio={4 / 3}
              checkOrientation={false}
            />
          </Box>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mt={10}
          >
            <Button onClick={() => onClose()}>Close</Button>

            <Button onClick={saveCrop} color={'green'}>
              Save
            </Button>
          </Box>
        </CustomModal>
      )}

      <Box className={'upload-image'} {...getRootProps()}>
        {previewPhoto && (
          <img className={'preview-image'} src={previewPhoto} alt={'preview'} />
        )}

        <input multiple={false} {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop some image here, or click</p>
        )}
      </Box>

      {previewPhoto && (
        <DeleteIcon
          onClick={removePreview}
          w={5}
          h={5}
          display={'block'}
          ml={'auto'}
          mt={2}
          color="red.500"
          cursor={'pointer'}
        />
      )}
    </>
  );
};

export default UploadImage;
