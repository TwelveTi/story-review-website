// src/services/authService.js
const API_BASE_URL = 'http://localhost:5000';

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const register = async (username, fullname, password) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, fullname, password }),
  });
  return response.json();
};
