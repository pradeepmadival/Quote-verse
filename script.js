// ===== QUOTE DATA (20 quotes total) =====
const quotes = [
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivational" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivational" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "motivational" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "motivational" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "life" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "life" },
    { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw", category: "life" },
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill", category: "success" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "success" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser", category: "success" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "success" },
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "wisdom" },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "wisdom" },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", category: "wisdom" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "happiness" },
    { text: "The most important thing is to enjoy your life.", author: "Audrey Hepburn", category: "happiness" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "inspiration" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan", category: "inspiration" }
];

// Category information
const categories = [
    { name: "motivational", icon: "fa-fire", desc: "Get energized" },
    { name: "life", icon: "fa-heart", desc: "Life wisdom" },
    { name: "success", icon: "fa-trophy", desc: "Achieve greatness" },
    { name: "wisdom", icon: "fa-lightbulb", desc: "Timeless truths" },
    { name: "happiness", icon: "fa-smile", desc: "Find joy" },
    { name: "inspiration", icon: "fa-star", desc: "Get inspired" }
];

// ===== STATE VARIABLES =====
let customQuotes = [];
let currentCategory = 'all';
let isPlaying = true;
let playInterval = null;
let likes = {};

// ===== INITIALIZATION =====
window.onload = function() {
    loadTheme();
    setupCategories();
    showQuoteOfDay();
    showRandomQuote();
    startAutoPlay();
};

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
}

// ===== NAVIGATION =====
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show selected page
    document.getElementById(page).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

// ===== SETUP CATEGORIES =====
function setupCategories() {
    // Render category cards
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = categories.map(cat => `
        <div class="col-md-6 col-lg-4">
            <div class="category-card" onclick="filterCategory('${cat.name}')">
                <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
                <h4>${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</h4>
                <p class="text-muted">${cat.desc}</p>
            </div>
        </div>
    `).join('');
    
    // Add categories to dropdown
    const select = document.getElementById('newCategory');
    select.innerHTML += categories.map(cat => 
        `<option value="${cat.name}">${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</option>`
    ).join('');
}

function filterCategory(category) {
    currentCategory = category;
    showPage('home');
    document.querySelectorAll('.nav-link')[0].classList.add('active');
    showRandomQuote();
}

// ===== QUOTE OF THE DAY =====
function showQuoteOfDay() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('qotdText').textContent = `"${quote.text}"`;
    document.getElementById('qotdAuthor').textContent = `— ${quote.author}`;
}

// ===== DISPLAY QUOTE =====
function showRandomQuote() {
    const allQuotes = [...quotes, ...customQuotes];
    const filtered = currentCategory === 'all' 
        ? allQuotes 
        : allQuotes.filter(q => q.category === currentCategory);
    
    if (filtered.length === 0) return;
    
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById('quoteText').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
    
    // Update like button
    updateLikeButton(quote);
}

// ===== AUTO-PLAY =====
function startAutoPlay() {
    if (playInterval) clearInterval(playInterval);
    playInterval = setInterval(showRandomQuote, 3000);
}

function togglePlay() {
    isPlaying = !isPlaying;
    const icon = document.querySelector('#playBtn i');
    
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        startAutoPlay();
    } else {
        icon.className = 'fas fa-play';
        clearInterval(playInterval);
    }
}

// ===== LIKE SYSTEM =====
function toggleLike() {
    const text = document.getElementById('quoteText').textContent;
    const btn = document.getElementById('likeBtn');
    
    if (likes[text]) {
        likes[text]--;
        if (likes[text] === 0) {
            delete likes[text];
            btn.classList.remove('liked');
        }
    } else {
        likes[text] = 1;
        btn.classList.add('liked');
    }
    
    document.getElementById('likeCount').textContent = likes[text] ? likes[text] : '';
}

function updateLikeButton(quote) {
    const btn = document.getElementById('likeBtn');
    const count = document.getElementById('likeCount');
    const quoteText = `"${quote.text}"`;
    
    if (likes[quoteText]) {
        btn.classList.add('liked');
        count.textContent = likes[quoteText];
    } else {
        btn.classList.remove('liked');
        count.textContent = '';
    }
}

// ===== SHARE =====
function shareQuote() {
    const text = document.getElementById('quoteText').textContent;
    const author = document.getElementById('quoteAuthor').textContent;
    navigator.clipboard.writeText(`${text} ${author}`)
        .then(() => alert('Quote copied to clipboard!'));
}

// ===== ADD QUOTE =====
function addQuote(event) {
    event.preventDefault();
    
    const newQuote = {
        text: document.getElementById('newText').value,
        author: document.getElementById('newAuthor').value,
        category: document.getElementById('newCategory').value
    };
    
    customQuotes.push(newQuote);
    
    // Show success message
    document.getElementById('message').innerHTML = 
        '<div class="alert alert-success">Quote added successfully!</div>';
    
    // Reset form
    event.target.reset();
    
    // Hide message after 3 seconds
    setTimeout(() => document.getElementById('message').innerHTML = '', 3000);
}
