import React, { FC, ReactNode } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface CustomModalProps {
  isOpen: boolean;
  title?: string;
  children?: ReactNode;
  onClose: () => void;
}

const CustomModal: FC<CustomModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
