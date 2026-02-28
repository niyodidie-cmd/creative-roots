interface Booking {
  _id: string;
  name: string;
  email: string;
  attendees: number;
  eventTitle: string;
  status?: string;
  amount?: number;
  createdAt: string;
}

interface Donation {
  _id: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Stats {
  events: number;
  bookings: number;
  donations: number;
  totalRevenue: number;
  recentBookings: Booking[];
  recentDonations: Donation[];
}

interface AdminStatsProps {
  stats: Stats;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: 'Total Bookings',
      value: stats.bookings,
      subtext: '',
      icon: '📅',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Total Donations',
      value: stats.donations,
      subtext: `${stats.totalRevenue.toLocaleString()} RWF`,
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Revenue',
      value: stats.totalRevenue.toLocaleString(),
      subtext: 'RWF',
      icon: '💵',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">{card.title}</h3>
              <span className="text-3xl">{card.icon}</span>
            </div>
            <div className="text-4xl font-bold mb-2">{card.value}</div>
            <p className="text-sm opacity-75">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* recent activity lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
          {stats.recentBookings.length === 0 ? (
            <p className="text-sm text-gray-600">No recent bookings.</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentBookings.map((b) => (
                <li key={b._id} className="flex justify-between text-sm">
                  <span>{b.name} ({b.attendees})</span>
                  <span className="text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Donations</h3>
          {stats.recentDonations.length === 0 ? (
            <p className="text-sm text-gray-600">No recent donations.</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentDonations.map((d) => (
                <li key={d._id} className="flex justify-between text-sm">
                  <span>{d.donorName} ({d.amount})</span>
                  <span className="text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
