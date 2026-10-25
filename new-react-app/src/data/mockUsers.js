// Initial Demo Customers for SIMA Shop
export const initialUsers = [
  {
    id: 'usr_somchai',
    username: 'somchai',
    password: '1234',
    name: 'สมชาย รักการยิง',
    email: 'somchai.pubg@gmail.com',
    phone: '089-123-4567',
    avatar: '👑',
    role: 'customer',
    country: 'th',
    balanceTHB: 25000,
    balanceVND: 18000000,
    joinedDate: '15/01/2026'
  },
  {
    id: 'usr_nguyen',
    username: 'nguyen_pro',
    password: '1234',
    name: 'Nguyễn Văn Minh',
    email: 'nguyen.minh@gmail.com',
    phone: '+84 90 123 4567',
    avatar: '⚡',
    role: 'customer',
    country: 'vn',
    balanceTHB: 15000,
    balanceVND: 10800000,
    joinedDate: '20/02/2026'
  },
  {
    id: 'usr_thanawat',
    username: 'thanawat_pubg',
    password: '1234',
    name: 'ธนวัฒน์ พลเดช',
    email: 'thanawat.p@outlook.com',
    phone: '081-987-6543',
    avatar: '🎯',
    role: 'customer',
    country: 'th',
    balanceTHB: 50000,
    balanceVND: 36000000,
    joinedDate: '10/03/2026'
  }
];

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
