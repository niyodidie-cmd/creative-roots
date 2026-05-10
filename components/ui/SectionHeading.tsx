export function SectionHeading({ title, description, badge }: { title: string; description: string; badge?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-sm uppercase tracking-[0.3em] text-gold">{badge || 'INKINGI'}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-sand/80 leading-7">{description}</p>
    </div>
  );
}
