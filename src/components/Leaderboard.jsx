import PropTypes from 'prop-types';
import StudentRow from './StudentRow';

export default function Leaderboard({ students, onRename, onDelete }) {
  const sorted = [...students].sort((a, b) => b.registrations - a.registrations);
  const total = sorted.reduce((sum, s) => sum + s.registrations, 0);
  const count = sorted.length;
  const isAdmin = Boolean(onRename || onDelete);

  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-hero">
        <div className="event-label">CHALLENGE TRACKER</div>
        <h1 className="event-title">
          VEDATHON 2.0<br />
          LEADERBOARD
        </h1>
        <div className="event-divider" />
        <p className="event-subtitle">Track the top participants of the challenge</p>
      </div>

      <div className="leaderboard-stats">
        <div className="stat-box">
          <span className="stat-label">TOTAL STUDENTS</span>
          <span className="stat-value">{count}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">REGISTRATIONS</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="leaderboard-content">
        <div className={`table-header ${isAdmin ? 'admin' : ''}`}>
          <div className="col-rank">RANK</div>
          <div className="col-participant">PARTICIPANT</div>
          <div className="col-score">REGISTRATIONS</div>
          {isAdmin && <div className="col-actions">ACTIONS</div>}
        </div>

        <div className="table-body">
          {sorted.map((student, idx) => (
            <StudentRow
              key={student.id}
              student={student}
              rank={idx}
              onRename={onRename}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))}
          {sorted.length === 0 && (
            <div className="empty-state">No participants yet 🌑</div>
          )}
        </div>
      </div>
    </div>
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
