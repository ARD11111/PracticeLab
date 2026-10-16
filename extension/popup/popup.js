const CLIENT_URL = 'http://localhost:5173';

document.addEventListener('DOMContentLoaded', async () => {
  const authStatusElem = document.getElementById('authStatus');
  const loginSection = document.getElementById('loginSection');
  const accountBar = document.getElementById('accountBar');
  const accountUserEmail = document.getElementById('accountUserEmail');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');

  // Load auth state
  chrome.storage.local.get(['practicelab_token', 'practicelab_user_email'], async (result) => {
    let token = result.practicelab_token;
    let userEmail = result.practicelab_user_email || '';

    updateAuthUI(token, userEmail);

    // Badge click toggles auth form or disconnect bar
    authStatusElem.addEventListener('click', () => {
      chrome.storage.local.get(['practicelab_token'], (res) => {
        if (!res.practicelab_token) {
          loginSection.style.display = loginSection.style.display === 'none' ? 'block' : 'none';
        } else {
          accountBar.style.display = accountBar.style.display === 'none' ? 'flex' : 'none';
        }
      });
    });

    // Handle Direct Popup Login
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail.value.trim();
      const password = loginPassword.value;

      if (!email || !password) {
        loginError.innerText = 'Please enter both email and password.';
        return;
      }

      btnLogin.innerText = 'Signing In...';
      btnLogin.disabled = true;
      loginError.innerText = '';

      chrome.runtime.sendMessage({ type: 'LOGIN_USER', payload: { email, password } }, (res) => {
        btnLogin.innerText = 'Sign In';
        btnLogin.disabled = false;

        if (res && res.success && res.token) {
          token = res.token;
          const userMail = res.user ? res.user.email : email;
          chrome.storage.local.set({ practicelab_token: token, practicelab_user_email: userMail }, () => {
            loginSection.style.display = 'none';
            loginError.innerText = '';
            updateAuthUI(token, userMail);
            initTabCheck(token);
          });
        } else {
          loginError.innerText = res?.error || 'Login failed. Please check email and password.';
        }
      });
    });

    // Handle Logout / Disconnect
    btnLogout.addEventListener('click', () => {
      chrome.storage.local.remove(['practicelab_token', 'practicelab_user_email'], () => {
        token = null;
        accountBar.style.display = 'none';
        updateAuthUI(null, '');
        showAuthRequiredState();
      });
    });

    initTabCheck(token);
  });
});

function updateAuthUI(token, email) {
  const authStatusElem = document.getElementById('authStatus');
  const loginSection = document.getElementById('loginSection');
  const accountBar = document.getElementById('accountBar');
  const accountUserEmail = document.getElementById('accountUserEmail');

  if (token) {
    authStatusElem.innerText = 'Connected';
    authStatusElem.className = 'auth-badge online';
    loginSection.style.display = 'none';
    if (email) {
      accountUserEmail.innerText = email;
      accountBar.style.display = 'flex';
    }
  } else {
    authStatusElem.innerText = 'Sign In';
    authStatusElem.className = 'auth-badge error';
    loginSection.style.display = 'block';
    accountBar.style.display = 'none';
  }
}

function initTabCheck(token) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      renderError('No active tab found.');
      return;
    }

    // Send message to content script
    chrome.tabs.sendMessage(activeTab.id, { type: 'EXTRACT_PROBLEM_INFO' }, (response) => {
      if (chrome.runtime.lastError || !response || !response.url) {
        renderGenericState();
      } else {
        handleDetectedProblem(response, token);
      }
    });
  });
}

function handleDetectedProblem(info, token) {
  chrome.runtime.sendMessage({ type: 'DETECT_PROBLEM', payload: info }, (response) => {
    if (!response || !response.success) {
      renderDetectedCard(info, null, token);
    } else {
      renderDetectedCard(info, response.data, token);
    }
  });
}

function renderDetectedCard(info, apiData, token) {
  const contentArea = document.getElementById('contentArea');
  const problem = apiData && apiData.problem ? apiData.problem : info;
  const lastSession = apiData ? apiData.lastSession : null;

  let html = `
    <div class="problem-card">
      <div class="meta-row">
        <span class="badge">${problem.difficulty || 'Unknown'}</span>
        <span>${problem.platform || 'LeetCode'}</span>
      </div>
      <div class="problem-title">${problem.title}</div>
  `;

  if (lastSession) {
    html += `
      <div style="font-size:11px; color:#71717a; margin-bottom:12px; border-top:1px solid #e4e4e7; padding-top:8px;">
        Already in PracticeLab<br/>
        Last Practiced: ${new Date(lastSession.date).toLocaleDateString()}<br/>
        Pattern: <strong>${lastSession.pattern || 'Unspecified'}</strong>
      </div>
    `;
  }

  html += `
      <button id="btnPractice" class="btn btn-primary">
        ${lastSession ? 'Open Practice Session' : 'Begin Practice Session'}
      </button>
  `;

  if (lastSession) {
    html += `
      <button id="btnSimilar" class="btn btn-secondary">
        Practice Similar Problem
      </button>
    `;
  }

  html += `</div>`;

  contentArea.innerHTML = html;

  document.getElementById('btnPractice').addEventListener('click', async () => {
    chrome.storage.local.get(['practicelab_token'], (resToken) => {
      const activeToken = resToken.practicelab_token;
      if (!activeToken) {
        showAuthRequiredState();
        return;
      }

      chrome.runtime.sendMessage({ type: 'ADD_OR_GET_PROBLEM', payload: info }, (res) => {
        if (res && res.isAuthError) {
          showAuthErrorState(res.error);
          return;
        }

        if (res && res.success && res.data && res.data.problem) {
          const probId = res.data.problem._id;
          chrome.tabs.create({ url: `${CLIENT_URL}/practice/${probId}` });
        } else {
          renderError(res?.error || 'Failed to match or create problem in PracticeLab.');
        }
      });
    });
  });

  const btnSimilar = document.getElementById('btnSimilar');
  if (btnSimilar) {
    btnSimilar.addEventListener('click', () => {
      chrome.tabs.create({ url: `${CLIENT_URL}/recommendations` });
    });
  }
}

function showAuthRequiredState() {
  const authStatusElem = document.getElementById('authStatus');
  const loginSection = document.getElementById('loginSection');
  authStatusElem.innerText = 'Sign In';
  authStatusElem.className = 'auth-badge error';
  loginSection.style.display = 'block';

  renderError('Please sign in to PracticeLab above to continue.');
}

function showAuthErrorState(errMsg) {
  const authStatusElem = document.getElementById('authStatus');
  const loginSection = document.getElementById('loginSection');
  authStatusElem.innerText = 'Session Expired';
  authStatusElem.className = 'auth-badge error';
  loginSection.style.display = 'block';

  renderError(`Authentication Error: ${errMsg}`);
}

function renderGenericState() {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = `
    <div class="problem-card" style="text-align:center;">
      <p style="color:#71717a; font-size:12px; margin: 0 0 12px 0;">
        Navigate to a problem on LeetCode, GeeksforGeeks, HackerRank, or Codeforces to auto-detect.
      </p>
      <a href="${CLIENT_URL}/dashboard" target="_blank" class="btn btn-primary">
        Open PracticeLab Dashboard
      </a>
    </div>
  `;
}

function renderError(msg) {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = `
    <div style="color:#dc2626; text-align:center; padding: 12px; font-size: 12px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px;">
      ${msg}
    </div>
  `;
}
