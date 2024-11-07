// File: pages/admin/match-entry.tsx
import dynamic from 'next/dynamic';

// SSR을 비활성화한 상태로 MatchEntry 컴포넌트를 동적으로 가져오기
const MatchEntry = dynamic(() => import('../../components/MatchEntry'), { ssr: false });

const MatchEntryPage = () => {
  return (
    <div>
      <MatchEntry />
    </div>
  );
};

export default MatchEntryPage;
