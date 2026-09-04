/**
 * ChillVibe Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initAgeGate();
    if (document.getElementById('story-grid')) {
        renderStories();
    }
});

// Age Gate Logic (UX Only, not secure verification)
function initAgeGate() {
    const ageGate = document.getElementById('age-gate');
    if (!ageGate) return;

    const isVerified = localStorage.getItem('chillvibe_18_verified');
    
    if (!isVerified) {
        ageGate.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        ageGate.classList.add('hidden');
    }

    const btnEnter = document.getElementById('btn-enter');
    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            localStorage.setItem('chillvibe_18_verified', 'true');
            ageGate.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
}

// Global function to create a story card element
window.createStoryCard = function(story) {
    const card = document.createElement('article');
    card.className = 'story-card';
    
    const imageHTML = story.coverImage 
        ? `<img src="${story.coverImage}" alt="Cover" class="card-img" loading="lazy">` 
        : `<div class="card-img" style="background:#1d1d26; display:flex; align-items:center; justify-content:center; color:#a1a1aa;">No Cover</div>`;

    card.innerHTML = `
        ${imageHTML}
        <div class="card-content">
            <span class="category-tag">${story.category}</span>
            <h3 class="card-title font-serif">
                <a href="story.html?id=${story.id}">${story.title}</a>
            </h3>
            <p class="card-excerpt">${story.excerpt}</p>
            <div class="card-meta">
                <span>By ${story.author}</span>
                <span>${story.readingTime}</span>
            </div>
        </div>
    `;
    return card;
};

// Render stories to homepage grid
function renderStories() {
    const grid = document.getElementById('story-grid');
    if (!grid) return;

    const approvedStories = chillVibeData.stories
        .filter(s => s.status === 'approved')
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); // Newest first

    if (approvedStories.length === 0) {
        grid.innerHTML = `<p class="text-muted col-span-full">No stories published yet. Be the first to submit!</p>`;
        return;
    }

    approvedStories.forEach(story => {
        grid.appendChild(window.createStoryCard(story));
    });
}
