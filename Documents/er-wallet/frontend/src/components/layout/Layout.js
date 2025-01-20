import React from "react";
import { Box, Container, Toolbar, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Toolbar /> {/* This creates space for the fixed navbar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
