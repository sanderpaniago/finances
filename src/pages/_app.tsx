import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as NextAuthProvider } from 'next-auth/client'
import {QueryClientProvider} from 'react-query'
import { SidebarDrawerProvider } from "../context/SidebarDrawerContext";

import { theme } from "../styles/theme";
import { queryClient } from "../services/querryClient";
function MyApp({ Component, pageProps }: AppProps) {
  return (
      <NextAuthProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <Component {...pageProps} />
            </SidebarDrawerProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </NextAuthProvider>
  )
}

export default MyApp
