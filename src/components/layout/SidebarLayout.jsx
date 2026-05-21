import { Box } from '@chakra-ui/react';
import Navbar from '../landingnew/Navbar/Navbar';
import Sidebar from '../navs/Sidebar';

export default function SidebarLayout({ children }) {
  return (
    <main className="app-container">
      <Navbar showDocs />
      <section className="category-wrapper">
        <Sidebar />
        <Box minW={0}>{children}</Box>
      </section>
    </main>
  );
}
