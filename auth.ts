import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './lib/prisma'

// Define proper types for our user
interface AppUser {
  id: string
  name?: string
  email?: string
  role?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        //Find user in the database
        const user = await prisma.users.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) throw new Error('No user found')

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        )
        if (!isValid) throw new Error('Invalid password')

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async session({ session, token }) {
      // Add properties to session from token
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },

    async jwt({ token, user }) {
      // Add properties from user to token when signing in
      if (user) {
        token.id = user.id
        token.role = (user as AppUser).role
      }
      return token
    },
  },

  secret: process.env.AUTH_SECRET,
})

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role?: string | null
    }
  }
}
