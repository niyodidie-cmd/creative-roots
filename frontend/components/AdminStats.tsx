interface Activity {
  _id: string;
  action: string;
  description: string;
  adminUsername?: string;
  createdAt: string;
}

interface Stats {
  totalEvents: number;
  totalGalleryItems: number;
  totalMessages: number;
  totalVisitors: number;
  recentActivity: Activity[];
}

interface AdminStatsProps {
  stats: Stats;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      subtext: 'Active events',
      icon: '📅',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Gallery Items',
      value: stats.totalGalleryItems,
      subtext: 'Photos & videos',
      icon: '🖼',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      subtext: 'Contact inquiries',
      icon: '📩',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Visitors',
      value: stats.totalVisitors,
      subtext: 'This month',
      icon: '👥',
      color: 'from-orange-500 to-orange-600',
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        {stats.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-600">No recent activity.</p>
        ) : (
          <ul className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <li key={activity._id} className="flex justify-between items-start text-sm border-b pb-2">
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-gray-500 text-xs">
                    {activity.adminUsername && `by ${activity.adminUsername} • `}
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.action === 'create' ? 'bg-green-100 text-green-800' :
                  activity.action === 'update' ? 'bg-blue-100 text-blue-800' :
                  activity.action === 'delete' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.action}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
