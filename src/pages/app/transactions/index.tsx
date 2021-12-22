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
    Select,
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
import client from "../../../services/apollo-client";

import GET_TRANSACTIONS from '../../../graphql/getAllTransaction.gql'
import DELETE_TRANSACTION from '../../../graphql/deleteTransaction.gql'
import UPDATE_PAYMENT from '../../../graphql/updatePayment.gql'

type DataActive = 'mes anterior' | 'mes atual' | 'proximo mes' | 'all'

export default function Transactions({ transactions }) {
    const [dataActive, setDateActive] = useState<DataActive>('mes atual')

    const [transactionList, setTransactionList] = useState(transactions)
    const [transactionListFilter, setTransactionListFilter] = useState(transactionList)

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    const [deleteTransaction] = useMutation(DELETE_TRANSACTION)
    const [updatePayment] = useMutation(UPDATE_PAYMENT)

    useEffect(() => {
        filterMouth(dataActive)


        function filterMouth(filterActive: DataActive) {
            let initialDataFilter: Date
            let finalDataFilter: Date
            const currentDate = new Date()

            if (filterActive === 'mes anterior') {
                initialDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                finalDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59)
                const newList = transactionList.filter(item => {
                    const [year, month, day] = item.dueDate.split('-')
                    const transactionData = new Date(year, month - 1, day)
                    return transactionData.getTime() >= initialDataFilter.getTime() && transactionData.getTime() <= finalDataFilter.getTime()
                })
                setTransactionListFilter(newList)
                return
            }
            if (filterActive === 'mes atual') {
                initialDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                finalDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59)

                const newList = transactionList.filter(item => {
                    const [year, month, day] = item.dueDate.split('-')
                    const transactionData = new Date(year, month - 1, day)
                    return transactionData.getTime() >= initialDataFilter.getTime() && transactionData.getTime() <= finalDataFilter.getTime()
                })
                setTransactionListFilter(newList)
                return
            }

            if (filterActive === 'proximo mes') {
                initialDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                finalDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59)

                const newList = transactionList.filter(item => {
                    const [year, month, day] = item.dueDate.split('-')
                    const transactionData = new Date(year, month - 1, day)
                    return transactionData.getTime() >= initialDataFilter.getTime() && transactionData.getTime() <= finalDataFilter.getTime()
                })

                setTransactionListFilter(newList)
            }

            if (filterActive === 'all') {
                setTransactionListFilter(transactionList)
            }
        }
    }, [dataActive, transactionList])

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

    const resumer = transactionListFilter.reduce((acc, item) => {
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
                        <Box overflowX='hidden'>
                            <HStack
                                flex='1'
                                pr='5'
                            >
                                <Box w='40%'>Transações</Box>
                                <Box w='30%' textAlign={['center', 'left']} >Valor</Box>
                                {isWideVersion && (
                                    <Box w='20%'>
                                        <Menu colorScheme='blackAlpha'>
                                            <MenuButton
                                                as={Button}
                                                rightIcon={<Icon as={RiArrowDownSLine} />}
                                                p='0'
                                                colorScheme='transparent'
                                                _focus={{ outline: 'none' }}

                                            >
                                                Vencimento
                                            </MenuButton>
                                            <MenuList
                                                zIndex='2'
                                                bg='gray.800'
                                                borderColor='gray.700'
                                            >
                                                <MenuItem
                                                    _hover={{ bg: 'gray.900' }}
                                                    _focus={{ bg: 'gray.900' }}
                                                    onClick={() => setDateActive('all')}
                                                >Todos</MenuItem>
                                                <MenuItem
                                                    _hover={{ bg: 'gray.900' }}
                                                    _focus={{ bg: 'gray.900' }}
                                                    onClick={() => setDateActive('mes atual')}
                                                >Mês atual</MenuItem>
                                                <MenuItem
                                                    _hover={{ bg: 'gray.900' }}
                                                    _focus={{ bg: 'gray.900' }}
                                                    onClick={() => setDateActive('mes anterior')}
                                                >Mês passado</MenuItem>
                                                <MenuItem
                                                    _hover={{ bg: 'gray.900' }}
                                                    _focus={{ bg: 'gray.900' }}
                                                    onClick={() => setDateActive('proximo mes')}
                                                >Proximo mês</MenuItem>
                                            </MenuList>
                                        </Menu>
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

                                {dataActive ? transactionListFilter?.map((transaction) => (
                                    <TableItem
                                        key={transaction.id}
                                        isWideVersion={isWideVersion}
                                        item={transaction}
                                        onTogglePay={togglePay}
                                        handleDeleteTransaction={handleDeleteTransaction}
                                    />
                                )) : (
                                    transactionList?.map((transaction) => (
                                        <TableItem
                                            key={transaction.id}
                                            isWideVersion={isWideVersion}
                                            item={transaction}
                                            onTogglePay={togglePay}
                                            handleDeleteTransaction={handleDeleteTransaction}
                                        />
                                    )))
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });


    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const { data } = await client.query({
        query: GET_TRANSACTIONS,
        variables: {
            email: session.user.email
        }
    })
    const transactions = data.userByEmail.transactions.data.map(transaction => {
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
            transactions
        }
    }
}