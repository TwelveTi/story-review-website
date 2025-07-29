const API_BASE_URL = 'http://localhost:5000';

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
};

export const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
