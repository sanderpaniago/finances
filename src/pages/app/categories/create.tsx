import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import LinkNext from 'next/link'
import { useMutation } from "@apollo/client";
import { Box, Button, Divider, Flex, Heading, HStack, Input, Link, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { SubmitHandler, useForm } from "react-hook-form";

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";

import CREATE_CATEGORY from '../../../graphql/createdCategory.gql'

type CreateCategoryFormData = {
  name: string
}

type CreateCategoryProps = {
  session: Session
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required()
})



export default function CreateCategory({ session }: CreateCategoryProps) {
  const router = useRouter()
  const [createCategory] = useMutation(CREATE_CATEGORY)
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  })
  const { errors, isSubmitting } = formState

  const handleCreateUser: SubmitHandler<CreateCategoryFormData> = async (data) => {
    console.log(data)
    const { errors: errorsCategory } = await createCategory({
      variables: {
        name: data.name,
        userId: session.userId
      }
    })
    if (errorsCategory)
      return

    router.push('/app/categories')
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
          <Heading size='lg' fontWeight='normal'>Criar Categoria</Heading>

          <Divider my='6' borderColor='gray.700' />
          <VStack spacing={['6', '8']}>
            <Input
              name='name'
              label='Nome'
              placeholder='Nome da categoria'
              variant="filled"
              bg='blackAlpha.300'
              _hover={{
                background: 'blackAlpha.200',
              }}
              h='14'
              error={errors.name}
              {...register('name')}
            />
          </VStack>

          <Flex mt={['6', '8']} justify='flex-end'>
            <HStack spacing='4'>
              <Link href='/app/categories' as={LinkNext}>
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

  return {
    props: {
      session,
    }
  }
}