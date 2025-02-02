import { InfoIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const QuickAccessLinks: React.FC = () => {
  return (
    <Box
      position="fixed"
      right="4.25rem"
      bottom="1.25rem"
      display="flex"
      flexDirection="row"
      alignItems="flex-end"
      gap="0.5rem"
    >
      <Tooltip label="Guidelines" hasArrow placement="top">
        <IconButton
          as={RouterLink}
          to="/guideline"
          icon={<QuestionOutlineIcon />}
          aria-label="Go to Guideline"
          colorScheme="orange"
          size="md"
        />
      </Tooltip>

      <Tooltip label="Imprint" hasArrow placement="top">
        <IconButton
          as={RouterLink}
          to="/imprint"
          icon={<InfoIcon />}
          aria-label="Go to Imprint"
          colorScheme="red"
          size="md"
        />
      </Tooltip>
    </Box>
  );
};

export default QuickAccessLinks;
