import { Box, Container, Heading, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import Nav from "./Nav";

const ImprintComp: React.FC = () => {
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
          Imprint
        </Heading>

        <Text fontSize="lg" mb={2}>
          <strong>Address:</strong>
          <br />
          I12 - Department for Bioinformatics and Computational Biology
          <br />
          School of Computation, Information and Technology
          <br />
          Boltzmannstraße 3<br />
          85748 Garching
          <br />
          Germany
        </Text>

        <Text fontSize="lg" mt={4} mb={2}>
          <strong>Authorized Representative:</strong>
          <br />
          Technical University of Munich is a statutory body under public law
          (Art. 11 Abs. 1 BayHSchG). It is legally represented by the President,
          Prof. Dr. Thomas F. Hofmann.
        </Text>

        <Text fontSize="lg" mt={4} mb={2}>
          <strong>Supervisory Authority:</strong>
          <br />
          Bavarian State Ministry of Science and the Arts (Bayerisches
          Staatsministerium für Wissenschaft und Kunst)
        </Text>

        <Text fontSize="lg" mt={4} mb={2}>
          <strong>VAT ID:</strong>
          <br />
          DE811193231 (§27a UStG)
        </Text>

        <Text fontSize="lg" mt={4} mb={2}>
          <strong>Responsible for Content:</strong>
          <br />
          Prof. Dr. Burkhard Rost
          <br />
          Boltzmannstraße 3<br />
          85748 Garching
          <br />
          assistant. (at) .rostlab.org
          <br />
          Tel: +49 (89) 289-17811
          <br />
          Fax: +49 (89) 289-19414
        </Text>

        {/* <Text fontSize="lg" mt={4} mb={2}>
          <strong>Implementation:</strong>
          <br />
          LambdaPP was implemented by the Rostlab using React. Technical
          details, assistance, and open issues can be found on{" "}
          <Link href="https://github.com" isExternal color="teal.500">
            GitHub
          </Link>
          .
        </Text> */}

        <Text fontSize="lg" mt={4} mb={2}>
          <strong>Legal disclaimer:</strong>
          <br />
          In spite of regularily monitoring the linked resources with great
          care, we do not accept any responsibility for the content of external
          links. The operators of these websites are solely responsible for
          their content.
        </Text>
      </Container>
    </Box>
  );
};

export default ImprintComp;
