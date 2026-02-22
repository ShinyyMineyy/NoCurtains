// MAKE SURE THIS IS YOUR ABSOLUTE NEWEST DEPLOYMENT LINK
const API_URL = "https://script.google.com/macros/s/AKfycbxXyU9eTzBzrUaoU2jfqusx_HL69u7_BzJsxZ_TUIxTyFxFUhA2i7xMxIaAZ1zqU95r/exec";

let siteData = {
    videos: [],
    pictures: []
};

let currentTab = 'videos';

const gridContainer = document.getElementById('media-grid');
const loadingState = document.getElementById('loading');
const tabButtons = document.querySelectorAll('.tab-btn');

async function fetchDatabase() {
    try {
        // The redirect: "follow" fixes Google's internal API block
        const response = await fetch(API_URL, { redirect: "follow" });
        const data = await response.json();
        
        siteData.videos = data.videos || [];
        siteData.pictures = data.pictures || [];
        
        loadingState.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        
        renderMedia(currentTab);
    } catch (error) {
        loadingState.innerText = "ERROR // CONNECTION SEVERED. CHECK F12 CONSOLE.";
        loadingState.style.color = "#8a0000";
        console.error("Fetch error details:", error);
    }
}

function renderMedia(category) {
    gridContainer.innerHTML = ''; 
    const items = siteData[category];

    if (!items || items.length === 0) {
        gridContainer.innerHTML = '<p style="color: #444; text-align: center; grid-column: 1/-1;">[ NO DATA FOUND IN DIRECTORY ]</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';

        let mediaElement = '';
        
        if (category === 'videos') {
            mediaElement = `
                <video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()">
                    <source src="${item.url}" type="video/mp4">
                </video>`;
        } else {
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

tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = e.target.getAttribute('data-tab');
        renderMedia(currentTab);
    });
});

fetchDatabase();
