import { useRouter } from "next/router"
import LinkNext from 'next/link'
import { Box, Button, Divider, Flex, Heading, HStack, Icon, Input, Link, Select, Text, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { RiArrowDownCircleLine, RiArrowUpCircleLine } from "react-icons/ri";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import clientApollo from "../../../services/apollo-client";
import { useMutation } from "@apollo/client";

import GET_TYPE from '../../../graphql/getTypes.gql'
import GET_CATEGORY from '../../../graphql/getCategories.gql'
import CREATE_TRANSACTION from '../../../graphql/createdTransaction.gql'
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
    category: yup.string().required()
})

export default function CreateTransaction({ userId, categories, types }) {
    const router = useRouter()
    const [category, setCategory] = useState('')

    const [createTransaction] = useMutation(CREATE_TRANSACTION)

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFormSchema),
    })
    const { errors, isSubmitting } = formState

    const handleCreateUser: SubmitHandler<CreateTransactionFormData> = async (data) => {
        const categorySelected = types.find(item => item.name === category)

        const isPayValid = new Date(data.dueDate).getTime() <= new Date().getTime()

        const { errors: errorsTransaction } = await createTransaction({
            variables: {
                ...data,
                userId,
                pay: category === 'cash-in' && isPayValid,
                type: categorySelected.id
            }
        })

        if (errorsTransaction)
            return

        router.push('/app/transactions')
    }
    return (
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
                            step="0.01"
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

                        <Select
                            variant='filled'
                            placeholder="Selecionar tipo"
                            bg='blackAlpha.300'
                            h='14'
                            _hover={{
                                background: 'blackAlpha.200',
                            }}
                            name='category'
                            error={errors.category}
                            {...register('category')}
                        >
                            {categories?.map(item => (
                                <option value={item.id} key={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </Select>

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
                                bg={category === 'cash-in' ? 'green.300' : 'gray.900'}
                                d='flex'
                                alignItems='center'
                                justifyContent='center'
                                cursor='pointer'
                                onClick={() => setCategory('cash-in')}
                            >
                                <Icon
                                    as={RiArrowUpCircleLine}
                                    w={8}
                                    h={8}
                                    color='green.700'
                                />
                                <Text
                                    color={category === 'cash-in' && 'green.700'}
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
                                bg={category === 'cash-out' ? 'red.300' : 'gray.900'}
                                d='flex'
                                alignItems='center'
                                justifyContent='center'
                                cursor='pointer'
                                onClick={() => setCategory('cash-out')}
                            >
                                <Icon
                                    as={RiArrowDownCircleLine}
                                    w={8}
                                    h={8}
                                    color='red.700'
                                />
                                <Text
                                    color={category === 'cash-out' && 'red.700'}
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
                            <Link href='/app/transactions' as={LinkNext}>
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
        query: GET_TYPE,
        fetchPolicy: 'no-cache'
    })

    const { data: dataCategories } = await clientApollo.query({
        query: GET_CATEGORY,
        fetchPolicy: 'no-cache',
        variables: {
            email: session.user.email
        }
    })

    const categories = dataCategories.userByEmail.categories.data.map(item => {
        return {
            id: item._id,
            name: item.name
        }
    })

    const types = data.allTypes.data.map(item => ({
        id: item._id,
        name: item.name
    }))

    return {
        props: {
            userId: session.userId,
            categories,
            types
        }
    }
}