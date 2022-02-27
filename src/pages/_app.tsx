import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as NextAuthProvider } from 'next-auth/client'
import { QueryClientProvider } from 'react-query'
import { SidebarDrawerProvider } from "../context/SidebarDrawerContext";

import { theme } from "../styles/theme";
import { queryClient } from "../services/querryClient";

import { ApolloProvider } from "@apollo/client";
import clientApollo from "../services/apollo-client";

function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <ApolloProvider client={clientApollo}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </NextAuthProvider>
  )
}

export default App
