import { useRouter } from 'next/router';
import { useEffect, useState, PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

const LOGIN_PATH = '/login';

const RouteGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [ authorized, setAuthorized ] = useState(false);

  const authCheck = (url: string) => {
    // Redirect to login page if accessing a private page and not logged in
    const publicPaths = [ LOGIN_PATH ];
    const path = url.split('?')[0];

    if (isConnected || publicPaths.includes(path)) {
      setAuthorized(true);

      return;
    }

    setAuthorized(false);

    router.push({
      pathname: '/login',
      query: { returnUrl: router.asPath },
    });
  };

  useEffect(() => {
    // On initial load -> run auth check
    authCheck(router.asPath);

    // On route change start -> hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // On route change complete -> run auth check
    router.events.on('routeChangeComplete', authCheck);

    // Unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  useEffect(() => {
    authCheck(router.asPath);
  }, [ isConnected ]);

  return (authorized && children) ? <>{children}</> : null;
};

export default RouteGuard;
