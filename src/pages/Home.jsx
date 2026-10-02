import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadStudents } from '../utils/storage';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      const data = await loadStudents();
      if (!cancelled) {
        setStudents(data);
        setLoading(false);
      }
    }

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="content">
        <div className="bg-layer" />
        <div className="overlay" />
        <div className="bats" aria-hidden="true">
          <div className="bat bat-1">🦇</div>
          <div className="bat bat-2">🦇</div>
          <div className="bat bat-3">🦇</div>
          <div className="bat bat-4">🦇</div>
        </div>
        <div className="fog" aria-hidden="true" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div className="title">Vedathon2.0 Leaderboard</div>
          <div style={{ color: 'rgba(245,245,244,0.6)', fontSize: '1.1rem' }}>Loading the graveyard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="bg-layer" />
      <div className="overlay" />        <div
          className="bats"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div className="bat bat-1">🦇</div>
          <div className="bat bat-2">🦇</div>
          <div className="bat bat-3">🦇</div>
          <div className="bat bat-4">🦇</div>
          <div className="bat bat-5">🦇</div>
        </div>
      <div className="fog" aria-hidden="true" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 60px' }}>
        <div className="title" style={{ marginBottom: '8px' }}>
          Vedathon2.0 Leaderboard
        </div>
        <div style={{ fontSize: '1rem', color: 'rgba(245,245,244,0.7)', marginBottom: '24px' }}>
          How many registrations each student has earned
        </div>

        <Leaderboard students={students} />
      </div>

      <div className="footer">
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
}
