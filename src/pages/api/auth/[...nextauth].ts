import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import client from "../../../services/apollo-client";

import GET_USER_BY_EMAIL from '../../../graphql/getUserByEmail.gql'
import CREATED_USER from '../../../graphql/createdUser.gql'


export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user'
        }),
    ],
    callbacks: {
        async session(session) {
            try {
                const { data } = await client.query({
                    query: GET_USER_BY_EMAIL,
                    variables: {
                        email: session.user.email
                    }
                })

                if (!data.userByEmail?._id)
                    return session

                return {
                    ...session,
                    userId: data.userByEmail._id
                }
            } catch {
                return session
            }
        },
        async signIn(user, account, profile) {
            const { email, name } = user
            const [firstName, lastName] = name.split(' ')
            try {
                const {data} = await client.query({
                    query: GET_USER_BY_EMAIL,
                    variables: {
                        email
                    }
                })
                if (data.userByEmail?.email)
                    return true
                
                await client.mutate({
                    mutation: CREATED_USER,
                    variables: {
                        email,
                        firstName,
                        lastName
                    }
                })   
                
                return true
            } catch(e) {
                return false
            }
        }
    }
});
