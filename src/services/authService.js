// ============================================================
// Auth Service – replaces this with real API calls later
// ============================================================
import { mockUsers } from '../data/mockData.js';
import { apiClient } from './apiClient.js';

const AUTH_KEY = 'subsync_auth';

export const authService = {
  /**
   * Simulate login – returns user object or throws error
   */
  login: async (email, password) => {
    if (apiClient.configured) {
      const user = await apiClient.login({ email, password });
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
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
    if (apiClient.configured) {
      const user = await apiClient.register({ fullName, email, password });
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
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

  updateProfile: async (changes) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('You must be signed in to update your profile.');

    const result = apiClient.configured
      ? await apiClient.request('/auth/profile', { method: 'PATCH', body: changes })
      : changes;
    const updatedUser = { ...currentUser, ...(result?.user || result), initials: initialsFor(result?.user?.name || result?.name || changes.name) };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  /**
   * Logout – clears session
   */
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    apiClient.clearToken();
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

function initialsFor(name = '') {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
}
