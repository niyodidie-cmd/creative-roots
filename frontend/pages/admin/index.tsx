import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // simply redirect to login if not logged in
    router.replace('/admin/login');
  }, [router]);

  return null;
}
