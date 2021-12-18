import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
    uri: "https://graphql.fauna.com/graphql",
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: process.env.NEXT_PUBLIC_FAUNADB_KEY_GRAPHQL
        }
    }
})

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            allTransaciton: {
                keyFields: ['']
            },
            userByEmail: {
                keyFields: ['email']
            }
        }
    }),
});

export default client;