import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS } from '../config';
import { loadStudents, saveStudents } from '../utils/storage';

export default function Admin() {
  const navigate = useNavigate();

  // ---- Auth state ----
  const [step, setStep] = useState('login'); // 'login' | 'dashboard'
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // ---- Dashboard state ----
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newName, setNewName] = useState('');
  const [newCount, setNewCount] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saved' | 'error'
  const [exportData, setExportData] = useState(null);

  // ---- Login ----
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginId === ADMIN_CREDENTIALS.id && loginPass === ADMIN_CREDENTIALS.password) {
      const stay = localStorage.getItem('bloodmoon_admin_logged_in') === '1';
      if (stay) setStep('dashboard');
      else {
        sessionStorage.setItem('bloodmoon_admin_logged_in', '1');
        setStep('dashboard');
      }
    } else {
      setLoginError('Wrong spell, try again 🎃');
    }
  };

  // ---- Load students + check session ----
  useEffect(() => {
    async function init() {
      const loggedIn = sessionStorage.getItem('bloodmoon_admin_logged_in') === '1';
      if (!loggedIn) {
        setStep('login');
        return;
      }
      const data = await loadStudents();
      setStudents(data);
      setLoading(false);
    }
    init();
  }, []);

  // ---- Logout ----
  const handleLogout = () => {
    sessionStorage.removeItem('bloodmoon_admin_logged_in');
    setStep('login');
    setLoginId('');
    setLoginPass('');
    setLoginError('');
  };

  // ---- Snapshot for export/import ----
  const handleExport = () => {
    setExportData(JSON.stringify(students, null, 2));
    setSaveStatus('Exported! Copy it somewhere safe.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('Not an array');
        setStudents(parsed);
        saveStudents(parsed);
        setSaveStatus('Imported successfully! 🎃');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch {
        setSaveStatus('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ---- CRUD helpers ----
  const startEdit = (student) => {
    setEditingId(student.id);
    setEditValue(String(student.registrations));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const addStudent = () => {
    const name = newName.trim();
    if (!name) {
      setSaveStatus('Enter a student name.');
      return;
    }
    const count = newCount
      ? Math.max(0, Math.floor(Number(newCount)))
      : Math.floor(Math.random() * 50) + 5;
    const student = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${name}-${Date.now()}`,
      name,
      registrations: count,
    };
    setStudents((prev) => [...prev, student]);
    saveStudents([...students, student]);
    setNewName('');
    setNewCount('');
    setSaveStatus(`${name} added! 🎃`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (!window.confirm(`Delete ${deleteTarget.name} from the graveyard? 🪦`)) return;
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    saveStudents([...students]);
    setDeleteTarget(null);
    setSaveStatus('Deleted. 🎃');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const commitNameEdit = () => {
    const name = editNameValue.trim();
    if (!name) {
      setSaveStatus('Student name cannot be empty.');
      return;
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === editingId ? { ...s, name } : s))
    );
    saveStudents([...students]);
    setEditingId(null);
    setEditNameValue('');
    setSaveStatus('Renamed! 🎃');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const commitEdit = () => {
    const n = Number(editValue);
    if (!Number.isFinite(n) || n < 0) {
      setSaveStatus('Count must be a non-negative number.');
      return;
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === editingId ? { ...s, registrations: n } : s))
    );
    saveStudents([...students]);
    setEditingId(null);
    setEditValue('');
    setSaveStatus('Saved! 🎃');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (loading && step === 'dashboard') {
    return (
      <div className="content">
        <div className="bg-layer" />
        <div className="overlay" />
        <div className="home-container" style={{ justifyContent: 'center' }}>
          <div className="event-title" style={{ fontSize: '2rem' }}>Loading the scribe's ledger...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="bg-layer" />
      <div className="overlay" />
      <div
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
        <div className="bat bat-1"></div>
        <div className="bat bat-2"></div>
        <div className="bat bat-3"></div>
        <div className="bat bat-4"></div>
        <div className="bat bat-5"></div>
      </div>
      <div className="fog" aria-hidden="true" />

      {step === 'login' ? (
        <div className="home-container" style={{ justifyContent: 'center' }}>
          <div className="event-title">Vedathon 2.0<br/>Graveyard</div>
          <form
            className="leaderboard-panel"
            style={{ width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}
            onSubmit={handleLogin}
          >
            <h2 style={{ fontSize: '1.6rem', margin: '0 0 8px', fontFamily: "'Manrope', sans-serif" }}>Enter the graveyard</h2>
            <p style={{ color: 'var(--muted-text)', margin: '0 0 24px', fontSize: '0.95rem' }}>
              Gain entry with the admin spell.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-id">
                ID
              </label>
              <input
                id="admin-id"
                className="form-input"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="manav"
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-pass">
                Password
              </label>
              <input
                id="admin-pass"
                className="form-input"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>

            {loginError && <div className="error-msg">{loginError}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Enter the graveyard
            </button>
          </form>
        </div>
      ) : (
        <div className="home-container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', width: '100%', maxWidth: '1050px', marginBottom: '24px' }}>
            <div className="event-title" style={{ margin: 0, fontSize: '2rem' }}>
              Admin — Ledger
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Save status */}
          {saveStatus && (
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(132,204,22,0.15)',
                color: 'var(--eerie-green)',
                fontSize: '0.95rem',
                textAlign: 'center',
              }}
            >
              {saveStatus}
            </div>
          )}

          <div
            className="leaderboard-panel"
            style={{ padding: '24px', borderWidth: '1px' }}
          >
            {/* Add student */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="new-name">
                  New student name
                </label>
                <input
                  id="new-name"
                  className="form-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mira"
                  onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-count">
                  Initial registrations
                </label>
                <input
                  id="new-count"
                  className="form-input"
                  type="number"
                  min={0}
                  value={newCount}
                  onChange={(e) => setNewCount(e.target.value)}
                  placeholder="random 5-55"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-primary" onClick={addStudent} style={{ flex: 1 }}>
                  Add student
                </button>
              </div>
            </div>

            {/* Export / Import */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-ghost" onClick={handleExport} style={{ flex: 1 }}>
                Export JSON
              </button>
              <label className="btn btn-ghost" style={{ flex: 1 }}>
                Import JSON
                <input type="file" accept="application/json" hidden onChange={handleImport} />
              </label>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid rgba(249,115,22,0.35)' }}>
                    <th style={{ padding: '12px 14px', color: 'rgba(245,245,244,0.7)', fontSize: '0.9rem' }}>Rank</th>
                    <th style={{ padding: '12px 14px', color: 'rgba(245,245,244,0.7)', fontSize: '0.9rem' }}>Name</th>
                    <th style={{ padding: '12px 14px', color: 'rgba(245,245,244,0.7)', fontSize: '0.9rem' }}>Registrations</th>
                    <th style={{ padding: '12px 14px', color: 'rgba(245,245,244,0.7)', fontSize: '0.9rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...students].sort((a, b) => b.registrations - a.registrations).map((student, idx) => (
                    <tr
                      key={student.id}
                      className="student-row"
                      style={{
                        animation: 'fadeUp 0.4s ease forwards',
                        backgroundColor: editingId === student.id ? 'rgba(249,115,22,0.12)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        {idx === 0 ? <><span className="rank-indicator gold"></span> 01</> : idx === 1 ? <><span className="rank-indicator silver"></span> 02</> : idx === 2 ? <><span className="rank-indicator bronze"></span> 03</> : String(idx + 1).padStart(2, '0')}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--bone-white)' }}>
                        {editingId === student.id ? (
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              className="form-input"
                              style={{ width: '130px' }}
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && commitNameEdit()}
                            />
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '4px 10px' }}
                              onClick={commitNameEdit}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '4px 10px' }}
                              onClick={() => cancelEdit()}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          student.name
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {editingId === student.id ? (
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              className="form-input"
                              style={{ width: '90px' }}
                              type="number"
                              min={0}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                            />
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '4px 10px' }}
                              onClick={() => commitEdit()}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '4px 10px' }}
                              onClick={() => cancelEdit()}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 800, color: 'var(--blood-red)' }}>{student.registrations}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', display: 'flex', gap: '8px' }}>
                        {editingId !== student.id && (
                          <>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '6px 10px' }}
                              onClick={() => startEdit(student)}
                            >
                              Edit
                            </button>
                            {deleteTarget?.id === student.id ? (
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <span style={{ color: '#fca5a5', fontSize: '0.85rem' }}>Delete?</span>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  style={{ padding: '4px 10px' }}
                                  onClick={confirmDelete}
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost"
                                  style={{ padding: '4px 10px' }}
                                  onClick={() => setDeleteTarget(null)}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-danger"
                                style={{ padding: '6px 10px' }}
                                onClick={() => setDeleteTarget(student)}
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'rgba(245,245,244,0.6)' }}>
                        No students yet 🌑
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Link to="/" style={{ display: 'inline-block', textAlign: 'center' }}>
            <button type="button" className="btn btn-ghost">
              ← Back to leaderboard
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
