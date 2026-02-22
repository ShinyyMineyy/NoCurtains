const API_URL = "https://script.google.com/macros/s/AKfycbzPSNptTbnu5dVRuyyuuQyt_uvGQ3lAjGhoHYWXMa-43FQPk74us2v6E4v26lL4D8Xt/exec";

let siteData = { videos: [], pictures: [] };
let currentTab = 'videos';

const gridContainer = document.getElementById('media-grid');
const loadingState = document.getElementById('loading');
const tabButtons = document.querySelectorAll('.tab-btn');

async function fetchDatabase() {
    try {
        // App Script redirects JSON requests, 'follow' ensures the browser doesn't drop it
        const response = await fetch(API_URL, { 
            method: 'GET',
            redirect: "follow" 
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        siteData.videos = data.videos || [];
        siteData.pictures = data.pictures || [];
        
        loadingState.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        
        renderMedia(currentTab);
    } catch (error) {
        loadingState.innerText = "ERROR // CONNECTION SEVERED";
        loadingState.style.color = "#8a0000";
        console.error("Fetch failed:", error);
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

        let mediaElement = category === 'videos' 
            ? `<video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()"><source src="${item.url}" type="video/mp4"></video>`
            : `<img src="${item.url}" alt="${item.title}" loading="lazy">`;

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
