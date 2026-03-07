import Link from 'next/link';

export default function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <aside className={`bg-white border-r w-64 ${collapsed ? 'hidden' : 'block'} min-h-screen`}>
      <div className="px-4 py-6">
        <h3 className="text-lg font-bold text-warm-brown mb-4">Creative Roots Admin</h3>
        <div className="space-y-2">
          <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-cream">📊 Dashboard Overview</Link>
          <Link href="/admin/homepage-manager" className="block px-3 py-2 rounded hover:bg-cream">📰 Homepage Manager</Link>
          <Link href="/admin/events" className="block px-3 py-2 rounded hover:bg-cream">📅 Events</Link>
          <Link href="/admin/gallery" className="block px-3 py-2 rounded hover:bg-cream">🖼 Gallery</Link>
          <Link href="/admin/messages" className="block px-3 py-2 rounded hover:bg-cream">📩 Messages</Link>
          <Link href="/admin/bookings" className="block px-3 py-2 rounded hover:bg-cream">📖 Bookings</Link>
          <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-cream">⚙️ System Settings</Link>
        </div>
        <div className="mt-8 pt-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-600"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
