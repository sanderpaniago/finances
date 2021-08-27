import NextAuth from "next-auth";
import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";
import Providers from "next-auth/providers";

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user'
        }),
    ],
});
