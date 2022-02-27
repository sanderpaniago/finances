import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { Charts } from "../../components/Charts";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import clientApollo from "../../services/apollo-client";
import GET_TRANSACTIONS from '../../graphql/getUserTransactions.gql'
import { formatter, formatterDate } from "../../utils/formatted";

type Resumer = {
    [key: string]: {
        cashIn: number;
        cashOut: number
    }
}

type DashboardProps = {
    transactions: Array<{
        id: string
        title: string
        price: number
        priceFormatted: string
        dueDateFormatted: string
        dueDate: string
        category: string
        type: string
        pay: boolean
    }>
}


export default function Dashboard({ transactions }: DashboardProps) {

    const resumer: Resumer = transactions.reduce((acc, item) => {
        const [year, month] = item.dueDate.split('-')
        if (!acc[`${year}/${month}`]) {
            acc[`${year}/${month}`] = {
                cashIn: 0,
                cashOut: 0
            }
        }

        if (item.type === 'cash-in') {
            acc[`${year}/${month}`].cashIn = acc[`${year}/${month}`].cashIn + item.price
        } else {
            acc[`${year}/${month}`].cashOut = acc[`${year}/${month}`].cashOut + item.price
        }

        return acc
    }, {} as Resumer)

    const dataSort = Object.entries(resumer).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())

    const dataResumer = dataSort.map(item => {
        const [year, month] = item[0].split('/')
        const date = new Date(Number(year), Number(month) - 1, 1)
        return new Intl.DateTimeFormat('pt-br', {
            month: 'short',
            year: '2-digit',
        }).format(date)
    })

    const resumerCashIn = dataSort.map(item => Number(item[1].cashIn))

    const resumerCashOut = dataSort.map(item => Number(item[1].cashOut.toFixed(2)))

    return (
        <Flex direction="column" h='100vh'>
            <Header />

            <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6' >
                <Sidebar />

                <SimpleGrid flex='1' gap='4' minChildWidth='320px'>
                    <Box
                        p={['6', '8']}
                        bg='gray.800'
                        borderRadius={8}
                        pb='4'
                    >
                        <Text fontSize='lg' mb='4'>Entradas</Text>
                        {transactions && (
                            <Charts
                                categories={dataResumer}
                                series={resumerCashIn}
                            />
                        )}
                    </Box>
                    <Box
                        p={['6', '8']}
                        bg='gray.800'
                        borderRadius={8}
                        pb='4'
                    >
                        <Text fontSize='lg' mb='4'>Saidas</Text>
                        {transactions && (
                            <Charts
                                categories={dataResumer}
                                series={resumerCashOut}
                            />
                        )}
                    </Box>

                </SimpleGrid>
            </Flex>
        </Flex>
    )
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

    const { data } = await clientApollo.query({
        query: GET_TRANSACTIONS,
        variables: {
            email: session.user.email
        }
    })
    const transactions = data.userByEmail?.transactions.data.map(transaction => {
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