import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  ButtonGroup,
  Button,
  HStack,
  Text,
  Box,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
  Icon,
  FormControl,
  FormLabel,
  useColorMode,
  Divider,
  VStack,
  Select,
  useToast,
  Avatar,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

import { useSignIn, useAuthUser, useIsAuthenticated } from 'react-auth-kit';

import '../css/landingPage.css';

// MUI Icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import GoogleIcon from '@mui/icons-material/Google';

import { ColorModeIconButton } from '../components/ColorModeSwitcher';
import { PrimaryButton, PrimaryButtonOutline } from '../components/Buttons';
import { ModalOverlay, ModalContent, ModalFooter } from '../components/Modals';
import { textAlign } from '@mui/system';

// My Components
import { Input } from '../components/Inputs';

export default function LandingPage(props) {
  const DOMAIN_API = 'http://localhost:8080';

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === '1') {
      const signInBtn = document.querySelector('#signInBtn');
      signInBtn?.click();
    }
  });

  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const toast = useToast();

  const { colorMode } = useColorMode();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
  });

  // Coming Soon Toast
  function comingSoon() {
    toast({
      position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
      duration: 2000,
      title: 'Coming Soon! ╰(*°▽°*)╯ 💻',
      description: 'we are working on it for you.',
      isClosable: true,
    });
  }

  // SIGN UP SECTION
  const SignUp = () => {
    const [registerData, setRegisterData] = useState({
      shop_name: '',
      email: '',
      password: '',
    });

    const [confirmPassword, setConfirmPassword] = useState({
      password: '',
      ok: false,
    });

    const [isCreateAccountLoading, setIsCreateAccountLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    function signUp(e) {
      e.preventDefault();
      console.log('Creating Account...');
      console.log(registerData);
      setIsCreateAccountLoading(true);

      //! Simulasi loading
      setTimeout(() => {
        const adminRegisterAPI = new URL(
          `${DOMAIN_API}/api/v1/users/admin/register`
        );

        axios
          .post(adminRegisterAPI, registerData)
          .then(r => {
            console.log(r);
            setRegisterData({
              shop_name: '',
              email: '',
              password: '',
            });
            toast({
              position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
              title: 'Account created.',
              description: `your account has been registered!`,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            onClose();
            setIsCreateAccountLoading(false);
          })
          .catch(err => {
            console.log(err);
            setIsCreateAccountLoading(false);
            if (err.code === 'ERR_NETWORK') {
              toast({
                position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
                title: 'Sorry, fail create account ☹️.',
                description:
                  err.response?.data.data.error ||
                  'network error, might be the server or your internet connection.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            } else {
              toast({
                position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
                title: 'Sorry, fail to create account ☹️.',
                description: err.response.data.data.error,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
          });
      }, 1);
      //! Simulasi loading
    }

    return (
      <>
        <PrimaryButtonOutline
          id={'signUpBtn'}
          label="SIGN UP"
          onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />

          <ModalContent
            content={
              <>
                <ModalHeader>
                  <HStack>
                    <Icon
                      as={AccountCircleOutlinedIcon}
                      fontSize={'xx-large'}
                    />
                    <Text>Create Your Account</Text>
                  </HStack>
                </ModalHeader>

                <ModalBody pb={6}>
                  <Alert
                    borderRadius={'8px'}
                    status="info"
                    variant={'left-accent'}
                  >
                    <AlertIcon alignSelf={'flex-start'} />
                    Register your shop! This registered account will be admin
                    account of the shop.
                  </Alert>

                  <form id="signUpForm">
                    <FormControl mt={4} isRequired>
                      <FormLabel>Shop's Name</FormLabel>
                      <Input
                        placeholder={'e.g Kios Melati'}
                        value={registerData.shop_name}
                        onChange={e => {
                          setRegisterData({
                            ...registerData,
                            shop_name: e.target.value,
                          });
                        }}
                      />
                    </FormControl>

                    <FormControl mt={4} isRequired>
                      <FormLabel>E-mail</FormLabel>
                      <Input
                        placeholder={'e.g marcoleo@youremail.com'}
                        value={registerData.email}
                        onChange={e => {
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          });
                        }}
                      />
                    </FormControl>

                    <FormControl mt={4} isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type={'password'}
                        placeholder="Type strong password"
                        value={registerData.password}
                        onChange={e => {
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </form>

                  <HStack my={4} w={'100%'}>
                    <Divider />
                    <Text>or</Text>
                    <Divider />
                  </HStack>

                  <Button
                    w={'100%'}
                    py={6}
                    leftIcon={<GoogleIcon />}
                    variant={'outline'}
                    onClick={comingSoon}
                  >
                    Sign In with Google
                  </Button>
                </ModalBody>

                <ModalFooter
                  content={
                    <>
                      <ButtonGroup alignSelf={'flex-end'}>
                        <Button
                          className="btn"
                          onClick={onClose}
                          variant={'ghost'}
                        >
                          Close
                        </Button>
                        <PrimaryButton
                          label={'Create Account'}
                          onClick={signUp}
                          isLoading={isCreateAccountLoading}
                        />
                      </ButtonGroup>
                    </>
                  }
                />
              </>
            }
          />
        </Modal>
      </>
    );
  };

  // SIGN IN SECTION
  const SignIn = () => {
    const signIn = useSignIn();

    const [isSignInLoading, setIsSignInLoading] = useState(false);

    const [loginRole, setLoginRole] = useState('admin');

    const [loginData, setLoginData] = useState({
      username: '',
      password: '',
    });

    const roles = ['Admin', 'Cashier'];

    function userLogin(e) {
      e.preventDefault();
      console.log('User Loging in...');
      setIsSignInLoading(true);

      //!Simulasi Loading
      setTimeout(() => {
        let loginAPI;
        let data;
        switch (loginRole) {
          case 'admin':
            loginAPI = new URL(`${DOMAIN_API}/api/v1/users/admin/login`);
            data = {
              role: loginRole,
              email: loginData.username,
              password: loginData.password,
            };
            break;
          case 'cashier':
            loginAPI = new URL(`${DOMAIN_API}/api/v1/users/cashier/login`);
            data = {
              role: loginRole,
              username: loginData.username,
              password: loginData.password,
            };
            break;
        }

        axios
          .post(loginAPI, data)
          .then(r => {
            console.log(r);
            if (r) {
              if (r.status === 200 && r.statusText === 'OK') {
                toast({
                  position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
                  title: `Signed In 😎`,
                  description: `as ${r.data.data.role}.`,
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
                signIn({
                  token: r.data.data.tokenCookie,
                  tokenType: 'Bearer',
                  expiresIn: 300,
                  authState: {
                    userId: r.data.data.user_id,
                    displayName: r.data.data.nama,
                    email: r.data.data.email,
                    userRole: r.data.data.role,
                  },
                });
                props.setToken(r.data.data.tokenCookie);
                console.log('User logged in');
                if (r.data.data.role === 'admin') {
                  navigate('/vendere-app');
                } else if (r.data.data.role) {
                  navigate('/vendere-app/cashier');
                }
                setIsSignInLoading(false);
              }
            }
          })
          .catch(err => {
            if (err) {
              console.log(err);
              toast({
                position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
                title: 'Sorry, fail to sign in ☹️',
                description:
                  err.code === 'ERR_NETWORK'
                    ? 'network error, might be the server or your internet connection.'
                    : err.response?.data.data.error,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
            setIsSignInLoading(false);
          });
      }, 1);
      //!Simulasi Loading
    }

    function toSignUp() {
      const signUpBtn = document.querySelector('#signUpBtn');
      signUpBtn.click();
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        <PrimaryButton id={'signInBtn'} label={'SIGN IN'} onClick={onOpen} />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />

          <ModalContent
            id="signInModal"
            content={
              <>
                <ModalHeader>
                  <HStack>
                    <Icon as={StorefrontOutlinedIcon} fontSize={'xx-large'} />
                    <Text>Let's Get into Bussiness</Text>
                  </HStack>
                </ModalHeader>

                <ModalBody pb={6}>
                  <form id="loginForm">
                    <FormControl mt={4} isRequired>
                      <FormLabel>Sign In As...</FormLabel>
                      <HStack>
                        {roles.map((role, index) => {
                          return (
                            <Text
                              key={index}
                              style={{
                                textAlign: 'center',
                                width: '100%',
                                border:
                                  colorMode === 'light'
                                    ? '2px solid var(--p-75)'
                                    : '2px solid var(--p-300)',
                                borderRadius: '8px',
                                padding: '4px',
                                cursor: 'pointer',
                                background:
                                  loginRole === role.toLowerCase()
                                    ? colorMode === 'light'
                                      ? 'var(--p-500)'
                                      : 'var(--p-50)'
                                    : null,
                                color:
                                  loginRole === role.toLowerCase()
                                    ? colorMode !== 'light'
                                      ? 'var(--p-500)'
                                      : 'var(--p-50)'
                                    : null,
                              }}
                              onClick={() => {
                                setLoginRole(role.toLowerCase());
                              }}
                            >
                              {role}
                            </Text>
                          );
                        })}
                      </HStack>
                    </FormControl>

                    <FormControl mt={4} isRequired>
                      <FormLabel>E-mail / Username</FormLabel>
                      <Input
                        className="inputBox"
                        placeholder="e.g marcoleo@email.com / marcoleo"
                        value={loginData.username}
                        onChange={e =>
                          setLoginData({
                            ...loginData,
                            username: e.target.value,
                          })
                        }
                      />
                    </FormControl>

                    <FormControl mt={4} isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type={'password'}
                        placeholder="Type your password"
                        value={loginData.password}
                        onChange={e =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                    </FormControl>

                    <HStack my={4} w={'100%'}>
                      <Divider />
                      <Text>or</Text>
                      <Divider />
                    </HStack>

                    <Button
                      w={'100%'}
                      py={6}
                      leftIcon={<GoogleIcon />}
                      variant={'outline'}
                      onClick={comingSoon}
                    >
                      Sign In with Google
                    </Button>
                  </form>

                  <Text
                    fontSize={'sm'}
                    mt={8}
                    cursor={'pointer'}
                    style={{
                      color: colorMode === 'light' ? 'blue' : 'cyan',
                    }}
                    _hover={{ textDecoration: 'underline' }}
                    onClick={toSignUp}
                  >
                    Don't have account?, let's register yours
                  </Text>
                </ModalBody>

                <ModalFooter
                  content={
                    <>
                      <ButtonGroup alignSelf={'flex-end'}>
                        <Button
                          className="btn"
                          onClick={onClose}
                          variant={'ghost'}
                        >
                          Close
                        </Button>
                        <PrimaryButton
                          label={'Sign In'}
                          onClick={userLogin}
                          isLoading={isSignInLoading}
                        />
                      </ButtonGroup>
                    </>
                  }
                />
              </>
            }
          />
        </Modal>
      </>
    );
  };

  // Lading Page Main
  return (
    <VStack
      className="landingPage"
      p={screenWidth <= 1000 ? '16px 0' : '16px 100px'}
      bg={colorMode === 'light' ? 'var(--p-50)' : 'var(--p-450)'}
    >
      <HStack w={'100%'} justifyContent={'space-between'} px={'24px'}>
        <Text fontSize={'lg'} fontWeight={'bold'}>
          VENDERE
        </Text>
        <HStack>
          <ColorModeIconButton />

          {isAuthenticated() ? (
            <>
              <HStack
                onClick={() => {
                  navigate('/vendere-app');
                }}
                _hover={{ cursor: 'pointer' }}
                style={{
                  border: '2px solid',
                  borderColor:
                    colorMode === 'light' ? 'var(--p-500)' : 'var(--p-50)',
                  borderRadius: '50px',
                  padding: '4px',
                  paddingRight: '8px',
                  color: colorMode === 'light' ? 'var(--p-500)' : 'var(--p-50)',
                  fontWeight: 'bold',
                }}
              >
                <Avatar
                  name={auth().displayName}
                  style={{
                    background:
                      colorMode === 'light' ? 'var(--p-500)' : 'var(--p-50)',
                    color:
                      colorMode !== 'light' ? 'var(--p-500)' : 'var(--p-50)',
                  }}
                  size={'sm'}
                />
                <Text>{auth().displayName}</Text>
              </HStack>
            </>
          ) : (
            <>
              <SignUp />
              <SignIn />
            </>
          )}
        </HStack>
      </HStack>

      <VStack id="hero" position={'relative'} justifyContent={'center'} px={10}>
        <Text fontSize={'xxx-large'} fontWeight={'bold'} lineHeight={'3.75rem'}>
          Responsive, powerful system to grow your bussiness
        </Text>
      </VStack>
    </VStack>
  );
}
