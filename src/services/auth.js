import users from "../users.json"; // Assuming the JSON file is in the src folder

export const validateLogin = (userId, password) => {
  // Check if the userId exists and if the password matches
  if (users[userId] && users[userId] === password) {
    return true; // Success
  }
  return false; // Invalid credentials
};
