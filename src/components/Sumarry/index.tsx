import { Box, Heading, Icon, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { BiDollar } from "react-icons/bi";
import { RiArrowUpCircleLine, RiArrowDownCircleLine } from "react-icons/ri";
import { formatter } from "../../utils/formatted";

interface SummaryProps {
    resumer: {
        total: number;
        cashIn: number;
        cashOut: number;
    }
    isLoading?: boolean;
}

export function Summary({ resumer, isLoading }: SummaryProps) {
    return (
        <SimpleGrid cflex='1' gap='4' minChildWidth='320px' mb='6'>
            <Box h='10vh' bg="gray.800" borderRadius={8} p='4'>
                <Box d='flex' justifyContent='space-between' w='full'>
                    <Text>Entradas
                        {isLoading && (
                            <Spinner size="sm" color="gray.500" ml="4" />
                        )}
                    </Text>
                    <Icon as={RiArrowUpCircleLine} w={6} h={6} color='green.400' />
                </Box>
                <Heading size='md' mt='2'>{formatter().format(resumer.cashIn)}</Heading>
            </Box>
            <Box h='10vh' bg="gray.800" borderRadius={8} p='4'>
                <Box d='flex' justifyContent='space-between' w='full'>
                    <Text>Saidas
                        {isLoading && (
                            <Spinner size="sm" color="gray.500" ml="4" />
                        )}
                    </Text>
                    <Icon as={RiArrowDownCircleLine} w={6} h={6} color='red.400' />
                </Box>
                <Heading size='md' mt='2'>{formatter().format(resumer.cashOut)}</Heading>
            </Box>
            <Box
                h='10vh'
                bg={resumer.total < 0
                    ? 'red.500'
                    : 'green.500'
                }
                borderRadius={8} p='4'>
                <Box d='flex' justifyContent='space-between' w='full'>
                    <Text>Total
                        {isLoading && (
                            <Spinner size="sm" color="gray.500" ml="4" />
                        )}
                    </Text>
                    <Icon as={BiDollar} w={6} h={6} />
                </Box>
                <Heading size='md' mt='2'>{formatter().format(resumer.total)}</Heading>
            </Box>
        </SimpleGrid>
    )
}