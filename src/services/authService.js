// ============================================================
// Auth Service – replaces this with real API calls later
// ============================================================
import { mockUsers } from '../data/mockData.js';

const AUTH_KEY = 'subsync_auth';

export const authService = {
  /**
   * Simulate login – returns user object or throws error
   */
  login: async (email, password) => {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 600));

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password. Please try again.');
    }

    const session = { ...user };
    delete session.password; // never store password
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return session;
  },

  /**
   * Simulate registration
   */
  register: async ({ fullName, email, password }) => {
    await new Promise((res) => setTimeout(res, 800));

    const exists = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `u${Date.now()}`,
      name: fullName,
      email,
      role: 'customer',
      avatar: null,
      initials: fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return newUser;
  },

  /**
   * Logout – clears session
   */
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  /**
   * Get currently logged-in user
   */
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!authService.getCurrentUser();
  },
};
