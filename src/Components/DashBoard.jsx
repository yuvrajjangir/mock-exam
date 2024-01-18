import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  Input,
  IconButton,
  useToast,
  FormControl,
  FormLabel,
  Spinner,
} from '@chakra-ui/react';
import { FaTrashAlt, FaEdit  } from 'react-icons/fa';

const Dashboard = ({ authStatus, setAuthStatus }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Tech',
    salary: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setAuthStatus(false);
          return;
        }

        const response = await fetch('https://jsonserver-zi2b.onrender.com/employees', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setAuthStatus(false);
          localStorage.removeItem('authToken');
          return;
        }

        const data = await response.json();
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };
    fetchData();
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    if (storedAuthStatus === 'true') {
      setAuthStatus(true);
    }
  }, [setAuthStatus]);


  const handleAddEmployee = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: 'Tech',
      salary: '',
    });
    onOpen();
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
    onOpen();
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await fetch(`https://jsonserver-zi2b.onrender.com/employees/${employeeId}`, {
        method: 'DELETE',
      });

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId)
      );

      toast({
        title: 'Employee Deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the employee.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveEmployee = async () => {
    try {
      let response;

      if (selectedEmployee) {
        response = await fetch(
          `https://jsonserver-zi2b.onrender.com/employees/${selectedEmployee.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );

        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === selectedEmployee.id ? formData : employee
          )
        );
      } else {
        response = await fetch('https://jsonserver-zi2b.onrender.com/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const newEmployee = await response.json();
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
      }

      if (response.ok) {
        toast({
          title: 'Employee Saved',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        console.error('Error saving employee:', response);
        toast({
          title: 'Error',
          description: 'An error occurred while saving the employee.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the employee.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    setAuthStatus(false);
    setEmployees([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    toast({
      title: 'Logout Successful',
      description: 'You have successfully logged out!',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  

  return (
    <Box p={8}> 
     {authStatus && (
        <Button colorScheme="teal" mb={4} onClick={handleAddEmployee}>
          Add Employee
        </Button>
      )}
      {authStatus && (
        <Button colorScheme="red" mb={4} onClick={handleLogout}>
          Logout
        </Button>
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Department</Th>
            <Th>Salary</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        
        <Tbody>
            
          {employees.map((employee) => (
            <Tr key={employee.id}>
              <Td>{employee.firstName}</Td>
              <Td>{employee.lastName}</Td>
              <Td>{employee.email}</Td>
              <Td>{employee.department}</Td>
              <Td>{employee.salary}</Td>
              <Td>
                <IconButton
                style={{margin:"10px", marginLeft:"-20px"}}
                  colorScheme="blue"
                  aria-label="Edit Employee"
                  icon={<FaEdit/>}
                  onClick={() => handleEditEmployee(employee)}
                />
                <IconButton
                  colorScheme="red"
                  aria-label="Delete Employee"
                  icon={<FaTrashAlt />}
                  onClick={() => handleDeleteEmployee(employee.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner size="xl" />
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Department</FormLabel>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Tech">Tech</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Salary</FormLabel>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveEmployee}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;