// SpaceX Launch Tracker Extension
// Endpoint: LaunchLibrary v2.3.0 Production API
const API_URL = 'https://ll.thespacedevs.com/2.3.0/launches/upcoming/?lsp__id=121&limit=7';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Storage helper to seamlessly support Chrome Storage in Extension
// and localStorage in standard browser environments for testing/dev
const db = {
  get: (keys) => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(keys, resolve);
      } else {
        const result = {};
        const keysArr = Array.isArray(keys) ? keys : [keys];
        keysArr.forEach(key => {
          const val = localStorage.getItem(key);
          result[key] = val ? JSON.parse(val) : null;
        });
        resolve(result);
      }
    });
  },
  set: (items) => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set(items, resolve);
      } else {
        Object.entries(items).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        resolve();
      }
    });
  }
};

// DOM Elements
const loader = document.getElementById('loader');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const dashboard = document.getElementById('dashboard');
const cacheBanner = document.getElementById('cache-banner');
const cacheTimeText = document.getElementById('cache-time');
const refreshBtn = document.getElementById('refresh-btn');

// Featured Launch elements
const nextMissionName = document.getElementById('next-mission-name');
const nextRocketName = document.getElementById('next-rocket-name');
const nextLaunchPad = document.getElementById('next-launch-pad');
const nextLaunchDate = document.getElementById('next-launch-date');
const nextLaunchStatus = document.getElementById('next-launch-status');

// Countdown digits
const dDays = document.getElementById('countdown-days');
const dHours = document.getElementById('countdown-hours');
const dMins = document.getElementById('countdown-minutes');
const dSecs = document.getElementById('countdown-seconds');

// List containers
const upcomingList = document.getElementById('upcoming-list');
const inProgressToggle = document.getElementById('in-progress-toggle');
const inProgressList = document.getElementById('in-progress-list');
const inProgressTitleText = document.getElementById('in-progress-title-text');

// State
let countdownInterval = null;

// Status Mapping & Helpers
const IN_PROGRESS_COMPLETED_IDS = [6, 9, 3, 4, 7];

function getStatusCategory(statusId) {
  if ([1, 3, 6, 9].includes(statusId)) {
    return 'positive';
  } else if ([2, 5, 8].includes(statusId)) {
    return 'intermediate';
  } else if ([4, 7].includes(statusId)) {
    return 'negative';
  }
  return 'intermediate';
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  refreshBtn.addEventListener('click', () => {
    // Rotating effect on click
    refreshBtn.classList.add('loading');
    loadFreshData();
  });

  retryBtn.addEventListener('click', () => {
    loadFreshData();
  });

  // Toggle in-progress/completed list
  inProgressToggle.addEventListener('click', () => {
    const isExpanded = inProgressToggle.getAttribute('aria-expanded') === 'true';
    inProgressToggle.setAttribute('aria-expanded', !isExpanded);
    inProgressList.classList.toggle('collapsed');
  });
});

/**
 * Initializes app, checking cache freshness first.
 */
async function initApp() {
  showLoader();
  try {
    const cached = await db.get(['launchData', 'lastFetchTime']);
    const now = Date.now();

    if (cached.launchData && cached.lastFetchTime && (now - cached.lastFetchTime < CACHE_TTL)) {
      // Serve fresh cache
      console.log('Serving from fresh cache...');
      renderDashboard(cached.launchData, false);
    } else {
      // Cache expired or empty, fetch new data
      console.log('Cache expired or empty. Fetching live telemetry...');
      await loadFreshData();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    showError('An error occurred during app startup.');
  }
}

/**
 * Force load from API, with fallback to old cache if network/API fails.
 */
async function loadFreshData() {
  showLoader();
  try {
    const response = await fetch(API_URL);
    
    if (response.status === 200) {
      const data = await response.json();
      
      if (data && data.results && data.results.length > 0) {
        // Save to cache
        const fetchTime = Date.now();
        await db.set({ launchData: data, lastFetchTime: fetchTime });
        renderDashboard(data, false);
      } else {
        throw new Error('API returned empty or invalid results.');
      }
    } else if (response.status === 429) {
      throw new Error('API rate limit reached (HTTP 429).');
    } else {
      throw new Error(`Server returned code ${response.status}`);
    }
  } catch (error) {
    console.warn('Network fetch failed. Checking cache fallback...', error);
    
    // Attempt cache fallback
    const cached = await db.get(['launchData', 'lastFetchTime']);
    if (cached.launchData) {
      renderDashboard(cached.launchData, true, cached.lastFetchTime);
    } else {
      // No cache available at all, show error state
      showError(error.message || 'Unable to connect to the SpaceDevs servers.');
    }
  } finally {
    // Reset rotation animation
    refreshBtn.classList.remove('loading');
  }
}

/**
 * Populates dashboard details.
 * @param {Object} data API response payload
 * @param {Boolean} isCached True if rendering fallback cached data
 * @param {Number} cacheTimestamp Timestamp when cache was originally fetched
 */
function renderDashboard(data, isCached, cacheTimestamp) {
  const launches = data.results;

  // Partition the launches list
  const inProgressCompleted = launches.filter(launch => IN_PROGRESS_COMPLETED_IDS.includes(launch.status?.id));
  const upcoming = launches.filter(launch => !IN_PROGRESS_COMPLETED_IDS.includes(launch.status?.id));

  // Handle banner for cached fallback
  if (isCached && cacheTimestamp) {
    const cacheAgeMinutes = Math.round((Date.now() - cacheTimestamp) / 60000);
    cacheTimeText.textContent = `Last synchronized ${cacheAgeMinutes} min${cacheAgeMinutes === 1 ? '' : 's'} ago due to API rate limit.`;
    cacheBanner.classList.remove('hidden');
  } else {
    cacheBanner.classList.add('hidden');
  }

  // Render inProgressCompleted section
  renderInProgressCompletedList(inProgressCompleted);

  const primaryLaunch = upcoming[0];
  const secondaryLaunches = upcoming.slice(1);

  if (primaryLaunch) {
    document.querySelector('.hero-section').classList.remove('hidden');
    // Parse & render next main launch
    const missionText = primaryLaunch.name;
    nextMissionName.textContent = cleanMissionName(missionText);

    // Rocket
    nextRocketName.textContent = primaryLaunch.rocket?.configuration?.full_name || 
                                primaryLaunch.rocket?.configuration?.name || 
                                'Falcon 9';

    // Pad
    const padName = primaryLaunch.pad?.name || 'Unknown Pad';
    const padLocation = primaryLaunch.pad?.location?.name || 'Unknown Location';
    nextLaunchPad.textContent = `${padName}, ${padLocation}`;

    // Localized Date & Time string
    const netDate = new Date(primaryLaunch.net);
    nextLaunchDate.textContent = formatFullDate(netDate);

    // Status badge
    if (primaryLaunch.status && primaryLaunch.status.name) {
      nextLaunchStatus.textContent = primaryLaunch.status.name;
      const category = getStatusCategory(primaryLaunch.status.id);
      nextLaunchStatus.className = `status-badge status-${category}`;
      nextLaunchStatus.classList.remove('hidden');
    } else {
      nextLaunchStatus.classList.add('hidden');
    }

    // Initialize and run countdown
    startCountdown(primaryLaunch.net);
  } else {
    // No upcoming launch to feature
    document.querySelector('.hero-section').classList.add('hidden');
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  }

  // Render secondary launches list
  renderUpcomingList(secondaryLaunches);

  showDashboard();
}

/**
 * Renders in-progress and completed launches list.
 */
function renderInProgressCompletedList(launches) {
  // Update section title count
  if (launches.length > 0) {
    inProgressTitleText.textContent = `LAUNCHES IN PROGRESS/COMPLETED (${launches.length})`;
  } else {
    inProgressTitleText.textContent = 'LAUNCHES IN PROGRESS/COMPLETED';
  }

  // Clear previous items
  inProgressList.innerHTML = '';

  if (launches.length === 0) {
    // Show empty state message
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state-message';
    emptyState.textContent = 'No launches in progress or completed in the past 24 hours';
    inProgressList.appendChild(emptyState);
  } else {
    // Render items
    launches.forEach(launch => {
      const item = document.createElement('div');
      item.className = 'list-item';

      const missionText = cleanMissionName(launch.name);
      const rocketText = launch.rocket?.configuration?.full_name || 
                         launch.rocket?.configuration?.name || 
                         'Falcon 9';

      const netDate = new Date(launch.net);
      const formattedDate = netDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedTime = netDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      const statusAbbrev = launch.status?.abbrev || 'TBD';
      const statusCategory = getStatusCategory(launch.status?.id);

      item.innerHTML = `
        <div class="item-left">
          <span class="item-mission" title="${missionText}">${missionText}</span>
          <div class="item-subrow">
            <span class="item-rocket">${rocketText}</span>
            <span class="status-dot-badge status-${statusCategory}">${statusAbbrev}</span>
          </div>
        </div>
        <div class="item-right">
          <span class="item-date">${formattedDate}</span>
          <span class="item-time">${formattedTime}</span>
        </div>
      `;

      inProgressList.appendChild(item);
    });
  }
}

/**
 * Starts countdown intervals.
 */
function startCountdown(netTimeStr) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  const targetTime = new Date(netTimeStr).getTime();

  function updateTicker() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      dDays.textContent = '00';
      dHours.textContent = '00';
      dMins.textContent = '00';
      dSecs.textContent = '00';
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    dDays.textContent = String(days).padStart(2, '0');
    dHours.textContent = String(hours).padStart(2, '0');
    dMins.textContent = String(minutes).padStart(2, '0');
    dSecs.textContent = String(seconds).padStart(2, '0');
  }

  // Update immediately, then start interval
  updateTicker();
  countdownInterval = setInterval(updateTicker, 1000);
}

/**
 * Renders the compact cards list for future launches.
 */
function renderUpcomingList(launches) {
  upcomingList.innerHTML = '';

  launches.forEach(launch => {
    const item = document.createElement('div');
    item.className = 'list-item';

    const missionText = cleanMissionName(launch.name);
    const rocketText = launch.rocket?.configuration?.full_name || 
                       launch.rocket?.configuration?.name || 
                       'Falcon 9';

    const netDate = new Date(launch.net);
    const formattedDate = netDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedTime = netDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const statusAbbrev = launch.status?.abbrev || 'TBD';
    const statusCategory = getStatusCategory(launch.status?.id);

    item.innerHTML = `
      <div class="item-left">
        <span class="item-mission" title="${missionText}">${missionText}</span>
        <div class="item-subrow">
          <span class="item-rocket">${rocketText}</span>
          <span class="status-dot-badge status-${statusCategory}">${statusAbbrev}</span>
        </div>
      </div>
      <div class="item-right">
        <span class="item-date">${formattedDate}</span>
        <span class="item-time">${formattedTime}</span>
      </div>
    `;

    upcomingList.appendChild(item);
  });
}

// Helpers
function cleanMissionName(fullName) {
  if (fullName.includes('|')) {
    return fullName.split('|')[1].trim();
  }
  return fullName;
}

function formatFullDate(date) {
  try {
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
    return `${formattedDate} at ${formattedTime}`;
  } catch (e) {
    return date.toString();
  }
}

function showLoader() {
  loader.classList.remove('hidden');
  errorContainer.classList.add('hidden');
  dashboard.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  loader.classList.add('hidden');
  errorContainer.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function showDashboard() {
  loader.classList.add('hidden');
  errorContainer.classList.add('hidden');
  dashboard.classList.remove('hidden');
}
