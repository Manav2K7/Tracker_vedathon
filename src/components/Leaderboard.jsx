import PropTypes from 'prop-types';
import StudentRow from './StudentRow';

/**
 * Displays the sorted student list with a total-registration counter.
 */
export default function Leaderboard({ students, onRename, onDelete }) {
  const sorted = [...students].sort((a, b) => b.registrations - a.registrations);
  const total = sorted.reduce((sum, s) => sum + s.registrations, 0);
  const count = sorted.length;

  return (
    <section className="leaderboard" style={{ flex: 1 }}>
      <div className="glass glass-glow" style={{ padding: '28px 32px' }}>
        <h2 className="title">Vedathon2.0 Leaderboard</h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '16px 0 20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div className="total-stats" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(245,245,244,0.7)' }}>Total Students</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--bone-white)' }}>
              {count}
            </div>
          </div>
          <div className="total-stats" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(245,245,244,0.7)' }}>Total Registrations</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--pumpkin-orange)' }}>
              {total}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sorted.map((student, idx) => (
            <StudentRow
              key={student.id}
              student={student}
              rank={idx}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
          {sorted.length === 0 && (
            <div style={{ color: 'rgba(245,245,244,0.6)', textAlign: 'center', padding: '24px' }}>
              No students yet 🌑
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Leaderboard.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      registrations: PropTypes.number.isRequired,
    })
  ).isRequired,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
};
