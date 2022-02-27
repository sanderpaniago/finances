import { Box, Button, Flex, HStack, Icon } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from 'next/link'
import { getSession } from "next-auth/client";
import { useMutation } from "@apollo/client";
import { RiAddLine } from "react-icons/ri";

import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { TableItemCategory } from "../../../components/Table/TableItemCategory";

import clientApollo from "../../../services/apollo-client";

import GET_CATEGORIES from '../../../graphql/getCategories.gql'
import DELETE_CATEGORY from '../../../graphql/deleteCategory.gql'

import { useState } from "react";

export default function Categories({ categories }) {
  const [categoriesList, setCategoriesList] = useState(categories)
  const [deleteCategory] = useMutation(DELETE_CATEGORY)

  async function handleDeleteCategory(id: string) {
    const { errors } = await deleteCategory({
      variables: {
        id,
      }
    })

    if (!!errors) {
      return
    }

    const newList = categoriesList.filter(item => item.id !== id)

    setCategoriesList(newList)
  }
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex='1'>
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Box overflowX='hidden'>
              <HStack
                flex='1'
                pr='5'
              >
                <Box w='100%'>Nome</Box>
                <Link href='/app/categories/create' passHref>
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
                </Link>
              </HStack>
              <Box>
                {categoriesList && categoriesList.map(category => (
                  <TableItemCategory
                    key={category.id}
                    item={category}
                    handleDeleteCategory={handleDeleteCategory}
                  />
                ))}
              </Box>
            </Box>

          </Box>
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
    query: GET_CATEGORIES,
    variables: {
      email: session.user.email
    },
    fetchPolicy: 'no-cache'
  })
  const categories = data.userByEmail.categories.data.map(item => {
    return {
      id: item._id,
      name: item.name
    }
  })

  return {
    props: {
      categories
    }
  }
}