import { Flex, Spacer, Input, Image, Menu, MenuButton, MenuList, MenuItem, Button, HStack } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaCrown, FaRegUser } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { FiDownload, FiHelpCircle, FiSettings } from "react-icons/fi";
import { FcAbout } from "react-icons/fc";
import { RiLogoutCircleRLine } from "react-icons/ri"
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/userSlice";
import { logoutstatus } from "../../app/statusLoginSlice";

const baseStyle = {
  color: 'gray',
  paddingBottom: '4px',
  borderBottom: 'none'
}

const activeStyle = {
  color: 'white',
  paddingBottom: '4px',
  borderBottom: '2px solid white'
}

const cookies = new Cookies();

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [isLoggedin, setIsLoggedin] = useState(false);
  const { isLoggedIn } = useSelector(state => state.statusLogin);
  //  const { isLogin, setIsLogin, data } = useContext(AppContext);

  useEffect(() => {
    console.log(isLoggedIn);
  }, [])

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutstatus())
    cookies.remove("accessToken", {
      path: '/',
      maxAge: 0,
    });
    cookies.remove("role", {
      path: '/',
      maxAge: 0,
    });
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('email')
    localStorage.removeItem('fullname')
    localStorage.removeItem('image')
    localStorage.removeItem('id')
    navigate('/login')
  }

  return (
    <Flex gap={7} p={5} align="center" position="sticky" top='0' zIndex='7' borderBottom='1px solid rgb(27, 27, 27)' bg='rgb(15, 6, 23)'>
      <Image onClick={() => { navigate('/home') }} cursor='pointer' h='47px' src='https://seeklogo.com/images/N/nodejs-logo-D26404F360-seeklogo.com.png' alt='app logo' mr={4} />
      <NavLink to="/home" style={({ isActive }) => isActive ? activeStyle : baseStyle}>Home</NavLink>
      {isLoggedIn && <NavLink to="/face-detect-image" style={({ isActive }) => isActive ? activeStyle : baseStyle}>Face Detect Image</NavLink>}
      {isLoggedIn && <NavLink to="/face-detect-realtime" style={({ isActive }) => isActive ? activeStyle : baseStyle}>Face Detect Realtime</NavLink>}
      {isLoggedIn && <NavLink to="/face-detect-image-multipeople" style={({ isActive }) => isActive ? activeStyle : baseStyle}>Face Detect Multi People</NavLink>}
      {isLoggedIn && <NavLink to="/tensorflow" style={({ isActive }) => isActive ? activeStyle : baseStyle}>Tensorflow Page</NavLink>}
      <Spacer />
      <Input w='370px' color="white" focusBorderColor="purple.500" borderColor='rgb(111, 111, 111)' borderRadius="lg" placeholder="🔍 Search find something ~~ " />
      <HStack gap={2}>
        {!isLoggedIn && <NavLink className='nav-ls-btn' to="/login">Login</NavLink>}
        {!isLoggedIn && <NavLink className='nav-ls-btn' to="/register">Register</NavLink>}
        <Menu>
          <MenuButton as={Button} _hover='rgb(34, 26, 41)' bg='rgb(34, 26, 41)' p={3} borderRadius='50%'>
            <FaBars style={{ color: 'gray' }} />
          </MenuButton>
          <MenuList bg='rgb(15, 6, 23)' borderColor='rgb(29, 20, 37)' color='gray' borderRadius='lg' pr={4}>
            <MenuItem fontWeight='bold' bg='rgb(29, 20, 37)' m={2} borderRadius='lg' gap={2}><FaRegUser />Account {true && '( ' + 'thangduc.duong14@gmail.com' + ' )'}</MenuItem>
            <MenuItem fontWeight='bold' bg='rgb(29, 20, 37)' m={2} borderRadius='lg' gap={2}><FiSettings />Settings</MenuItem>
            <MenuItem fontWeight='bold' bg='rgb(29, 20, 37)' m={2} borderRadius='lg' gap={2}><FiHelpCircle />Help Center</MenuItem>
            {isLoggedIn && <MenuItem onClick={handleLogout} fontWeight='bold' bg='rgb(29, 20, 37)' m={2} borderRadius='lg' gap={2}><RiLogoutCircleRLine />Logout</MenuItem>}
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}

export default Navbar;
