import PropTypes from 'prop-types';

/**
 * Single leaderboard row.
 */
export default function StudentRow({ student, rank, onRename, onDelete }) {
  const rankLabel =
    rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`;

  return (
    <div className="student-row">
      <div className="rank-icon">{rankLabel}</div>
      <div className="rank-number">{rank + 1}</div>
      <div className="student-name">{student.name}</div>
      <div className="reg-count">{student.registrations}</div>
      {(onRename || onDelete) && (
        <div className="row-actions" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {onRename && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onRename(student)}
              aria-label={`Rename ${student.name}`}
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onDelete(student)}
              aria-label={`Delete ${student.name}`}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

StudentRow.propTypes = {
  student: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    registrations: PropTypes.number.isRequired,
  }).isRequired,
  rank: PropTypes.number.isRequired,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
};
