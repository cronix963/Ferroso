import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        const result = await query(
          'SELECT id, email, password_hash, nombre, rol, activo FROM users WHERE email = $1',
          [credentials.email]
        );

        const user = result.rows[0];

        if (!user) throw new Error('Credenciales inválidas');
        if (!user.activo) throw new Error('Cuenta desactivada');
        if (!user.password_hash) throw new Error('Esta cuenta usa inicio de sesión con Google');

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) throw new Error('Credenciales inválidas');

        return { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.nombre = user.nombre;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.nombre = token.nombre;
      session.user.rol = token.rol;
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          const result = await query('SELECT id FROM users WHERE email = $1', [user.email]);
          if (result.rows.length === 0) {
            await query(
              `INSERT INTO users (email, nombre, google_id, provider, rol, activo) VALUES ($1, $2, $3, $4, $5, TRUE)`,
              [user.email, user.name || 'Usuario Google', account.providerAccountId, 'google', 'cliente']
            );
          }
          const dbUser = await query('SELECT id, nombre, rol FROM users WHERE email = $1', [user.email]);
          if (dbUser.rows[0]) {
            user.id = dbUser.rows[0].id;
            user.nombre = dbUser.rows[0].nombre;
            user.rol = dbUser.rows[0].rol;
          }
        } catch (err) {
          console.error('[NextAuth] Google sign-in error:', err);
          return false;
        }
      }
      return true;
    },
  },
  pages: { signIn: '/' },
  secret: process.env.NEXTAUTH_SECRET,
});
