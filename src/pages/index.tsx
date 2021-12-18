import { GetServerSideProps } from 'next'
import { Button, Flex, Heading, Icon, IconButton, Text } from '@chakra-ui/react'
import { getSession, signIn, useSession } from 'next-auth/client'
import { RiGithubFill } from 'react-icons/ri'
export default function Home() {

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Flex
        w="100%"
        maxWidth="360"
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        alignItems="center"
      >
        <Heading size='lg' mb='8'>Sign in.</Heading>
        <Button
          onClick={() => signIn('github')}
          colorScheme='blackAlpha'
          py='6'
          as="a"
          cursor='pointer'
        >
          <IconButton
            icon={<Icon as={RiGithubFill} />}
            fontSize="24"
            variant="unstyled"
            aria-label='sign github'
          />
          <Text>
            Continue with Github
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session?.user) {
    return {
      redirect: {
        destination: '/app/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {

    }
  }
}