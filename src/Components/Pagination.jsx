import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react'

const Pagination = ({ employeesPerPage, totalEmployees, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEmployees / employeesPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <Box mt={4}>
        <Text>Page:</Text>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            colorScheme={number === currentPage ? 'teal' : 'gray'}
            onClick={() => paginate(number)}
            size="sm"
          >
            {number}
          </Button>
        ))}
      </Box>
    );
  };


  export default Pagination;