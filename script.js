// ===== CONFIGURATION =====
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_API_URL_HERE'; // Replace with actual API endpoint

// ===== STATE MANAGEMENT =====
let mediaData = {
    videos: [],
    pictures: []
};

// ===== DOM ELEMENTS =====
const elements = {
    loading: document.getElementById('loading'),
    videosGrid: document.getElementById('videos-grid'),
    picturesGrid: document.getElementById('pictures-grid'),
    videosSection: document.getElementById('videos-section'),
    picturesSection: document.getElementById('pictures-section'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    timestamp: document.getElementById('timestamp')
};

// ===== INITIALIZATION =====
async function init() {
    showLoading(true);
    updateTimestamp();
    
    try {
        await fetchMediaData();
        renderMedia();
        setupEventListeners();
    } catch (error) {
        console.error('Initialization failed:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

// ===== API FETCH =====
async function fetchMediaData() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate data structure
        if (data.videos && data.pictures) {
            mediaData = data;
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Failed to fetch media data:', error);
        
        // Fallback to mock data for development/testing
        mediaData = getMockData();
    }
}

// ===== MOCK DATA (for testing without API) =====
function getMockData() {
    return {
        videos: [
            { title: "TAPE_001_BASEMENT", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { title: "TAPE_002_HALLWAY", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { title: "TAPE_003_UNKNOWN", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
        ],
        pictures: [
            { title: "IMG_001_LIMINAL", url: "https://via.placeholder.com/800x450/1a1a1a/ff0033?text=CLASSIFIED" },
            { title: "IMG_002_BACKROOMS", url: "https://via.placeholder.com/800x450/1a1a1a/00ff41?text=RESTRICTED" },
            { title: "IMG_003_VOID", url: "https://via.placeholder.com/800x450/1a1a1a/ffffff?text=REDACTED" }
        ]
    };
}

// ===== RENDER MEDIA =====
function renderMedia() {
    renderVideos();
    renderPictures();
}

function renderVideos() {
    elements.videosGrid.innerHTML = '';
    
    mediaData.videos.forEach((video, index) => {
        const card = createMediaCard('video', video, index);
        elements.videosGrid.appendChild(card);
    });
}

function renderPictures() {
    elements.picturesGrid.innerHTML = '';
    
    mediaData.pictures.forEach((picture, index) => {
        const card = createMediaCard('picture', picture, index);
        elements.picturesGrid.appendChild(card);
    });
}

// ===== CREATE MEDIA CARD =====
function createMediaCard(type, data, index) {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Create media element
    let mediaElement;
    if (type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = data.url;
        mediaElement.muted = true;
        mediaElement.loop = true;
        mediaElement.playsInline = true;
        
        // Video hover controls
        card.addEventListener('mouseenter', () => {
            mediaElement.play().catch(err => console.log('Video play failed:', err));
        });
        
        card.addEventListener('mouseleave', () => {
            mediaElement.pause();
            mediaElement.currentTime = 0;
        });
    } else {
        mediaElement = document.createElement('img');
        mediaElement.src = data.url;
        mediaElement.alt = data.title;
        mediaElement.loading = 'lazy';
    }
    
    // Create title overlay
    const title = document.createElement('div');
    title.className = 'media-title';
    title.textContent = data.title;
    
    // Append elements
    card.appendChild(mediaElement);
    card.appendChild(title);
    
    // Add 3D parallax effect
    add3DParallax(card);
    
    return card;
}

// ===== 3D PARALLAX HOVER EFFECT =====
function add3DParallax(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10; // Max 10deg tilt
        const rotateY = (x - centerX) / centerX * 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
    });
}

// ===== TAB SWITCHING =====
function setupEventListeners() {
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Update button states
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Update section visibility
    if (tab === 'videos') {
        elements.videosSection.classList.add('active');
        elements.picturesSection.classList.remove('active');
    } else {
        elements.picturesSection.classList.add('active');
        elements.videosSection.classList.remove('active');
    }
}

// ===== UTILITY FUNCTIONS =====
function showLoading(show) {
    elements.loading.classList.toggle('active', show);
}

function showError() {
    elements.videosGrid.innerHTML = '<p style="text-align: center; color: var(--accent-red); padding: 2rem;">ERROR: FAILED TO RETRIEVE FILES</p>';
}

function updateTimestamp() {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    elements.timestamp.textContent = `TIMESTAMP: ${formatted} UTC`;
    
    // Update every second
    setInterval(() => {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
        elements.timestamp.textContent = `TIMESTAMP: ${formatted} UTC`;
    }, 1000);
}

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', init);
