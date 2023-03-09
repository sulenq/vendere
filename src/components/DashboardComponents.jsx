import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Chart from 'chart.js/auto';
import { Line as LineChart } from 'react-chartjs-2';

import {
  Badge,
  useToast,
  HStack,
  useColorMode,
  Grid,
  SimpleGrid,
  VStack,
  Text,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Spinner,
  Avatar,
  useDisclosure,
  ButtonGroup,
  Button,
  Box,
  Modal,
  ModalHeader,
  ModalBody,
  Icon,
  FormControl,
  FormLabel,
  Divider,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { ColorModeButton } from '../components/ColorModeSwitcher';

// MUI Icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';

import '../css/vendereApp.css';

import { PrimaryButton, PrimaryButtonOutline } from '../components/Buttons';
import { ModalContent, ModalFooter, ModalOverlay } from '../components/Modals';
import { Input } from '../components/Inputs';
import { Skeleton } from '../components/Skeleton';

const RDashboard = () => {
  const baseURL = 'http://localhost:8080';
  const token = Cookies.get('_auth');
  const { colorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
  });
  const employeesSkeletonLength = ['', '', ''];

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState();

  //* Get Data
  useEffect(() => {
    const getEmployeesAPI = `${baseURL}/api/v1/cashiers`;

    setLoading(true);

    setTimeout(() => {
      axios
        .get(getEmployeesAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(r => {
          // console.log(r);
          let totalOnline = 0;
          r?.data?.data?.forEach(emp => {
            if (emp.online) {
              totalOnline += 1;
            }
          });
          // console.log(totalOnline);
          setData({
            total: r.data.data?.length || 0,
            totalOnline: totalOnline,
            list: r.data.data,
          });
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }, 300);
  }, [refresh]);

  const RegisterEmployee = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [registerData, setRegisterData] = useState({
      username: '',
      password: '',
    });
    const [isCreatingAcount, setIsCreatingCashierAccount] = useState(false);

    function signUp(e) {
      e.preventDefault();

      console.log('Creating Employee Account...');
      // console.log(registerData);
      // console.log(authTokenValue);
      setIsCreatingCashierAccount(true);

      const cashierRegisterAPI = new URL(
        `${baseURL}/api/v1/users/cashier/register`
      );

      axios
        .post(cashierRegisterAPI, registerData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(r => {
          console.log(r);
          setRegisterData({
            username: '',
            password: '',
          });
          if (r.status === 201) {
            toast({
              position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
              title: 'Cashier account registered',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            onClose();
            setRefresh(!refresh);
          }
        })
        .catch(err => {
          console.log(err);
          if (err) {
            toast({
              position: screenWidth <= 1000 ? 'top-center' : 'bottom-right',
              title: 'Sorry, fail to create account.',
              description: err.response.data.data.error,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .finally(setIsCreatingCashierAccount(false));
    }

    return (
      <HStack px={1} w={'100%'}>
        <PrimaryButton
          w={'100%'}
          label={'Sign Up Employee Account'}
          // size={'sm'}
          onClick={onOpen}
          // mr={'-8px !important'}
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
                    <Text>Create Employee's Account</Text>
                  </HStack>
                </ModalHeader>

                <ModalBody pb={6}>
                  <Alert
                    borderRadius={'8px'}
                    status="info"
                    variant={'left-accent'}
                  >
                    <AlertIcon alignSelf={'flex-start'} />
                    This registered account will be your employees account of
                    this shop.
                  </Alert>

                  <form id="signUpForm">
                    <FormControl mt={4} isRequired>
                      <FormLabel>Username</FormLabel>
                      <Input
                        placeholder="e.g jolitoskurniawan"
                        value={registerData.username}
                        onChange={e => {
                          setRegisterData({
                            ...registerData,
                            username: e.target.value,
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
                          isLoading={isCreatingAcount}
                        />
                      </ButtonGroup>
                    </>
                  }
                />
              </>
            }
          />
        </Modal>
      </HStack>
    );
  };

  return (
    <VStack mt={'16px !important'} w={'100%'} alignItems={'flex-start'}>
      {/* Heading */}
      <HStack
        className="dashboardLabel"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Text fontWeight={'bold'} opacity={0.5}>
          Employees
        </Text>
        {/* <Link to={'/vendere-app/employees'}>
          <Text
            fontSize={'sm'}
            style={{ color: 'var(--p-200)' }}
            _hover={{ textDecoration: 'underline' }}
          >
            Manage
          </Text>
        </Link> */}
      </HStack>

      {/* Body */}
      <VStack
        alignItems={'flex-start'}
        p={2}
        w={'100%'}
        style={{
          border:
            colorMode === 'light'
              ? '2px solid var(--p-75)'
              : '2px solid var(--p-350)',
          borderRadius: '12px',
        }}
      >
        <HStack w={'100%'} justifyContent={'space-between'}>
          {!loading ? (
            <HStack px={2}>
              <Text fontWeight={'bold'}>{data?.total?.toLocaleString()}</Text>
              <Text mt={'0px !important'} color={'var(--p-200)'}>
                Total Employees
              </Text>
            </HStack>
          ) : (
            <HStack w={'150px'}>
              <Skeleton h={'10px'} />
            </HStack>
          )}

          {!loading ? (
            <HStack px={2}>
              <Badge
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50px',
                }}
                colorScheme={'green'}
                variant={'solid'}
              ></Badge>
              <Text>{data?.totalOnline}</Text>
              <Text opacity={'0.5'}>Online</Text>
            </HStack>
          ) : (
            <HStack w={'100px'}>
              <Skeleton h={'10px'} />
            </HStack>
          )}
        </HStack>

        <VStack w={'100%'}>
          {!loading
            ? data?.list?.map((emp, index) => {
                return (
                  <HStack
                    key={index}
                    px={2}
                    py={1}
                    style={{
                      width: '100%',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Avatar
                      size={'lg'}
                      name={emp.username}
                      background={
                        colorMode == 'light' ? 'var(--p-75)' : 'var(--p-350)'
                      }
                      color={
                        colorMode == 'light' ? 'var(--p-200)' : 'var(--p-200)'
                      }
                    />
                    <VStack alignItems={'flex-start'} pl={1}>
                      {emp.online ? (
                        <Badge colorScheme={'green'}>Online</Badge>
                      ) : (
                        <Badge>Offline</Badge>
                      )}
                      <Text mt={'0px !important'}>{emp.username}</Text>
                      <Text style={{ color: 'var(--p-200)', marginTop: '0' }}>
                        {emp.role}
                      </Text>
                    </VStack>
                  </HStack>
                );
              }) || (
                <VStack h={'300px'} justifyContent={'center'} opacity={0.2}>
                  <Icon as={PersonOffOutlinedIcon} fontSize={'10rem'} />
                  <Text fontSize={'x-large'} fontWeight={'bold'}>
                    No Employees
                  </Text>
                </VStack>
              )
            : employeesSkeletonLength.map((val, index) => {
                return <Skeleton key={index} h={'70px'} />;
              })}
        </VStack>

        <PrimaryButton
          label="Manage Employees"
          w={'100%'}
          onClick={() => {
            navigate('/vendere-app/employees');
          }}
        />
      </VStack>
    </VStack>
  );
};

const LDashboard = () => {
  const baseURL = 'http://localhost:8080';
  const token = Cookies.get('_auth');
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
  });

  const [data, setData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    data: [],
    revenueData: [],
    dateData: [],
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState();
  // console.log(data?.revenueData);
  const labels = data?.dateData;
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Dialy Revenue',
        data: data?.revenueData,
        fill: false,
        borderColor: '#fdd100',
        tension: 0.1,
      },
      // {
      //   label: 'Dialy Expenses',
      //   data: [3900, 2900, 5000, 11000, 1600, 2500, 20000, 2300, 12000, 8000],
      //   fill: false,
      //   borderColor: colorMode === 'light' ? 'black' : 'white',
      //   tension: 0.1,
      // },
    ],
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  function getTotalRevenue(data) {
    let totalRevenue = 0;
    data?.forEach(item => {
      totalRevenue += item.total;
    });
    return totalRevenue;
  }

  function getTotalProfit(data) {
    let totalProfit = 0;
    data?.forEach(item => {
      totalProfit += item.totalProfit;
    });
    return totalProfit;
  }

  function getRevenueData(data) {
    const rawRevenueData = {};

    for (let item of data) {
      const date = new Date(item.CreatedAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (year === currentYear && month === currentMonth) {
        if (!rawRevenueData[day]) {
          rawRevenueData[day] = item.totalProfit;
        } else {
          rawRevenueData[day] += item.totalProfit;
        }
      }
    }

    const revenueData = [];
    for (let key in rawRevenueData) {
      revenueData.push(rawRevenueData[key]);
    }
    return revenueData;
  }

  function getDateData(data) {
    const dateData = {};

    for (let item of data) {
      const date = new Date(item.CreatedAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (year === currentYear && month === currentMonth) {
        dateData[day] = '';
      }
    }
    return Object.keys(dateData);
  }

  //* Get Report Data Days
  useEffect(() => {
    const getMonthReportAPI = `${baseURL}/api/v1/transactions/admin`;
    setLoading(true);

    function getMonthReport() {
      axios
        .get(getMonthReportAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(r => {
          // console.log(r.data.data);
          setData({
            totalRevenue: getTotalRevenue(r.data.data),
            totalProfit: getTotalProfit(r.data.data),
            totalExpenses: 0,
            data: data,
            revenueData: getRevenueData(r.data.data),
            dateData: getDateData(r.data.data),
          });
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }

    setTimeout(() => {
      getMonthReport();
    }, 300);
  }, [refresh]);

  return (
    <VStack mt={'16px !important'} w={'100%'} alignItems={'flex-start'}>
      <Text className="dashboardLabel" fontWeight={'bold'} opacity={0.5}>
        Current Month
      </Text>

      <VStack
        alignItems={'flex-start'}
        p={2}
        w={'100%'}
        style={{
          border:
            colorMode === 'light'
              ? '2px solid var(--p-75)'
              : '2px solid var(--p-350)',
          borderRadius: '12px',
        }}
      >
        {!loading ? (
          <>
            <VStack alignItems={'flex-start'} px={2}>
              <HStack alignItems={'flex-start'}>
                <Text>Rp.</Text>
                <Text fontSize={'xx-large'} fontWeight={'bold'}>
                  {data?.totalRevenue?.toLocaleString() || 'Null'}
                </Text>
              </HStack>
              <Text mt={'0px !important'} color={'var(--p-200)'}>
                Total Revenue
              </Text>
            </VStack>

            <VStack alignItems={'flex-start'} px={2}>
              <HStack alignItems={'flex-start'}>
                <Text>Rp.</Text>
                <Text fontSize={'xx-large'} fontWeight={'bold'}>
                  {data?.totalProfit?.toLocaleString() || 'Null'}
                </Text>
              </HStack>
              <Text mt={'0px !important'} color={'var(--p-200)'}>
                Total Profit
              </Text>
            </VStack>

            <VStack alignItems={'flex-start'} px={2}>
              <HStack alignItems={'flex-start'}>
                <Text>Rp.</Text>
                <Text fontSize={'xx-large'} fontWeight={'bold'}>
                  Coming Soon!
                  {/* {data?.totalExpenses?.toLocaleString() || 'Null'} */}
                </Text>
              </HStack>
              <Text mt={'0px !important'} color={'var(--p-200)'}>
                Total Expenses
              </Text>
            </VStack>

            <VStack
              w={'100%'}
              h={'300px'}
              mt={'16px !important'}
              p={1}
              alignItems={'flex-start'}
              borderRadius={8}
            >
              <LineChart
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </VStack>

            <PrimaryButton
              label="See Full Reports"
              w={'100%'}
              onClick={() => {
                navigate('/vendere-app/reports');
              }}
            />
          </>
        ) : (
          <>
            <Skeleton h={'70px'} />
            <Skeleton h={'70px'} />
            <Skeleton h={'70px'} />
            <Skeleton h={'200px'} />
          </>
        )}
      </VStack>
    </VStack>
  );
};

export { RDashboard, LDashboard };
