import '../css/vendereApp.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Box,
  useColorMode,
  VStack,
  Avatar,
  Text,
  FormControl,
  FormLabel,
  Badge,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalHeader,
  HStack,
  Icon,
  useToast,
  ButtonGroup,
  Button,
  IconButton,
} from '@chakra-ui/react';

// MUI Icons
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

import { Input } from '../components/Inputs';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { PrimaryButton, PrimaryButtonOutline } from '../components/Buttons';
import {
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalOverlay,
} from '../components/Modals';
import { ActionTopBar } from '../components/ActionTopBar';
import { useNavigate } from 'react-router-dom';

export default function Profile(props) {
  const { colorMode } = useColorMode();
  const auth = useAuthUser();
  const logout = useSignOut();
  const navigate = useNavigate();
  const toast = useToast();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
  });

  const navs = [
    {
      name: 'Dashboard',
      link: '/vendere-app',
      icon: DashboardOutlinedIcon,
      restriction: 'admin',
    },
    {
      name: 'ManageItems',
      link: '/vendere-app/manageproducts',
      icon: Inventory2OutlinedIcon,
      restriction: 'admin',
    },
    {
      name: 'Cashier',
      link: '/vendere-app/cashier',
      icon: PointOfSaleRoundedIcon,
      restriction: 'cashier',
    },
    {
      name: 'Transactions',
      link: '/vendere-app/transactions',
      icon: ReceiptLongOutlinedIcon,
      restriction: '',
    },
    {
      name: 'Debts',
      link: '/vendere-app/debts',
      icon: MoneyOffIcon,
      restriction: 'admin',
    },
    {
      name: 'Expenses',
      link: '/vendere-app/expenses',
      icon: MonetizationOnOutlinedIcon,
      restriction: 'admin',
    },
    {
      name: 'Employees',
      link: '/vendere-app/employees',
      icon: PeopleOutlinedIcon,
      restriction: 'admin',
    },
    {
      name: 'Reports',
      link: '/vendere-app/reports',
      icon: SummarizeOutlinedIcon,
      restriction: 'admin',
    },
    {
      name: 'Support',
      link: '/vendere-app/support',
      icon: HelpOutlineOutlinedIcon,
      restriction: '',
    },
  ];

  const ChangePassword = () => {
    const baseURL = 'http://localhost:8080';

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState({ old_password: '', new_password: '' });
    const [loading, setLoading] = useState(false);

    function onChangePassword(e) {
      e.preventDefault();
      const token = Cookies.get('_auth');
      const API = new URL(`${baseURL}/api/v1/users/admin/change-password`);

      console.log('Changing item...');
      console.log(data);

      setLoading(true);

      function changePassword() {
        axios
          .put(API, data, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(r => {
            console.log(r);
            if (r.status === 200) {
              toast({
                position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
                title: 'Password Changed',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            }
            setData({ old_password: '', new_password: '' });
            onClose();
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            if (err) {
              let desc = err.response.data.data.error;
              if (desc === 'password not match') {
                desc = 'old password did not match.';
              }
              toast({
                position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
                title: 'Sorry, fail to change password.',
                description: desc,
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              setLoading(false);
            }
          });
      }

      changePassword();
    }

    return (
      <>
        <PrimaryButtonOutline
          label={'Change Password'}
          w={'100%'}
          onClick={onOpen}
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />

          <ModalContent
            content={
              <>
                <ModalHeader px={4}>
                  <HStack>
                    <Icon as={LockOpenOutlinedIcon} />
                    <Text>Change Password</Text>
                  </HStack>
                </ModalHeader>

                <ModalBody
                  content={
                    <>
                      <Alert
                        borderRadius={'8px'}
                        status="warning"
                        variant={'left-accent'}
                        mb={2}
                      >
                        <AlertIcon alignSelf={'flex-start'} />
                        Make sure to remember the new password because you
                        cannot undo this action.
                      </Alert>

                      <FormControl isRequired>
                        <FormLabel>Old Password</FormLabel>
                        <Input
                          type={'password'}
                          placeholder={'Input strong password'}
                          value={data?.old_password}
                          onChange={e => {
                            setData({ ...data, old_password: e.target.value });
                          }}
                        />
                      </FormControl>

                      <FormControl mt={2} isRequired>
                        <FormLabel>New Password</FormLabel>
                        <Input
                          type={'password'}
                          placeholder={'Input strong password'}
                          value={data?.new_password}
                          onChange={e => {
                            setData({ ...data, new_password: e.target.value });
                          }}
                        />
                      </FormControl>
                    </>
                  }
                />

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
                          label={'Change Password'}
                          isLoading={loading}
                          onClick={onChangePassword}
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

  const SignOut = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSignOutLoading, setIsSignOutLoading] = useState(false);

    function logOut() {
      setIsSignOutLoading(true);
      setTimeout(() => {
        logout();
        Cookies.set('isSignedOut', 'yes');
        setIsSignOutLoading(false);
        toast({
          position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
          title: `Signed Out ????`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }, 1);
    }

    return (
      <>
        <PrimaryButton label={'Sign Out'} w={'100%'} onClick={onOpen} />

        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent
            content={
              <>
                <ModalHeader px={4}>
                  <HStack>
                    <Icon as={LogoutOutlinedIcon} />
                    <Text>Signing Out?</Text>
                  </HStack>
                </ModalHeader>

                <ModalBody
                  content={
                    <>
                      <Text>Are you sure you want to sign out?</Text>
                    </>
                  }
                />

                <ModalFooter
                  content={
                    <ButtonGroup alignSelf={'flex-end'}>
                      <Button
                        className="btn"
                        onClick={onClose}
                        variant={'ghost'}
                      >
                        Close
                      </Button>
                      <PrimaryButton
                        label={'Sign Out'}
                        isLoading={isSignOutLoading}
                        onClick={logOut}
                      />
                    </ButtonGroup>
                  }
                />
              </>
            }
          />
        </Modal>
      </>
    );
  };

  return (
    <VStack
      className="vendereApp"
      py={screenWidth <= 1000 ? '' : 4}
      justifyContent={'center'}
      h={'100%'}
    >
      <VStack
        id="appContentWrapper"
        // h={screenWidth <= 1000 ? '100%' : '800px'}
        h={screenWidth <= 1000 ? '100%' : '96%'}
        // maxh={screenWidth <= 1000 ? '100%' : '90%'}
        w={screenWidth <= 1000 ? '100%' : '500px'}
        style={{
          background:
            colorMode === 'light' ? 'var(--light-dim)' : 'var(--p-400a)',
          borderRadius: screenWidth <= 1000 ? '' : '12px',
          paddingTop: 6,
          padding: 8,
          alignItems: 'flex-start',
        }}
      >
        <ActionTopBar />

        <VStack
          mt={'2px !important'}
          h={'100%'}
          w={'100%'}
          m={'auto'}
          p={8}
          borderRadius={12}
          // border={'1px solid red'}
          bg={colorMode === 'light' ? 'var(--p-50)' : 'var(--p-400a)'}
          position={'relative'}
          overflowY={'auto'}
        >
          <IconButton
            icon={<ArrowBackOutlinedIcon />}
            borderRadius={50}
            variant={'ghost'}
            position={'absolute'}
            top={'8px'}
            left={'8px'}
            onClick={() => {
              navigate(-1);
            }}
          ></IconButton>

          <VStack
            w={screenWidth <= 500 ? '100%' : '350px'}
            h={'100%'}
            justifyContent={'space-between'}
          >
            <VStack w={'100%'}>
              <Avatar
                size={'xl'}
                name={auth().displayName}
                style={{
                  background: 'var(--p-300)',
                  color: 'var(--p-200)',
                }}
              />

              <Text fontWeight={'bold'} fontSize={'x-large'}>
                {auth().displayName}
              </Text>

              <Text mt={'2px !important'}>{auth().email}</Text>

              <Badge
                style={{
                  background: 'var(--accent)',
                  color: '#00000080',
                  borderRadius: '12px',
                }}
                mb={'4px !important'}
              >
                {auth().userRole}
              </Badge>

              {auth().userRole === 'admin' && (
                <>
                  <ChangePassword />
                </>
              )}

              <SignOut />
            </VStack>

            <VStack
              w={'100%'}
              borderRadius={12}
              justifyContent={'space-between'}
            >
              <VStack w={'100%'}>
                <Text fontWeight={'bold'} alignSelf={'flex-start'}>
                  Navigate
                </Text>

                {navs.map((nav, index) => {
                  if (
                    auth().userRole === nav.restriction ||
                    nav.restriction === ''
                  ) {
                    return (
                      <HStack
                        key={index}
                        cursor={'pointer'}
                        w={'100%'}
                        h={'45px'}
                        justifyContent={'space-between'}
                        px={4}
                        borderRadius={12}
                        border={'1px solid'}
                        borderColor={
                          colorMode === 'light' ? 'var(--p-400)' : 'var(--p-50)'
                        }
                        color={
                          colorMode === 'light' ? 'var(--p-500)' : 'var(--p-50)'
                        }
                        _hover={{
                          background:
                            colorMode === 'light'
                              ? 'var(--light) !important'
                              : 'var(--p-350) !important',
                        }}
                        _active={{
                          background:
                            colorMode === 'light'
                              ? 'var(--p-75) !important'
                              : 'var(--p-300) !important',
                        }}
                        onClick={() => {
                          navigate(nav.link);
                        }}
                      >
                        <HStack>
                          <Icon as={nav.icon} fontSize={'16px'} mt={'1px'} />
                          <Text>
                            {nav.name === 'ManageItems'
                              ? 'Manage Items'
                              : nav.name}
                          </Text>
                        </HStack>
                        <Icon as={ArrowOutwardOutlinedIcon} fontSize={'md'} />
                      </HStack>
                    );
                  }
                })}
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
