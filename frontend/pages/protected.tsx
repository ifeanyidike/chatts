import { useSession } from 'next-auth/react';
import router from 'next/router';
import { RippleMultiLoader } from '../components/Loaders';

export default function ProtectedRoute(props: any) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.replace('/');
    },
  });

  if (status === 'loading') {
    return <RippleMultiLoader />;
  }

  return props.children;
}
