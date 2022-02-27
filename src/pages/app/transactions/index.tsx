import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    useBreakpointValue,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { RiAddLine, RiArrowDownSLine } from "react-icons/ri";
import { useMutation } from "@apollo/client";

import { Sidebar } from "../../../components/Sidebar";
import { Summary } from "../../../components/Sumarry";
import { Header } from "../../../components/Header";
import { TableItem } from "../../../components/Table/TableItem";

import { formatter, formatterDate } from "../../../utils/formatted";
import clientApollo from "../../../services/apollo-client";

import GET_TRANSACTIONS from '../../../graphql/getAllTransaction.gql'
import DELETE_TRANSACTION from '../../../graphql/deleteTransaction.gql'
import UPDATE_PAYMENT from '../../../graphql/updatePayment.gql'
import { filterMouth } from "../../../utils/filterMouth";
import { useRouter } from "next/router";

type DataActive = 'before' | 'current' | 'after'

export default function Transactions({ transactions }) {

    const route = useRouter()

    const [transactionList, setTransactionList] = useState(transactions)
    const [filterName, setFilterName] = useState('Mês atual')

    useEffect(() => {
        if (!route.query.f) {
            route.push({ pathname: route.pathname, query: { f: 'current' } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setTransactionList(transactions)

        if (route.query.f === 'current') {
            setFilterName('Mês atual')
        }
        if (route.query.f === 'before') {
            setFilterName('Mês passado')
        }
        if (route.query.f === 'after') {
            setFilterName('Próximo mês')
        }
    }, [transactions, route.query.f])

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    const [deleteTransaction] = useMutation(DELETE_TRANSACTION)
    const [updatePayment] = useMutation(UPDATE_PAYMENT)


    const togglePay = async (pay: boolean, transactionId: string) => {
        return await updatePayment({
            variables: {
                transactionId,
                pay
            }
        })
    }

    async function handleDeleteTransaction(transactionId: string) {
        const { data, errors } = await deleteTransaction({
            variables: {
                transactionId
            }
        })

        if (!!errors)
            return

        const newList = transactionList.filter(item => item.id !== data.deleteTransaction._id)
        setTransactionList(newList)
    }

    const resumer = transactionList.reduce((acc, item) => {
        if (item.type === 'cash-in') {
            acc.cashIn += item.price
        } else {
            acc.cashOut += item.price
        }

        acc.total = acc.cashIn - acc.cashOut

        return acc
    }, {
        cashIn: 0,
        cashOut: 0,
        total: 0,
    })


    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />
                <Box flex='1'>
                    <Summary resumer={resumer} />
                    <Box flex="1" borderRadius={8} bg="gray.800" p="8">
                        <Flex mb="8" justify="space-between" align="center">
                            <Flex>
                                <Heading size="lg" fontWeight="normal">
                                    Transações
                                </Heading>
                                {isWideVersion && (

                                    <Box ml={2}>
                                        <Menu colorScheme='blackAlpha'>
                                            <MenuButton
                                                as={Button}
                                                rightIcon={<Icon as={RiArrowDownSLine} />}
                                                p='0'
                                                colorScheme='transparent'
                                                _focus={{ outline: 'none' }}
                                                textTransform={'capitalize'}
                                                borderWidth={1}
                                                borderColor='whiteAlpha.200'
                                                padding='0 15px'
                                            >
                                                {filterName}
                                            </MenuButton>
                                            <MenuList
                                                zIndex='2'
                                                bg='gray.800'
                                                borderColor='gray.700'
                                            >
                                                <NextLink href={{ pathname: '/app/transactions', query: { f: 'before' } }}>
                                                    <MenuItem
                                                        as={Link}
                                                        _hover={{ bg: 'gray.900' }}
                                                        _focus={{ bg: 'gray.900' }}
                                                    >Mês passado</MenuItem>
                                                </NextLink>
                                                <NextLink href={{ pathname: '/app/transactions', query: { f: 'current' } }}>
                                                    <MenuItem
                                                        as={Link}
                                                        _hover={{ bg: 'gray.900' }}
                                                        _focus={{ bg: 'gray.900' }}
                                                    >Mês atual</MenuItem>
                                                </NextLink>
                                                <NextLink href={{ pathname: '/app/transactions', query: { f: 'after' } }}>
                                                    <MenuItem
                                                        _hover={{ bg: 'gray.900' }}
                                                        _focus={{ bg: 'gray.900' }}
                                                    >Proximo mês</MenuItem>
                                                </NextLink>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                )}
                            </Flex>
                            <NextLink href="/app/transactions/create">
                                <Button
                                    as="a"
                                    size="sm"
                                    fontSize="sm"
                                    colorScheme="pink"
                                    leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                                    cursor="pointer"
                                >
                                    Criar novo
                                </Button>
                            </NextLink>
                        </Flex>

                        {!isWideVersion && (
                            <Box mt={-4} mb={6}>
                                <Menu colorScheme='blackAlpha'>
                                    <MenuButton
                                        as={Button}
                                        rightIcon={<Icon as={RiArrowDownSLine} />}
                                        p='0'
                                        colorScheme='transparent'
                                        _focus={{ outline: 'none' }}
                                        textTransform={'capitalize'}
                                        borderWidth={1}
                                        borderColor='whiteAlpha.200'
                                        padding='0 15px'
                                    >
                                        {filterName}
                                    </MenuButton>
                                    <MenuList
                                        zIndex='2'
                                        bg='gray.800'
                                        borderColor='gray.700'
                                    >
                                        <NextLink href={{ pathname: '/app/transactions', query: { f: 'before' } }}>
                                            <MenuItem
                                                as={Link}
                                                _hover={{ bg: 'gray.900' }}
                                                _focus={{ bg: 'gray.900' }}
                                            >Mês passado</MenuItem>
                                        </NextLink>
                                        <NextLink href={{ pathname: '/app/transactions', query: { f: 'currency' } }}>
                                            <MenuItem
                                                as={Link}
                                                _hover={{ bg: 'gray.900' }}
                                                _focus={{ bg: 'gray.900' }}
                                            >Mês atual</MenuItem>
                                        </NextLink>
                                        <NextLink href={{ pathname: '/app/transactions', query: { f: 'after' } }}>
                                            <MenuItem
                                                _hover={{ bg: 'gray.900' }}
                                                _focus={{ bg: 'gray.900' }}
                                            >Proximo mês</MenuItem>
                                        </NextLink>
                                    </MenuList>
                                </Menu>
                            </Box>
                        )}
                        <Box overflowX='hidden'>
                            <HStack
                                flex='1'
                                pr='5'
                            >
                                <Box w='40%'>Transações</Box>
                                <Box w='30%' textAlign={['center', 'left']} >Valor</Box>
                                {isWideVersion && (
                                    <Box w='20%'>
                                        <Box textAlign={['center', 'left']} >Vencimento</Box>
                                    </Box>
                                )}
                                <Box
                                    w={['auto', '10%']}
                                    px={["4", "4", "6"]}
                                    color="gray.300"
                                    textAlign={['center', 'left']} >
                                    Pago
                                </Box>
                            </HStack>
                            <Box maxHeight="45vh" overflowY='scroll'>
                                {
                                    transactionList?.map((transaction) => (
                                        <TableItem
                                            key={transaction.id}
                                            isWideVersion={isWideVersion}
                                            item={transaction}
                                            onTogglePay={togglePay}
                                            handleDeleteTransaction={handleDeleteTransaction}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });

    const filter = query.f as DataActive

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }
    const { endData, initData } = filterMouth(filter ?? 'current')
    const { data } = await clientApollo.query({
        query: GET_TRANSACTIONS,
        variables: {
            userId: session.userId,
            initData,
            endData,
        },
        fetchPolicy: 'no-cache'
    })

    const transactions = data.transactionByData.data.map(transaction => {
        const [year, month, day] = transaction.dueDate.split('-')
        return {
            id: transaction._id,
            title: transaction.title,
            price: transaction.price,
            priceFormatted: formatter().format(transaction.price),
            dueDateFormatted: formatterDate().format(new Date(year, month - 1, day)),
            dueDate: transaction.dueDate,
            category: transaction.category.name,
            type: transaction.type.name,
            pay: transaction.pay
        }
    })

    return {
        props: {
            transactions,
        }
    }
}