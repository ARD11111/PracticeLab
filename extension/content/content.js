/**
 * PracticeLab Chrome Extension Content Script
 * Platform-specific problem detection for LeetCode, GeeksforGeeks, HackerRank, Codeforces.
 */

function cleanTitleString(rawTitle) {
  if (!rawTitle) return '';
  let cleaned = rawTitle.trim();

  // Strip problem numbers/indices like "1. Two Sum" -> "Two Sum", "A. Watermelon" -> "Watermelon"
  cleaned = cleaned.replace(/^\d+\.\s*/, '');
  cleaned = cleaned.replace(/^[0-9]*[A-Z]\d*\.\s*/, '');

  // Strip page title suffixes like "Two Sum - LeetCode"
  cleaned = cleaned.replace(/\s*-\s*LeetCode.*/i, '');
  cleaned = cleaned.replace(/\s*\|\s*Practice.*/i, '');
  cleaned = cleaned.replace(/\s*\|\s*GeeksforGeeks.*/i, '');
  cleaned = cleaned.replace(/\s*\|\s*HackerRank.*/i, '');
  cleaned = cleaned.replace(/\s*-\s*Codeforces.*/i, '');

  return cleaned.trim();
}

function isValidProblemTitle(title) {
  if (!title || typeof title !== 'string') return false;
  const trimmed = title.trim();
  if (trimmed.length < 2 || trimmed.length > 120) return false;

  const lower = trimmed.toLowerCase();
  const invalidExact = [
    'leetcode', 'geeksforgeeks', 'hackerrank', 'codeforces',
    'problem', 'problems', 'challenge', 'challenges',
    'profile', 'explore', 'contest', 'discuss', 'user',
    'dashboard', 'settings', 'home', 'login', 'register',
    'a_d_i_t_i'
  ];

  if (invalidExact.includes(lower)) return false;
  if (lower.startsWith('http://') || lower.startsWith('https://')) return false;

  return true;
}

function slugToTitle(slug) {
  if (!slug) return '';
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {}

  return slug
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

function normalizeDifficulty(diffStr) {
  if (!diffStr || typeof diffStr !== 'string') return null;
  const upper = diffStr.toUpperCase();
  if (upper.includes('EASY') || upper.includes('SCHOOL') || upper.includes('BASIC')) return 'Easy';
  if (upper.includes('MEDIUM')) return 'Medium';
  if (upper.includes('HARD')) return 'Hard';
  return null;
}

function extractProblemMetadata() {
  const url = window.location.href;
  const host = window.location.hostname;
  const pathname = window.location.pathname;

  let platform = '';
  let title = '';
  let difficulty = null;
  let isProblemPage = false;

  const diagnostics = {
    platform: '',
    url,
    candidateTitles: [],
    candidateDifficulties: [],
    selectedTitle: '',
    selectedDifficulty: ''
  };

  // -----------------------------------------------------------------
  // 1. LEETCODE
  // -----------------------------------------------------------------
  if (host.includes('leetcode.com')) {
    platform = 'LeetCode';
    diagnostics.platform = platform;
    const match = pathname.match(/\/problems\/([^\/]+)/);

    // Exclude listing/profile/category pages
    if (match && match[1] && !['all', 'algorithm', 'database', 'shell', 'concurrency'].includes(match[1].toLowerCase())) {
      isProblemPage = true;
      const slug = match[1];

      // Title Candidates
      // Candidate 1: Scoped description container link/header (avoiding top navbar username links)
      const scopedTitleElem = document.querySelector(
        '#qd-content a[href^="/problems/"], [data-track-load="description_content"] a[href^="/problems/"], div.flex-1 a[href^="/problems/"]'
      );
      if (scopedTitleElem && scopedTitleElem.innerText) {
        diagnostics.candidateTitles.push(`Scoped DOM: "${scopedTitleElem.innerText}"`);
        const cleaned = cleanTitleString(scopedTitleElem.innerText);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      // Candidate 2: document.title
      if (!title && document.title) {
        diagnostics.candidateTitles.push(`doc.title: "${document.title}"`);
        const cleaned = cleanTitleString(document.title);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      // Candidate 3: og:title meta tag
      if (!title) {
        const metaTitle = document.querySelector('meta[property="og:title"]')?.content;
        if (metaTitle) {
          diagnostics.candidateTitles.push(`og:title: "${metaTitle}"`);
          const cleaned = cleanTitleString(metaTitle);
          if (isValidProblemTitle(cleaned)) {
            title = cleaned;
          }
        }
      }

      // Candidate 4: URL Slug Fallback
      if (!title) {
        const slugTitle = slugToTitle(slug);
        diagnostics.candidateTitles.push(`Slug fallback: "${slugTitle}"`);
        if (isValidProblemTitle(slugTitle)) {
          title = slugTitle;
        }
      }

      // Difficulty Candidates (Scoped to description pane)
      const scopedDiffElem = document.querySelector(
        '#qd-content [class*="text-difficulty-"], #qd-content [class*="text-sd-"], [data-track-load="description_content"] [class*="text-difficulty-"]'
      );
      if (scopedDiffElem && scopedDiffElem.innerText) {
        diagnostics.candidateDifficulties.push(`Scoped diff: "${scopedDiffElem.innerText}"`);
        difficulty = normalizeDifficulty(scopedDiffElem.innerText);
      }

      if (!difficulty) {
        const globalDiff = document.querySelector('[class*="text-difficulty-"], [class*="text-sd-"]');
        if (globalDiff && globalDiff.innerText) {
          diagnostics.candidateDifficulties.push(`Global diff: "${globalDiff.innerText}"`);
          difficulty = normalizeDifficulty(globalDiff.innerText);
        }
      }
    }
  }

  // -----------------------------------------------------------------
  // 2. GEEKSFORGEEKS
  // -----------------------------------------------------------------
  else if (host.includes('geeksforgeeks.org')) {
    platform = 'GeeksforGeeks';
    diagnostics.platform = platform;
    const match = pathname.match(/\/problems\/([^\/]+)/);

    if (match && match[1] && match[1] !== 'explore' && match[1] !== 'all') {
      isProblemPage = true;
      const slug = match[1].replace(/\d+$/, '').replace(/-$/, '');

      // Title Candidates
      const gfgTitleElem = document.querySelector(
        '#scrollableDiv .problems_header_content__title, .problems_header_content__title, .problems_left_section__content h3, .problem-title'
      );
      if (gfgTitleElem && gfgTitleElem.innerText) {
        diagnostics.candidateTitles.push(`GFG DOM: "${gfgTitleElem.innerText}"`);
        const cleaned = cleanTitleString(gfgTitleElem.innerText);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      if (!title && document.title) {
        diagnostics.candidateTitles.push(`doc.title: "${document.title}"`);
        const cleaned = cleanTitleString(document.title);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      if (!title) {
        const slugTitle = slugToTitle(slug);
        diagnostics.candidateTitles.push(`Slug fallback: "${slugTitle}"`);
        if (isValidProblemTitle(slugTitle)) {
          title = slugTitle;
        }
      }

      // Difficulty Candidates (Strictly scoped inside #scrollableDiv to avoid sidebar filter buttons)
      const diffContainer = Array.from(document.querySelectorAll('#scrollableDiv *, .problems_header_content *'))
        .find(el => el.children.length === 0 && el.innerText && el.innerText.trim().startsWith('Difficulty:'));
      
      if (diffContainer) {
        diagnostics.candidateDifficulties.push(`GFG label diff: "${diffContainer.innerText}"`);
        difficulty = normalizeDifficulty(diffContainer.innerText.replace('Difficulty:', ''));
      }

      if (!difficulty) {
        const keywordElem = document.querySelector('.problems_header_content__keyword__2Gg0, div[class*="problems_header_content__keyword"]');
        if (keywordElem && keywordElem.innerText) {
          diagnostics.candidateDifficulties.push(`GFG keyword diff: "${keywordElem.innerText}"`);
          difficulty = normalizeDifficulty(keywordElem.innerText);
        }
      }
    }
  }

  // -----------------------------------------------------------------
  // 3. HACKERRANK
  // -----------------------------------------------------------------
  else if (host.includes('hackerrank.com')) {
    platform = 'HackerRank';
    diagnostics.platform = platform;
    const match = pathname.match(/\/challenges\/([^\/]+)/);

    // Must be a specific challenge page, not the /challenges index list
    if (match && match[1] && match[1] !== 'challenges') {
      isProblemPage = true;
      const slug = match[1];

      // Title Candidates
      const hrTitleElem = document.querySelector(
        'h1.ui-icon-label-page-title, .challenge-header h1, h1.page-title, .challenge-title, h1'
      );
      if (hrTitleElem && hrTitleElem.innerText) {
        diagnostics.candidateTitles.push(`HR DOM: "${hrTitleElem.innerText}"`);
        const cleaned = cleanTitleString(hrTitleElem.innerText);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      if (!title && document.title) {
        diagnostics.candidateTitles.push(`doc.title: "${document.title}"`);
        const cleaned = cleanTitleString(document.title);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      if (!title) {
        const slugTitle = slugToTitle(slug);
        diagnostics.candidateTitles.push(`Slug fallback: "${slugTitle}"`);
        if (isValidProblemTitle(slugTitle)) {
          title = slugTitle;
        }
      }

      // Difficulty Candidates (Sidebar metadata panel)
      const hrDiffElem = document.querySelector('.difficulty-feature div, .challenge-difficulty, .sidebar-item-text');
      if (hrDiffElem && hrDiffElem.innerText) {
        diagnostics.candidateDifficulties.push(`HR diff elem: "${hrDiffElem.innerText}"`);
        difficulty = normalizeDifficulty(hrDiffElem.innerText);
      }

      if (!difficulty) {
        const sidebarText = Array.from(document.querySelectorAll('.challenge-meta-item, .sidebar-item'))
          .find(el => el.innerText && el.innerText.includes('Difficulty'));
        if (sidebarText) {
          diagnostics.candidateDifficulties.push(`HR sidebar text: "${sidebarText.innerText}"`);
          difficulty = normalizeDifficulty(sidebarText.innerText);
        }
      }
    }
  }

  // -----------------------------------------------------------------
  // 4. CODEFORCES
  // -----------------------------------------------------------------
  else if (host.includes('codeforces.com')) {
    platform = 'Codeforces';
    diagnostics.platform = platform;
    const isCFProblem = pathname.includes('/problemset/problem/') || (pathname.includes('/contest/') && pathname.includes('/problem/'));

    if (isCFProblem) {
      isProblemPage = true;

      // Title Candidates
      const cfTitleElem = document.querySelector('.problem-statement .header .title, .problem-statement .title');
      if (cfTitleElem && cfTitleElem.innerText) {
        diagnostics.candidateTitles.push(`CF DOM: "${cfTitleElem.innerText}"`);
        const cleaned = cleanTitleString(cfTitleElem.innerText);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      if (!title && document.title) {
        diagnostics.candidateTitles.push(`doc.title: "${document.title}"`);
        const cleaned = cleanTitleString(document.title);
        if (isValidProblemTitle(cleaned)) {
          title = cleaned;
        }
      }

      // Difficulty Candidates (Rating tag e.g. *800, *1400)
      const tagBoxes = document.querySelectorAll('span.tag-box, .tag-box');
      tagBoxes.forEach(box => {
        const txt = box.innerText.trim();
        if (txt.startsWith('*')) {
          const rating = parseInt(txt.slice(1), 10);
          if (!isNaN(rating)) {
            diagnostics.candidateDifficulties.push(`CF Rating: ${rating}`);
            if (rating < 1300) difficulty = 'Easy';
            else if (rating > 1900) difficulty = 'Hard';
            else difficulty = 'Medium';
          }
        }
      });
    }
  }

  if (!isProblemPage || !isValidProblemTitle(title)) {
    console.log('[PracticeLab Extension] Non-problem or unsupported page:', url);
    return null;
  }

  const cleanUrl = url.split('?')[0].replace(/\/$/, '');

  diagnostics.selectedTitle = title;
  diagnostics.selectedDifficulty = difficulty;

  console.log('[PracticeLab Extension] Extracted Metadata:', diagnostics);

  return {
    url: cleanUrl,
    platform,
    title,
    difficulty: difficulty || 'Unknown'
  };
}

// Listen for messages from popup or background worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXTRACT_PROBLEM_INFO') {
    const info = extractProblemMetadata();
    sendResponse(info);
  }
  return true;
});
