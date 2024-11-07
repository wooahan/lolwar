// File: pages/index.tsx (Main Page)

import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>롤 내전 전적 관리 서비스</h1>
      <nav>
        <ul>
          <li>
            <Link href="/admin/player-management">
              <a>선수 관리</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
