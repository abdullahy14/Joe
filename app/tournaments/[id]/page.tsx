import { TournamentDetailPage } from '@/components/pages/TournamentDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TournamentDetailPage id={id} />;
}
