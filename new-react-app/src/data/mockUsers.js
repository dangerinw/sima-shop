// Initial Customers for SIMA Shop
export const initialUsers = [];

export const getStoredUsers = () => {
  try {
    const saved = localStorage.getItem('sima_registered_users');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load users from localStorage', e);
  }
  return initialUsers;
};

export const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('sima_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
};
