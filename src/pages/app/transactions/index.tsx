import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Spinner,
    useBreakpointValue,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import { Header } from "../../../components/Header";
import NextLink from "next/link";
import { Sidebar } from "../../../components/Sidebar";
import { RiAddLine, RiArrowDownSLine } from "react-icons/ri";
import { api } from "../../../services/api";
import { useInfiniteQuery } from "react-query";
import { useMemo, useState } from "react";
import { TableItem } from "../../../components/Table/TableItem";
import { useTogglePay } from "../../../services/hooks/useTogglePay";
import { useResumer } from "../../../services/hooks/useResumer";
import { formatter, formatterDate } from "../../../utils/formatted";
import { Summary } from "../../../components/Sumarry";
import { queryClient } from '../../../services/querryClient'
import { useSession } from "next-auth/client";

export default function Transactions() {
    const [session] = useSession()

    const [filters, setFilter] = useState({
        currentYear: '',
        currentMouth: ''
    });

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });

    async function getTransaction({ pageParam = null }): Promise<any> {
        const response = await api.get("/api/transactions", {
            params: {
                after: pageParam,
                currentYear: filters.currentYear,
                currentMouth: filters.currentMouth,
                idDatabase: session.idDatabase
            },
        });
        return response.data;
    }
    const {
        data,
        isLoading,
        isError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isFetching
    } = useInfiniteQuery("transactions", getTransaction, {
        getNextPageParam: (lastPage) => {
            if (lastPage.has_more) {
                return lastPage.next_cursor;
            }
            return false;
        }
    });

    const resumer = useResumer(filters, session?.idDatabase);

    const togglePay = useTogglePay()

    function loadMoreImages(): void {
        fetchNextPage();
    }

    async function handleSetFilter(filter: string) {

        let currentMouth;
        const month = new Date().getMonth()
        const monthString = month.toString()

        switch (filter) {
            case 'actual':
                currentMouth = monthString.length > 1 ? `${month + 1}` : `0${month + 1}`;
                break;
            case 'before':
                currentMouth = monthString.length > 1 ? `${month}` : `0${month}`;
                break;
            case 'after':
                currentMouth = monthString.length > 1 ? `${month + 2}` : `0${month + 2}`;
                break;
            default:
                break;
        }

        setFilter({
            currentYear: new Date().getFullYear().toString(),
            currentMouth,
        })

        await queryClient.invalidateQueries('resumer')
        await queryClient.invalidateQueries('transactions')
        await queryClient.fetchQuery('resumer')
        await queryClient.fetchQuery('transactions')
    }

    const formatTransactions = useMemo(() => {
        if (data) {
            const pages = data.pages.flatMap((result) => result.results);
            return pages.map((transaction) => ({
                id: transaction.id,
                category: transaction.properties?.category.select.name,
                dueDate: formatterDate().format(new Date(transaction.properties?.dueDate.date.start)),
                pay: transaction.properties?.pay.checkbox,
                price: transaction.properties?.price.number,
                priceFormatted: formatter().format(
                    transaction.properties?.price.number
                ),
                title: transaction.properties?.title.title[0].text.content,
            }));
        }
        return null;
    }, [data]);

    return (
        <Box>
            <Header />

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />

                <Box flex='1'>
                    {resumer.data && (
                        <Summary resumer={resumer.data.totalValue} isLoading={resumer.isFetching} />
                    )}

                    <Box flex="1" borderRadius={8} bg="gray.800" p="8">
                        <Flex mb="8" justify="space-between" align="center">
                            <Heading size="lg" fontWeight="normal">
                                Transações
                                {!isLoading && togglePay.isLoading ? (
                                    <Spinner size="sm" color="gray.500" ml="4" />
                                ) : isFetching ? (
                                    <Spinner size="sm" color="gray.500" ml="4" />
                                ) : ''}
                            </Heading>
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

                        {isLoading ? (
                            <Flex justify="center">
                                <Spinner />
                            </Flex>
                        ) : isError ? (
                            <Flex justify="center">Falha ao obter dados</Flex>
                        ) : (
                            <>
                                <Box overflowX='hidden'>
                                    <HStack
                                        w='full'
                                        pr='5'
                                    >
                                        <Box w='40%'>Transações</Box>
                                        <Box w='30%'>Valor</Box>
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
                                                            onClick={() => handleSetFilter('actual')}
                                                        >Mês atual</MenuItem>
                                                        <MenuItem
                                                            _hover={{ bg: 'gray.900' }}
                                                            _focus={{ bg: 'gray.900' }}
                                                            onClick={() => handleSetFilter('before')}
                                                        >Mês passado</MenuItem>
                                                        <MenuItem
                                                            _hover={{ bg: 'gray.900' }}
                                                            _focus={{ bg: 'gray.900' }}
                                                            onClick={() => handleSetFilter('after')}
                                                        >Proximo mês</MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Box>
                                        )}
                                        <Box w='10%' px={["4", "4", "6"]} color="gray.300" textAlign='left' >
                                            Pago
                                        </Box>
                                    </HStack>
                                    <Box maxHeight="45vh" overflowY='scroll'>

                                        {formatTransactions.map((transaction) => (
                                            <TableItem
                                                key={transaction.id}
                                                isWideVersion={isWideVersion}
                                                item={transaction}
                                                onTogglePay={togglePay.mutateAsync}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                                {hasNextPage && (
                                    <Button
                                        as="a"
                                        onClick={() => loadMoreImages()}
                                        colorScheme="pink"
                                        mt="6"
                                        cursor="pointer"
                                    >
                                        {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}
