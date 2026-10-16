/**
 * PracticeLab Background Service Worker
 * Handles API communication with the PracticeLab backend.
 */

const API_BASE_URL = 'http://localhost:5000/api';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'LOGIN_USER') {
    handleLoginUser(request.payload).then(sendResponse);
    return true;
  } else if (request.type === 'DETECT_PROBLEM') {
    handleDetectProblem(request.payload).then(sendResponse);
    return true;
  } else if (request.type === 'ADD_OR_GET_PROBLEM') {
    handleAddOrGetProblem(request.payload).then(sendResponse);
    return true;
  }
});

async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['practicelab_token'], (result) => {
      resolve(result.practicelab_token || null);
    });
  });
}

async function handleLoginUser(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Invalid email or password.' };
    }

    if (data.token) {
      await new Promise((resolve) => chrome.storage.local.set({ practicelab_token: data.token }, resolve));
      return { success: true, token: data.token, user: data.user };
    }

    return { success: false, error: 'Login failed: No token returned from server.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleDetectProblem(payload) {
  try {
    const token = await getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/extension/detect`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleAddOrGetProblem(payload) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, isAuthError: true, error: 'User not authenticated with PracticeLab. Please log in.' };
    }

    const response = await fetch(`${API_BASE_URL}/extension/add-or-get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.status === 401) {
      return { success: false, isAuthError: true, error: data.message || 'Session expired. Please log in again.' };
    }
    return { success: response.ok, data, error: response.ok ? null : (data.message || 'Server error') };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
