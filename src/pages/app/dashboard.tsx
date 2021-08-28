import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useChart } from "../../services/hooks/useChart";
import { theme } from '../../styles/theme'

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})

const options = {
    chart: {
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        foreColor: theme.colors.gray[500]
    },
    grid: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        enabled: false,
    },

    fill: {
        opacity: 0.3,
        type: 'gradient',
        gradient: {
            shade: 'dark',
            opacityFrom: 0.7,
            opacityTo: 0.3,
        }
    }
}


export default function Dashboard() {
    const [session] = useSession()
    const { data, isLoading } = useChart(session?.idDatabase)
    const [categories, setCategories] = useState({})
    useEffect(() => {

        if (data) {
            const category = Object.keys(data)
            const value = Object.values(data)
            const valueEntrada = value.map(item => item.entradas)
            const valueSaidas = value.map(item => (item.saidas * -1).toFixed(2))

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
                        <Text fontSize='lg' mb='4'>Inscritos da semana</Text>
                        {!isLoading && (
                            <Chart type='area' height={160} options={{
                                ...options,
                                xaxis: {
                                    type: "datetime",
                                    axisBorder: {
                                        color: theme.colors.gray[600]
                                    },
                                    axisTicks: {
                                        color: theme.colors.gray[600]
                                    },
                                    categories: categories.category,
                                },
                            }} series={[{
                                name: 'series-1',
                                data: categories.valueEntrada
                            }]} />
                        )}
                    </Box>
                    <Box
                        p={['6', '8']}
                        bg='gray.800'
                        borderRadius={8}
                        pb='4'
                    >
                        <Text fontSize='lg' mb='4'>Inscritos da semana</Text>
                        {!isLoading && (
                            <Chart type='area' height={160} options={{
                                ...options,
                                xaxis: {
                                    type: "datetime",
                                    axisBorder: {
                                        color: theme.colors.gray[600]
                                    },
                                    axisTicks: {
                                        color: theme.colors.gray[600]
                                    },
                                    categories: categories.category,
                                },
                            }} series={[{
                                name: 'series-1',
                                data: categories.valueSaidas
                            }]} />
                        )}
                    </Box>

                </SimpleGrid>
            </Flex>
        </Flex>
    )
}