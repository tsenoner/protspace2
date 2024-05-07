import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import Nav from "./Nav";
import {
  ChevronDoubleRightIcon,
  CogIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  MapIcon,
} from "@heroicons/react/24/solid";
import { BsFiletypePng, BsFiletypeSvg } from "react-icons/bs";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const GuidelineComp: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      minH="100vh"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      color={colorMode === "dark" ? "white" : "gray.800"}
    >
      <Nav />
      <Container maxW="container.md" py={5}>
        <Heading as="h1" mb={4}>
          Guideline
        </Heading>
        <Text fontSize="lg" mb={2}>
          Welcome to the guideline page. Here you'll find detailed information
          about ProtSpace.
        </Text>

        <Heading as="h2" size="md" mt={6} mb={2}>
          Application Controls
        </Heading>
        <Text fontSize="md" mb={2}>
          The application interface includes several interactive controls
          designed to enhance your experience:
        </Text>

        <Flex direction="column" gap="4" mb="4">
          <Flex align="center">
            <ChevronDoubleRightIcon className="h-6 w-6 text-blue-500 mr-2" />
            <Text>
              <strong>Toggle Controller:</strong> Toggle the visibility of the
              control menu.
            </Text>
          </Flex>
          <Flex align="center">
            {colorMode === "light" ? (
              <MdDarkMode className="h-6 w-6 text-gray-600 mr-2" />
            ) : (
              <MdLightMode className="h-6 w-6 text-gray-600 mr-2" />
            )}
            <Text>
              <strong>Dark/Light Mode Toggle:</strong> Switch between dark and
              light mode.
            </Text>
          </Flex>
          <Flex align="center">
            <BsFiletypePng className="h-6 w-6 text-yellow-600 mr-2" />
            <Text>
              <strong>Download Plot:</strong> Save the current plot as a PNG
              file.
            </Text>
          </Flex>
          <Flex align="center">
            <BsFiletypeSvg className="h-6 w-6 text-blue-200 mr-2" />
            <Text>
              <strong>Download as SVG:</strong> Export the visualization in SVG
              format.
            </Text>
          </Flex>
          <Flex align="center">
            <MapIcon className="h-6 w-6 text-green-500 mr-2" />
            <Text>
              <strong>Show/Hide Legend:</strong> Control the display of the
              legend.
            </Text>
          </Flex>
          <Flex align="center">
            <DocumentArrowDownIcon className="h-6 w-6 text-pink-500 mr-2" />
            <Text>
              <strong>Export Project:</strong> Export the current project's
              state as a JSON file.
            </Text>
          </Flex>
          <Flex align="center">
            <DocumentArrowUpIcon className="h-6 w-6 text-purple-500 mr-2" />
            <Text>
              <strong>Import Project:</strong> Import a project from a JSON
              file.
            </Text>
          </Flex>
          <Flex align="center">
            <CogIcon className="h-6 w-6 text-gray-500 mr-2" />
            <Text>
              <strong>Settings:</strong> Access projection settings.
            </Text>
          </Flex>
        </Flex>

        <Heading as="h2" size="md" mt={6} mb={2}>
          Formatting Your JSON File
        </Heading>
        <Text fontSize="md" mb={2}>
          Ensure your JSON file matches the following structure to be compatible
          with the application:
        </Text>
        <pre
          style={{
            background: colorMode === "dark" ? "gray.700" : "gray.50",
            padding: "1em",
            borderRadius: "8px",
          }}
        >
          {`{
  "protein_data": {
    "ProteinID1": {
      "features": {
        "category": "CategoryValue",
        "group": "GroupValue"
      }
    },
    ...
  },
  "projections": [
    {
      "name": "ProjectionName",
      "dimensions": DimensionNumber,
      "info": {
        "parameter1": "Value1",
        "parameter2": "Value2",
        ...
      },
      "data": [
        {
          "identifier": "ProteinID1",
          "coordinates": {
            "x": XCoordinate,
            "y": YCoordinate,
            "z": ZCoordinate // Optional based on dimensions
          }
        },
        ...
      ],
    }
  ]
}`}
        </pre>
      </Container>
    </Box>
  );
};

export default GuidelineComp;
