export const getUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setUser = user => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('currentUser');
};
