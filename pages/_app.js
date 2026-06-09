import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '../stores/auth.store';

function AuthHydrator({ children }) {
  const { data: session, status } = useSession();
  const { setUser, setHydrated } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user);
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
    if (status !== 'loading') {
      setHydrated();
    }
  }, [session, status, setUser, setHydrated]);

  return children;
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthHydrator>
        <Component {...pageProps} />
      </AuthHydrator>
    </SessionProvider>
  );
}
