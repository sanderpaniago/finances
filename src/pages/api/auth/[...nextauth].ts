import NextAuth from "next-auth";
import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";
import Providers from "next-auth/providers";

type UserData = {
    data: {
        idDatabase: string;
    }
}

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
                const idDatabaseNotion = await fauna.query<UserData>(
                    q.Get(
                        q.Match(
                            q.Index('user_by_email'),
                            q.Casefold(session.user.email)
                        )
                    )
                )
                if (idDatabaseNotion.data.idDatabase) {
                    return {
                        ...session,
                        idDatabase: idDatabaseNotion.data.idDatabase
                    }
                }
                return {
                    ...session,
                    idDatabase: null
                }
            } catch {
                return {
                    ...session,
                    idDatabase: null
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('user'),
                            {data: { email }}
                        ),
                        q.Get(
                            q.Match(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        )
                    )
                )

                return true
            } catch {
                return false
            }
        }
    }
});
