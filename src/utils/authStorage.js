const STORAGE_KEYS = {
  token: 'token',
  userId: 'userId',
  userName: 'userName',
  userEmail: 'userEmail',
  userRole: 'userRole',
  userProfileImage: 'userProfileImage',
  admin: 'admin',
};

const read = (key) => localStorage.getItem(key);
const write = (key, value) => {
  if (value === null || value === undefined || value === '') {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, value);
};

export const authStorage = {
  get token() {
    return read(STORAGE_KEYS.token);
  },
  set token(value) {
    write(STORAGE_KEYS.token, value);
  },

  get userId() {
    return read(STORAGE_KEYS.userId);
  },
  set userId(value) {
    write(STORAGE_KEYS.userId, value);
  },

  get userName() {
    return read(STORAGE_KEYS.userName);
  },
  set userName(value) {
    write(STORAGE_KEYS.userName, value);
  },

  get userEmail() {
    return read(STORAGE_KEYS.userEmail);
  },
  set userEmail(value) {
    write(STORAGE_KEYS.userEmail, value);
  },

  get userRole() {
    return read(STORAGE_KEYS.userRole);
  },
  set userRole(value) {
    write(STORAGE_KEYS.userRole, value);
  },

  get userProfileImage() {
    return read(STORAGE_KEYS.userProfileImage);
  },
  set userProfileImage(value) {
    write(STORAGE_KEYS.userProfileImage, value);
  },

  get admin() {
    return read(STORAGE_KEYS.admin);
  },
  set admin(value) {
    write(STORAGE_KEYS.admin, value);
  },
};

export const saveSession = ({
  token,
  userId,
  userName,
  userEmail,
  userRole,
  userProfileImage,
  admin,
}) => {
  if (token !== undefined) authStorage.token = token;
  if (userId !== undefined) authStorage.userId = userId;
  if (userName !== undefined) authStorage.userName = userName;
  if (userEmail !== undefined) authStorage.userEmail = userEmail;
  if (userRole !== undefined) authStorage.userRole = userRole;
  if (userProfileImage !== undefined) authStorage.userProfileImage = userProfileImage;
  if (admin !== undefined) authStorage.admin = admin;
};

export const clearSession = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

export const notifyAuthChange = () => {
  window.dispatchEvent(new Event('authChange'));
};

export const isAuthenticated = () => Boolean(authStorage.token || authStorage.userName);
