interface Stats {
  donations: { count: number; total: number };
  gallery: number;
  videos: number;
  blogPosts: number;
}

interface AdminStatsProps {
  stats: Stats;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: 'Total Donations',
      value: stats.donations.count,
      subtext: `${stats.donations.total.toLocaleString()} RWF`,
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Gallery Items',
      value: stats.gallery,
      subtext: 'Artworks',
      icon: '🖼️',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Videos',
      value: stats.videos,
      subtext: 'Uploaded',
      icon: '🎬',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      subtext: 'Published',
      icon: '📝',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition`}
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
  );
}
