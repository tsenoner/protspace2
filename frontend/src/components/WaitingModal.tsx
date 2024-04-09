import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";

const VisualizationWaitingModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Waiting for Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" mb={4} />
          <Text textAlign="center">
            Please wait while we're fetching the visualization data from Colab.
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VisualizationWaitingModal;
