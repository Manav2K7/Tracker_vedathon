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
          <div className="bat bat-1"></div>
          <div className="bat bat-2"></div>
          <div className="bat bat-3"></div>
          <div className="bat bat-4"></div>
        </div>
        <div className="fog" aria-hidden="true" />
        <div className="home-container" style={{ justifyContent: 'center' }}>
          <div className="event-title" style={{ fontSize: '2rem' }}>Loading the graveyard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="bg-layer" />
      <div className="overlay" />        
      <div className="bats" aria-hidden="true">
        <div className="bat bat-1"></div>
        <div className="bat bat-2"></div>
        <div className="bat bat-3"></div>
        <div className="bat bat-4"></div>
        <div className="bat bat-5"></div>
      </div>
      <div className="fog" aria-hidden="true" />

      <div className="home-container">
        <Leaderboard students={students} />
      </div>

      <div className="footer">
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
}
