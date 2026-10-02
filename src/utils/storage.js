import { STORAGE_KEY } from '../config';

/**
 * Load students from localStorage, or seed with default data.
 * Falls back to /public/students.json when localStorage is empty.
 */
export function loadStudents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // corrupted storage: fall through to seed
    }
  }

  // Try to fetch the bundled public/students.json
  try {
    const resp = fetch('/students.json', { cache: 'no-cache' });
    // If served, wait for it; if not (e.g. during dev without build), treat as unavailable.
    return resp.then((r) => {
      if (r.ok) return r.json();
      throw new Error('no json');
    });
  } catch {
    // Offline / no bundled json: use seed data
  }

  return seedStudents();
}

/**
 * Save students to localStorage.
 */
export function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

/**
 * Seed default sample students.
 */
function seedStudents() {
  const names = ['Aarav', 'Riya', 'Kabir', 'Sneha', 'Rohan'];
  return names.map((name) => ({
    id: crypto.randomUUID ? crypto.randomUUID() : `${name}-${Date.now()}`,
    name,
    registrations: Math.floor(Math.random() * 50) + 5,
  }));
}
