export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z_]+$/;
  return name.length >= 3 && nameRegex.test(name);
};
export const isValidPassword = (password: string): boolean =>{
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return password.length >= 8 && passwordRegex.test(password);
};