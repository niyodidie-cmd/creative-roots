import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAdminAuth<P>(WrappedComponent: any) {
  return function Protected(props: P) {
    const router = useRouter();

    useEffect(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        router.replace('/admin/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}
