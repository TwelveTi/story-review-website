export async function apiFetch(url, options = {}, retry = true) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(`http://localhost:5000${url}`, { ...options, headers });
  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(url, options, false); // Retry once after refresh
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return;
    }
  }
  return res.json();
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  const res = await fetch('http://localhost:5000/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (res.status === 200) {
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    return true;
  }
  return false;
}

// ===> Add helper functions here:
export async function apiGet(url) {
  return await apiFetch(url, { method: 'GET' });
}

export async function apiPost(url, body = {}) {
  return await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
