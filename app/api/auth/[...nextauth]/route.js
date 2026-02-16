import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { pool } from "@/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",   // 🔥 IMPORTANT
  },

  callbacks: {
    async jwt({ token, user }) {
      // First time login
      if (user) {
        const result = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [user.email]
        );

        if (result.rows.length === 0) {
          const insert = await pool.query(
            `INSERT INTO users (name, email, image)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [user.name, user.email, user.image]
          );

          token.id = insert.rows[0].id;
        } else {
          token.id = result.rows[0].id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;  // 🔥 ALWAYS available
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };