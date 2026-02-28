import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SecureAdminLogin() {
  const router = useRouter();

  useEffect(() => {
    // simply redirect to the real login page
    router.replace('/admin/login');
  }, [router]);

  return null;
}
