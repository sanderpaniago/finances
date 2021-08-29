import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { Charts } from "../../components/Charts";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useChart } from "../../services/hooks/useChart";


type CategoriesFilter = {
    valueEntrada: number[];
    category: string[];
    valueSaidas: number[]
}


type ChartApiValue = {
    entradas: number;
    saidas: number
}

export default function Dashboard({ idDatabase }) {

    const { data, isLoading } = useChart(idDatabase)

    const [categories, setCategories] = useState<CategoriesFilter>({} as CategoriesFilter)

    useEffect(() => {

        if (data) {
            const category = Object.keys(data)
            const value = Object.values(data)
            const valueEntrada = value.map((item: ChartApiValue) => Number((item.entradas).toFixed(2)))
            const valueSaidas = value.map((item: ChartApiValue) => Number((item.saidas * -1).toFixed(2)))

            setCategories({
                category,
                valueEntrada,
                valueSaidas
            })
        }
    }, [data])

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
                        {!isLoading && data && (
                            <Charts
                                categories={categories.category}
                                series={categories.valueEntrada}
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
                        {!isLoading && data && (
                            <Charts
                                categories={categories.category}
                                series={categories.valueSaidas}
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

    if (!session?.idDatabase) {
        return {
            redirect: {
                destination: '/database',
                permanent: false,
            }
        }
    }

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            idDatabase: session.idDatabase,
        }
    }
}