import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  useToast
} from '@chakra-ui/react';

const Login = ({ setAuthStatus }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok && responseData.token) {
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('isAuthenticated', 'true');
        setAuthStatus(true);
        navigate('/');
        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Authentication failed');
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while trying to log in. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" minH="100vh">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Heading mb={4}>Login</Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="teal" mt={4} onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;
