import * as React from "react";
import {
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { VscFeedback } from "react-icons/vsc";

const Feedback: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Tooltip label="Feedback" hasArrow placement="top">
        <IconButton
          aria-label="Open Feedback"
          icon={<VscFeedback />}
          colorScheme="teal"
          onClick={onOpen}
          ref={btnRef}
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
        />
      </Tooltip>
      <Drawer
        size={"lg"}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Feedback Form</DrawerHeader>

          <DrawerBody>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSet7EGbxmRYcgCWcpiGrsjCzrZ0N5pA0dHEn7x97pJmx0QXnQ/viewform?usp=sf_link"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Feedback Form"
            ></iframe>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={0} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Feedback;
