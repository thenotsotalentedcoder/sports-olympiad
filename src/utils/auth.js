import { UNIVERSITIES, ADMIN } from '../data/mockData';

export const loginUniversity = (email, password) => {
  const university = UNIVERSITIES.find(
    (uni) => uni.email === email && uni.password === password
  );

  if (university) {
    const authData = {
      type: 'university',
      id: university.id,
      name: university.name,
      code: university.code,
      email: university.email,
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    return authData;
  }

  return null;
};

export const loginAdmin = (email, password) => {
  if (email === ADMIN.email && password === ADMIN.password) {
    const authData = {
      type: 'admin',
      email: email,
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    return authData;
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem('auth');
};

export const getCurrentUser = () => {
  const authData = localStorage.getItem('auth');
  return authData ? JSON.parse(authData) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.type === 'admin';
};

export const isUniversity = () => {
  const user = getCurrentUser();
  return user && user.type === 'university';
};
