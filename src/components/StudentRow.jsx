import PropTypes from 'prop-types';

export default function StudentRow({ student, rank, onRename, onDelete, isAdmin }) {
  const isTop1 = rank === 0;
  const isTop2 = rank === 1;
  const isTop3 = rank === 2;
  
  const rankClass = isTop1 ? 'top-1' : isTop2 ? 'top-2' : isTop3 ? 'top-3' : '';
  
  let rankContent;
  if (isTop1) {
    rankContent = <><span className="rank-indicator gold"></span> 01</>;
  } else if (isTop2) {
    rankContent = <><span className="rank-indicator silver"></span> 02</>;
  } else if (isTop3) {
    rankContent = <><span className="rank-indicator bronze"></span> 03</>;
  } else {
    rankContent = String(rank + 1).padStart(2, '0');
  }

  return (
    <div className={`student-row ${rankClass} ${isAdmin ? 'admin' : ''}`}>
      <div className={`rank-display ${rankClass}`}>
        {rankContent}
      </div>
      <div className="student-name">{student.name}</div>
      <div className="reg-count">{student.registrations}</div>
      {isAdmin && (
        <div className="row-actions">
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
  isAdmin: PropTypes.bool,
};
