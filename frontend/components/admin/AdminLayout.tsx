import { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setAdminName(data.admin.username);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} />
        </div>
        <div className="flex-1">
          <header className="sticky top-0 bg-white border-b z-40">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setCollapsed(!collapsed)} className="md:hidden px-2 py-1 rounded bg-gray-100">Menu</button>
                <h2 className="text-lg font-semibold">Creative Roots Admin</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">Logged in as <strong>{adminName}</strong></div>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
              </div>
            </div>
          </header>

          <main className="p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
