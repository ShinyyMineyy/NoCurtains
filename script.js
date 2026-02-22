// The exact deployment link you provided
const API_URL = "https://script.google.com/macros/s/AKfycbwtaFW_1JwEU2rco-sQvmJBwoGufI_sk9W_iCh7XjBddQG1kYXB7j7YU5GNYBROoWYh/exec";

let siteData = {
    videos: [],
    pictures: []
};

let currentTab = 'videos'; // Default tab

// DOM Elements
const gridContainer = document.getElementById('media-grid');
const loadingState = document.getElementById('loading');
const tabButtons = document.querySelectorAll('.tab-btn');

// Initialize the database connection
async function fetchDatabase() {
    try {
        const response = await fetch(API_URL, { redirect: "follow" });
        const data = await response.json();
        
        siteData.videos = data.videos || [];
        siteData.pictures = data.pictures || [];
        
        loadingState.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        
        renderMedia(currentTab);
    } catch (error) {
        loadingState.innerText = "ERROR // CONNECTION SEVERED";
        loadingState.style.color = "#8a0000";
        console.error("Fetch error:", error);
    }
}

// Render the grid based on the selected category
function renderMedia(category) {
    gridContainer.innerHTML = ''; // Clear current grid
    const items = siteData[category];

    if (items.length === 0) {
        gridContainer.innerHTML = '<p style="color: #444; text-align: center; grid-column: 1/-1;">[ NO DATA FOUND IN DIRECTORY ]</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';

        let mediaElement = '';
        
        if (category === 'videos') {
            // Muted, plays only on hover
            mediaElement = `
                <video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()">
                    <source src="${item.url}" type="video/mp4">
                </video>`;
        } else {
            // Static image
            mediaElement = `<img src="${item.url}" alt="${item.title}" loading="lazy">`;
        }

        card.innerHTML = `
            ${mediaElement}
            <div class="media-info">
                <span class="media-title">${item.title}</span>
                <span class="media-meta">FILE_ID: ${Math.floor(Math.random() * 90000) + 10000}</span>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
}

// Tab Switching Logic
tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Update active class
        tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Switch tab and render
        currentTab = e.target.getAttribute('data-tab');
        renderMedia(currentTab);
    });
});

// Boot up sequence
fetchDatabase();
