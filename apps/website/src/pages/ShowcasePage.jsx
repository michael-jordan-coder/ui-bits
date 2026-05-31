import { Box, Text } from '@chakra-ui/react';
import Navbar from '../components/landingnew/Navbar/Navbar';

const ShowcasePage = () => (
  <main className="app-container">
    <Navbar />
    <Box maxW="900px" mx="auto" p="4em 2em">
      <Text color="#fff" fontSize="32px" fontWeight={600}>
        Showcase
      </Text>
      <Text color="#a1a1aa" mt={3}>
        Projects built with ui bits will appear here.
      </Text>
    </Box>
  </main>
);

export default ShowcasePage;
