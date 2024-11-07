// File: pages/admin/match-entry.tsx
import dynamic from 'next/dynamic';

const MatchEntry = dynamic(() => import('../../components/MatchEntry'), { ssr: false });

const MatchEntryPage = () => {
  return <MatchEntry />;
};

export default MatchEntryPage;