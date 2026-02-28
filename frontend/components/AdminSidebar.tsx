import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  open: boolean;
}

export default function AdminSidebar({ open }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Events', href: '/admin/events', icon: '📅' },
    { label: 'Bookings', href: '/admin/bookings', icon: '📝' },
    { label: 'Donations', href: '/admin/donations', icon: '💰' },
    { label: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
    { label: 'Success Stories', href: '/admin/stories', icon: '⭐' },
    { label: 'Messages', href: '/admin/messages', icon: '💬' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <aside
      className={`bg-dark-charcoal text-cream h-screen overflow-y-auto transition-all ${
        open ? 'w-64' : 'w-0'
      }`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-soft-gold mb-8">Creative Roots</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                router.pathname === item.href
                  ? 'bg-warm-brown text-cream'
                  : 'hover:bg-warm-brown/20 text-cream/80'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-warm-brown/30 mt-8 pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-cream"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
