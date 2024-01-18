import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import Dashboard from './Components/DashBoard';
import Navbar from './Components/Navbar';
import { AllRoutes } from './Routes/AllRoutes';

function App() {
  const [authStatus, setAuthStatus] = useState(false);
  return (
    <ChakraProvider>
     <Navbar authStatus={authStatus} setAuthStatus={setAuthStatus} />
    <AllRoutes/>
    </ChakraProvider>
  );
}

export default App;
