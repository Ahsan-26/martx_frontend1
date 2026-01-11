import React from "react";
import Sidebar from "./Sidebar";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const MainSellerPage = () => {
  return (
    <Box display="flex" height="100vh" overflow="hidden">
      {/* Sidebar always visible on the left */}
      <Sidebar />

      {/* Dynamic content displayed next to the sidebar */}
      <Box flex="1" p="4" overflowY="auto" bg="#0A0E23">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainSellerPage;
