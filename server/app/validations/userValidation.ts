export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
  return password.length >= 6 && passwordRegex.test(password);
};

export const isSafeString = (str: string) => {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(str);
};
