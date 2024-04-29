import { Box, Container, Heading, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import Nav from "./Nav";

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
          Welcome to the guideline page. Here, you'll find the rules and
          guidelines for using this application effectively.
        </Text>
        <Heading as="h2" size="md" mt={6} mb={2}>
          Formatting Your JSON File
        </Heading>
        <Text fontSize="md" mb={2}>
          Ensure your JSON file matches the following structure to be compatible
          with the application:
        </Text>
        <pre
          style={{ background: colorMode === "dark" ? "gray.700" : "gray.50" }}
        >
          {`{
  "protein_data": {
    "ProteinID1": {
      "features": {
        "category": "CategoryValue",
        "group": GroupNumber
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
