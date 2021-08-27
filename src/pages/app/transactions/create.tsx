import { useRouter } from "next/router";
import { Box, Button, Divider, Flex, Heading, HStack, Icon, Input, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { RiArrowDownCircleLine, RiArrowUpCircleLine } from "react-icons/ri";
import { useState } from "react";
import { useCreatePage } from "../../../services/hooks/useCreatePage";
import { queryClient } from "../../../services/querryClient";

type CreateTransactionFormData = {
    title: string;
    price: number;
    dueDate: string;
    category: string;
}

const createUserFormSchema = yup.object().shape({
    title: yup.string().required(),
    price: yup.number().required(),
    dueDate: yup.string().required(),
})

export default function CreateTransaction() {
    const router = useRouter()
    const [category, setCategory] = useState('')
    
    const {mutateAsync} = useCreatePage()
    
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFormSchema),
    })
    const { errors, isSubmitting } = formState

    const handleCreateUser: SubmitHandler<CreateTransactionFormData> = async (data) => {
        await mutateAsync({
            ...data,
            category
        })
        queryClient.invalidateQueries('resume')
        router.push('/app/transactions')
    }
    return(
        <Box>
        <Header />

        <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
            <Sidebar />

            <Box
                as='form'
                flex='1'
                borderRadius={8}
                bg='gray.800'
                p={['6', '8']}
                onSubmit={handleSubmit(handleCreateUser)}
            >
                <Heading size='lg' fontWeight='normal'>Criar Transação</Heading>

                <Divider my='6' borderColor='gray.700' />

                <VStack spacing={['6', '8']}>
                        <Input
                            name='title'
                            label='Titulo'
                            placeholder='Titulo'
                            variant="filled"
                            bg='blackAlpha.300'
                            _hover={{
                                background: 'blackAlpha.200',
                            }}
                            h='14'
                            error={errors.name}
                            {...register('title')}
                        />
                        <Input
                            name='price'
                            type='number'
                            label='Valor'
                            placeholder='Valor'
                            variant="filled"
                            bg='blackAlpha.300'
                            _hover={{
                                background: 'blackAlpha.200',
                            }}
                            h='14'
                            error={errors.price}
                            {...register('price')}
                        />

                        <Input
                            name='dueDate'
                            type='date'
                            label='Senha'
                            variant="filled"
                            bg='blackAlpha.300'
                            _hover={{
                                background: 'blackAlpha.200',
                            }}
                            h='14'
                            error={errors.password}
                            {...register('dueDate')}
                        />

                        <HStack w='100%' justifyContent='space-between' >
                            <Box 
                                w='48%'
                                height='20'
                                borderRadius='md'
                                bg={category === 'Entrada' ? 'green.300' : 'gray.900'}
                                d='flex'
                                alignItems='center'
                                justifyContent='center'
                                cursor='pointer'
                                onClick={() => setCategory('Entrada')}
                            >
                                <Icon 
                                    as={RiArrowUpCircleLine} 
                                    w={8} 
                                    h={8} 
                                    color='green.700'
                                />
                                <Text 
                                    color={category === 'Entrada' &&'green.700'}
                                    fontWeight='bold'
                                    fontSize='xl'
                                    ml='4'
                                >
                                    Entrada
                                </Text>
                            </Box>
                            <Box 
                                w='48%'
                                height='20'
                                borderRadius='md'
                                bg={category === 'Saida' ? 'red.300' : 'gray.900'}
                                d='flex'
                                alignItems='center'
                                justifyContent='center'
                                cursor='pointer'
                                onClick={() => setCategory('Saida')}
                            >
                                <Icon 
                                    as={RiArrowDownCircleLine} 
                                    w={8} 
                                    h={8} 
                                    color='red.700'
                                />
                                <Text 
                                    color={category === 'Saida' && 'red.700'}
                                    fontWeight='bold'
                                    fontSize='xl'
                                    ml='4'
                                >
                                    Saida
                                </Text>
                            </Box>
                        </HStack>
                </VStack>

                <Flex mt={['6', '8']} justify='flex-end'>
                    <HStack spacing='4'>
                        <Link href='/app/transactions' passHref>
                            <Button colorScheme='whiteAlpha'>Cancelar</Button>
                        </Link>
                        <Button 
                            type='submit' 
                            colorScheme='pink'
                            isLoading={isSubmitting}
                        >Salvar</Button>
                    </HStack>
                </Flex>
            </Box>
        </Flex>
    </Box>
    )
}