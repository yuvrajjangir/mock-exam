import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Heading, Spacer } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Flex align="center" p={4} bg="teal.500" color="white">
      <Box>
        <Heading size="md">Employee Management</Heading>
      </Box>
      <Spacer />
      <Box>
        <Link to="/" style={{ marginRight: '20px', color: 'white' }}>
          Dashboard
        </Link>
        <Link to="/login" style={{ color: 'white' }}>
          Login
        </Link>
      </Box>
    </Flex>
  );
};

export default Navbar;
