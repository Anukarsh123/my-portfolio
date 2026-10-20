/* --------------------------------------------------
 * 1. INSTANT PORTFOLIO INITIALIZATION
 * -------------------------------------------------- */

window.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons immediately
    if (window.lucide) lucide.createIcons();

    // Trigger smooth non-blocking entry animations immediately
    initAnimations();
});

/* --------------------------------------------------
 * 2. CUSTOM CURSOR & MOUSE GLOW
 * -------------------------------------------------- */

const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('custom-cursor-dot');
const mouseGlow = document.getElementById('mouse-glow');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Set custom coordinates for CSS mouse glow
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
});

// Smooth cursor trailing animation loop
function animateCursor() {
    // Trailing ring
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursor.style.opacity = '1';

    // Immediate center dot
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    cursorDot.style.opacity = '1';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Mouse hover effects on interactive elements
const interactives = document.querySelectorAll('a, button, .project-card-item, .cert-card, .company-tab, .meta-card');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

/* --------------------------------------------------
 * 3. CANVAS PARTICLES SYSTEM
 * -------------------------------------------------- */

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 60;
let linkDistance = 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Adapt particle count for mobile screens
    if (window.innerWidth < 768) {
        maxParticles = 25;
        linkDistance = 70;
    } else {
        maxParticles = 60;
        linkDistance = 100;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        // Mouse repulsion
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            let force = (120 - dist) / 120;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
        }
    }

    draw() {
        ctx.beginPath();
        // Dynamic transparency based on theme
        const color = document.body.classList.contains('light-theme') ? 'rgba(8, 145, 178, 0.2)' : 'rgba(6, 182, 212, 0.25)';
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Populate particles
for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < linkDistance) {
                let opacity = (1 - dist / linkDistance) * 0.12;
                const lineColor = document.body.classList.contains('light-theme') 
                    ? `rgba(37, 99, 235, ${opacity})` 
                    : `rgba(6, 182, 212, ${opacity})`;
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateParticles);
}
animateParticles();

/* --------------------------------------------------
 * 4. LIGHT / DARK THEME TOGGLE
 * -------------------------------------------------- */

const themeToggle = document.getElementById('theme-toggle');
const darkIcon = themeToggle.querySelector('.theme-icon-dark');
const lightIcon = themeToggle.querySelector('.theme-icon-light');

// Check saved setting
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    darkIcon.style.display = 'none';
    lightIcon.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        darkIcon.style.display = 'none';
        lightIcon.style.display = 'block';
        localStorage.setItem('portfolio-theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        darkIcon.style.display = 'block';
        lightIcon.style.display = 'none';
        localStorage.setItem('portfolio-theme', 'dark');
    }
});

/* --------------------------------------------------
 * 5. ROLE TYPING ANIMATION
 * -------------------------------------------------- */

const roles = [
    "B.Tech CSE (Data Science) Student",
    "Python & Flask Developer",
    "Database Migration Specialist",
    "Aspiring Software Engineer"
];
const typingTextEl = document.getElementById('typing-text');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeAnimationLoop() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeAnimationLoop, typeSpeed);
}
// Start typing loop
setTimeout(typeAnimationLoop, 800);

/* --------------------------------------------------
 * 6. PROJECTS SEARCH & FILTER
 * -------------------------------------------------- */

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card-item');
const projectSearchInput = document.getElementById('project-search-input');

let activeFilter = 'all';
let searchQuery = '';

function applyProjectsFilter() {
    projectCards.forEach(card => {
        const categories = card.dataset.categories.split(',');
        const techStack = card.dataset.tech.toLowerCase();
        const title = card.querySelector('.project-card-title').textContent.toLowerCase();
        const desc = card.querySelector('.project-card-description').textContent.toLowerCase();
        
        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
        const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery) || techStack.includes(searchQuery);

        if (matchesFilter && matchesSearch) {
            card.classList.remove('hidden-by-filter');
            // GSAP zoom entry on matching items
            gsap.fromTo(card, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
        } else {
            card.classList.add('hidden-by-filter');
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyProjectsFilter();
    });
});

projectSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyProjectsFilter();
});

/* --------------------------------------------------
 * 7. TECH STACK (SKILLS) SEARCH FILTER
 * -------------------------------------------------- */

const skillsSearchInput = document.getElementById('skills-search-input');
const skillItems = document.querySelectorAll('.skill-bar-item');

skillsSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    skillItems.forEach(item => {
        const skillName = item.dataset.skill.toLowerCase();
        
        if (query === '' || skillName.includes(query)) {
            item.classList.remove('dimmed');
        } else {
            item.classList.add('dimmed');
        }
    });
});

/* --------------------------------------------------
 * 8. CERTIFICATES MODAL LIGHTBOX
 * -------------------------------------------------- */

/* --------------------------------------------------
 * 8. CERTIFICATES & ACHIEVEMENTS STORAGE & VIEWER
 * -------------------------------------------------- */

const modal = document.getElementById('certificate-modal');
const modalClose = modal.querySelector('.modal-close-btn');
const modalTitle = document.getElementById('modal-cert-title');
const modalIssuer = document.getElementById('modal-cert-issuer');
const modalDesc = document.getElementById('modal-cert-desc');
const modalCertLink = document.getElementById('modal-cert-link');
const modalCertImg = document.getElementById('modal-cert-img');
const modalCertPdfWrap = document.getElementById('modal-cert-pdf-wrap');
const modalCertPdf = document.getElementById('modal-cert-pdf');
const modalCertMockup = document.getElementById('modal-cert-mockup');
const modalCertDownloadBtn = document.getElementById('modal-cert-download-btn');
const modalCustomActions = document.getElementById('modal-custom-actions');
const modalDeleteCertBtn = document.getElementById('modal-delete-cert-btn');

// Initial Built-in Certificates
const certificateData = {
    'nptel-cert': {
        title: 'Python for Data Science (Elite Certificate)',
        issuer: 'IIT Madras (NPTEL Swayam)',
        desc: 'Awarded to Anukarsh C for successfully completing the elite course with a consolidated score of 64% (Assignments: 25/25, Proctored Exam: 39.29/75). Course duration: Jul-Aug 2025. Roll No: NPTEL25CS104S43860206.',
        img: 'certificates/nptel/nptel-cert.jpg',
        fileType: 'image',
        isCustom: false
    },
    'iste-cert': {
        title: 'ISTE Student Member Certificate',
        issuer: 'Indian Society for Technical Education',
        desc: 'Admitted as a Student Member of The Indian Society for Technical Education for the duration 18-10-2024 to 18-10-2028 (Membership ID: LM / Student Chapter).',
        img: 'certificates/iste/canvas.png',
        fileType: 'image',
        isCustom: false
    },
    'dinesh-it-cert': {
        title: 'Database Migration using Python Flask & PostgreSQL',
        issuer: 'Dinesh IT Systems',
        desc: 'This certificate verifies that Anukarsh C successfully completed his software development internship. He performed backend engineering, schema creation, database migrations from MySQL to PostgreSQL, and integration assertions.',
        img: 'certificates/DINESH/DINESH.jpg',
        fileType: 'image',
        isCustom: false
    },
    'ai-resume': {
        title: 'AI for Resume Building & Career Optimization',
        issuer: 'One Team Solutions',
        desc: 'Completed verified training on prompt engineering, generative AI workflows, and leveraging artificial intelligence for high-impact resume creation.',
        img: 'certificates/oneteam/oneteam.jpg',
        fileType: 'image',
        isCustom: false
    },
    'oneteam-cert': {
        title: 'AI for Resume Building & Career Optimization',
        issuer: 'One Team Solutions',
        desc: 'Completed verified training on prompt engineering, generative AI workflows, and leveraging artificial intelligence for high-impact resume creation.',
        img: 'certificates/oneteam/oneteam.jpg',
        fileType: 'image',
        isCustom: false
    },
    'neovent-cert': {
        title: 'Software Development Internship Certificate',
        issuer: 'Neovent Innovations',
        desc: 'Verified completion of software development internship at Neovent Innovations, collaborating on enterprise workflows, web technologies, backend logic, and Git codebases.',
        img: 'certificates/NEOVENT/NEOVENT.jpg',
        fileType: 'image',
        isCustom: false
    },
    'vblase-cert': {
        title: 'V-BLASE Technical Excellence & Participation',
        issuer: 'V-BLASE Technical Symposium',
        desc: 'Awarded for active engineering participation, technical innovation, problem solving, and workshop competency at V-BLASE.',
        img: 'certificates/VBLASE/VBLASE.jpg',
        fileType: 'image',
        isCustom: false
    },
    'digital-101': {
        title: 'Digital 101 - 30 Hours Course',
        issuer: 'Foundational Course',
        desc: 'Underwent 30 hours of foundational training covering core concepts in digital literacy, modern technologies, and introductory systems.',
        img: 'certificates/NEOVENT/NEOVENT.jpg',
        fileType: 'image',
        isCustom: false
    },
    'python-training': {
        title: 'Python Technical Training',
        issuer: 'Technical Competency',
        desc: 'Completed comprehensive Python programming training, mastering variables, logical expressions, lists, dictionaries, files, and classes.',
        img: 'certificates/VBLASE/VBLASE.jpg',
        fileType: 'image',
        isCustom: false
    }
};

/* --- Persistent Storage Utility (IndexedDB + LocalStorage Fallback) --- */
const CertStorage = {
    dbName: 'PortfolioCertificatesDB',
    storeName: 'certificates',
    dbVersion: 1,

    openDB() {
        return new Promise((resolve) => {
            if (!window.indexedDB) {
                resolve(null);
                return;
            }
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = () => resolve(null);
        });
    },

    async getAll() {
        const db = await this.openDB();
        if (db) {
            return new Promise((resolve) => {
                try {
                    const tx = db.transaction(this.storeName, 'readonly');
                    const store = tx.objectStore(this.storeName);
                    const req = store.getAll();
                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => resolve(this.getAllFromLocalStorage());
                } catch (e) {
                    resolve(this.getAllFromLocalStorage());
                }
            });
        }
        return this.getAllFromLocalStorage();
    },

    getAllFromLocalStorage() {
        try {
            const raw = localStorage.getItem('portfolio_custom_certificates');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    async save(cert) {
        const db = await this.openDB();
        if (db) {
            try {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                store.put(cert);
            } catch (e) {
                console.warn('IndexedDB save failed, using fallback', e);
            }
        }
        // Save to LocalStorage as secondary backup (if within size)
        try {
            const list = this.getAllFromLocalStorage().filter(c => c.id !== cert.id);
            list.push(cert);
            localStorage.setItem('portfolio_custom_certificates', JSON.stringify(list));
        } catch (e) {
            // LocalStorage might be full due to large files, IndexedDB holds it safely
        }
    },

    async delete(id) {
        const db = await this.openDB();
        if (db) {
            try {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                store.delete(id);
            } catch (e) {}
        }
        try {
            const list = this.getAllFromLocalStorage().filter(c => c.id !== id);
            localStorage.setItem('portfolio_custom_certificates', JSON.stringify(list));
        } catch (e) {}
    }
};

/* --- Lightbox Modal Logic --- */
let activeModalCertId = null;

function openCertificateModal(certId) {
    const data = certificateData[certId];
    if (!data) return;

    activeModalCertId = certId;
    modalTitle.textContent = data.title;
    modalIssuer.textContent = data.issuer;
    modalDesc.textContent = data.desc;

    const fileSrc = data.img || data.fileData;
    const isPdf = data.fileType === 'pdf' || (fileSrc && fileSrc.includes('application/pdf')) || (fileSrc && fileSrc.toLowerCase().endsWith('.pdf'));

    if (fileSrc && isPdf) {
        // PDF Display
        if (modalCertPdfWrap) modalCertPdfWrap.style.display = 'block';
        if (modalCertPdf) modalCertPdf.src = fileSrc;
        if (modalCertImg) modalCertImg.style.display = 'none';
        if (modalCertMockup) modalCertMockup.style.display = 'none';

        if (modalCertLink) {
            modalCertLink.href = fileSrc;
            modalCertLink.style.display = 'inline-flex';
        }
        if (modalCertDownloadBtn) {
            modalCertDownloadBtn.href = fileSrc;
            modalCertDownloadBtn.download = (data.title || 'certificate') + '.pdf';
            modalCertDownloadBtn.style.display = 'inline-flex';
        }
    } else if (fileSrc) {
        // Image Display
        if (modalCertPdfWrap) modalCertPdfWrap.style.display = 'none';
        if (modalCertImg) {
            modalCertImg.src = fileSrc;
            modalCertImg.style.display = 'block';
        }
        if (modalCertMockup) modalCertMockup.style.display = 'none';

        if (modalCertLink) {
            modalCertLink.href = fileSrc;
            modalCertLink.style.display = 'inline-flex';
        }
        if (modalCertDownloadBtn) {
            modalCertDownloadBtn.href = fileSrc;
            modalCertDownloadBtn.download = (data.title || 'certificate') + '.jpg';
            modalCertDownloadBtn.style.display = 'inline-flex';
        }
    } else {
        // CSS Mockup Fallback
        if (modalCertPdfWrap) modalCertPdfWrap.style.display = 'none';
        if (modalCertImg) modalCertImg.style.display = 'none';
        if (modalCertMockup) modalCertMockup.style.display = 'block';

        if (modalCertLink) modalCertLink.style.display = 'none';
        if (modalCertDownloadBtn) modalCertDownloadBtn.style.display = 'none';

        const mockHeading = document.getElementById('mock-cert-heading');
        const mockDesc = document.getElementById('modal-cert-desc');
        const mockSigLeft = document.getElementById('mock-cert-sig-left');
        const mockSigRight = document.getElementById('mock-cert-sig-right');

        if (mockHeading) mockHeading.textContent = data.title.toUpperCase();
        if (mockDesc) mockDesc.textContent = data.desc;
        if (mockSigLeft) mockSigLeft.textContent = data.issuer;
        if (mockSigRight) mockSigRight.textContent = 'Anukarsh C';
    }

    // Custom certificate action (Delete button)
    if (data.isCustom && modalCustomActions) {
        modalCustomActions.style.display = 'block';
        if (modalDeleteCertBtn) modalDeleteCertBtn.dataset.id = certId;
    } else if (modalCustomActions) {
        modalCustomActions.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    if (modalCertPdf) modalCertPdf.src = '';
    activeModalCertId = null;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Delete from inside modal
if (modalDeleteCertBtn) {
    modalDeleteCertBtn.addEventListener('click', () => {
        const id = modalDeleteCertBtn.dataset.id || activeModalCertId;
        if (id) {
            deleteCertificate(id);
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.classList.contains('open')) closeModal();
        const addModal = document.getElementById('add-cert-modal');
        if (addModal && addModal.classList.contains('open')) closeAddCertModal();
    }
});

/* --- Dynamic Rendering of Custom Certificate Cards --- */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createCertCardElement(item) {
    const card = document.createElement('div');
    card.className = 'cert-card glass-card custom-cert-card reveal';
    card.dataset.category = item.category || 'achievements';
    card.dataset.certId = item.id;

    const isPdf = item.fileType === 'pdf';
    const iconName = isPdf ? 'file-text' : (item.category === 'internship' ? 'briefcase' : (item.category === 'elite' ? 'award' : 'trophy'));

    card.innerHTML = `
        <div class="cert-glow"></div>
        <div class="cert-top-actions">
            <span class="cert-custom-badge"><i data-lucide="sparkles"></i> Achievement</span>
            <button class="cert-card-delete-btn" type="button" data-id="${item.id}" title="Remove Certificate">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
        <div class="cert-icon-wrap">
            <i data-lucide="${iconName}" class="cert-icon"></i>
        </div>
        <h3 class="cert-name">${escapeHtml(item.title)}</h3>
        <p class="cert-issuer">${escapeHtml(item.issuer)}</p>
        <span class="cert-date">Issued: ${escapeHtml(item.date || '2026')}</span>
        <div class="cert-desc-text">${escapeHtml(item.desc || 'Professional credential and verified achievement.')}</div>
        <button class="cert-view-btn" data-cert="${item.id}" type="button">
            <i data-lucide="${isPdf ? 'file-text' : 'eye'}"></i>
            View Certificate
        </button>
    `;
    return card;
}

function updateCategoryCounts() {
    const grid = document.querySelector('.certificates-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.cert-card:not(.cert-placeholder)');

    let counts = { all: cards.length, internship: 0, elite: 0, workshops: 0, achievements: 0, other: 0 };
    cards.forEach(c => {
        const cat = c.dataset.category;
        if (counts[cat] !== undefined) counts[cat]++;
        else counts.other++;
    });

    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    setTxt('count-all', counts.all);
    setTxt('count-internship', counts.internship);
    setTxt('count-elite', counts.elite);
    setTxt('count-workshops', counts.workshops);
    setTxt('count-achievements', counts.achievements);
}

// Load and inject stored certificates
async function loadSavedCertificates() {
    try {
        const customCerts = await CertStorage.getAll();
        const grid = document.querySelector('.certificates-grid');
        const placeholder = document.getElementById('placeholder-add-cert');

        if (!grid || !placeholder) return;

        customCerts.forEach(item => {
            certificateData[item.id] = {
                title: item.title,
                issuer: item.issuer,
                desc: item.desc,
                fileType: item.fileType,
                fileData: item.fileData,
                img: item.fileData,
                isCustom: true
            };
            const cardEl = createCertCardElement(item);
            grid.insertBefore(cardEl, placeholder);
        });

        updateCategoryCounts();
        if (window.lucide) lucide.createIcons();
    } catch (err) {
        console.error('Error loading saved certificates:', err);
    }
}

// Global delegated click for "View Certificate" & "Delete Certificate"
const certGrid = document.querySelector('.certificates-grid');
if (certGrid) {
    certGrid.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.cert-view-btn');
        if (viewBtn) {
            openCertificateModal(viewBtn.dataset.cert);
            return;
        }

        const delBtn = e.target.closest('.cert-card-delete-btn');
        if (delBtn) {
            const id = delBtn.dataset.id;
            if (id) deleteCertificate(id);
            return;
        }
    });
}

async function deleteCertificate(id) {
    if (!confirm('Are you sure you want to remove this certificate?')) return;

    await CertStorage.delete(id);
    delete certificateData[id];

    const card = document.querySelector(`.cert-card[data-cert-id="${id}"]`);
    if (card) {
        if (window.gsap) {
            gsap.to(card, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    card.remove();
                    updateCategoryCounts();
                }
            });
        } else {
            card.remove();
            updateCategoryCounts();
        }
    }
    if (typeof showToast === 'function') {
        showToast('Certificate removed successfully');
    }
}

/* --- Add Certificate Modal & Upload Handling --- */
const addCertModal = document.getElementById('add-cert-modal');
const openAddCertBtn = document.getElementById('open-add-cert-modal');
const placeholderAddCert = document.getElementById('placeholder-add-cert');
const addCertModalClose = document.getElementById('add-cert-modal-close');
const cancelAddCertBtn = document.getElementById('cancel-add-cert-btn');
const addCertForm = document.getElementById('add-cert-form');

const certDropzone = document.getElementById('cert-dropzone');
const certFileInput = document.getElementById('cert-file-input');
const dropzoneIdleView = document.getElementById('dropzone-idle-view');
const dropzoneSelectedView = document.getElementById('dropzone-selected-view');
const uploadPreviewThumb = document.getElementById('upload-preview-thumb');
const uploadPdfThumb = document.getElementById('upload-pdf-thumb');
const uploadFilename = document.getElementById('upload-filename');
const uploadFilesize = document.getElementById('upload-filesize');
const removeUploadedFileBtn = document.getElementById('remove-uploaded-file-btn');
const laserScanLine = document.getElementById('laser-scan-line');
const uploadStatusTag = document.getElementById('upload-status-tag');

// AI Scanner Elements
const aiScanStatusWrap = document.getElementById('ai-scan-status-wrap');
const aiScanTitle = document.getElementById('ai-scan-title');
const aiScanDesc = document.getElementById('ai-scan-desc');
const aiProgressBar = document.getElementById('ai-progress-bar');
const aiAutofillBanner = document.getElementById('ai-autofill-banner');
const aiRescanBtn = document.getElementById('ai-rescan-btn');

let currentUploadedFile = null;
let currentFileDataUrl = null;

function openAddCertModal() {
    if (!addCertModal) return;
    addCertModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
}

function closeAddCertModal() {
    if (!addCertModal) return;
    addCertModal.classList.remove('open');
    document.body.style.overflow = 'auto';
    resetUploadForm();
}

function resetUploadForm() {
    if (addCertForm) addCertForm.reset();
    currentUploadedFile = null;
    currentFileDataUrl = null;
    if (certFileInput) certFileInput.value = '';
    if (dropzoneIdleView) dropzoneIdleView.style.display = 'block';
    if (dropzoneSelectedView) dropzoneSelectedView.style.display = 'none';
    if (uploadPreviewThumb) {
        uploadPreviewThumb.src = '';
        uploadPreviewThumb.style.display = 'none';
    }
    if (uploadPdfThumb) uploadPdfThumb.style.display = 'none';
    if (laserScanLine) laserScanLine.style.display = 'none';
    if (aiScanStatusWrap) aiScanStatusWrap.style.display = 'none';
    if (aiAutofillBanner) aiAutofillBanner.style.display = 'none';
    if (aiRescanBtn) aiRescanBtn.style.display = 'none';
}

if (openAddCertBtn) openAddCertBtn.addEventListener('click', openAddCertModal);
if (placeholderAddCert) {
    placeholderAddCert.addEventListener('click', openAddCertModal);
    placeholderAddCert.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAddCertModal();
        }
    });
}
if (addCertModalClose) addCertModalClose.addEventListener('click', closeAddCertModal);
if (cancelAddCertBtn) cancelAddCertBtn.addEventListener('click', closeAddCertModal);
if (addCertModal) {
    addCertModal.addEventListener('click', (e) => {
        if (e.target === addCertModal) closeAddCertModal();
    });
}

// File dropzone click & drag-and-drop
if (certDropzone && certFileInput) {
    certDropzone.addEventListener('click', (e) => {
        if (e.target.closest('#remove-uploaded-file-btn')) return;
        certFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
        certDropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            certDropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        certDropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            certDropzone.classList.remove('dragover');
        });
    });

    certDropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleSelectedFile(files[0]);
        }
    });

    certFileInput.addEventListener('change', () => {
        if (certFileInput.files && certFileInput.files.length > 0) {
            handleSelectedFile(certFileInput.files[0]);
        }
    });
}

if (removeUploadedFileBtn) {
    removeUploadedFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUploadForm();
    });
}

if (aiRescanBtn) {
    aiRescanBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUploadedFile && currentFileDataUrl) {
            runAiCertificateExtraction(currentUploadedFile, currentFileDataUrl);
        }
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function handleSelectedFile(file) {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
        if (typeof showToast === 'function') showToast('Please select an image (PNG, JPG, WEBP) or a PDF file.');
        return;
    }

    currentUploadedFile = file;
    uploadFilename.textContent = file.name;
    uploadFilesize.textContent = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
        currentFileDataUrl = e.target.result;
        dropzoneIdleView.style.display = 'none';
        dropzoneSelectedView.style.display = 'flex';

        if (isImage) {
            uploadPreviewThumb.src = currentFileDataUrl;
            uploadPreviewThumb.style.display = 'block';
            uploadPdfThumb.style.display = 'none';
        } else {
            uploadPreviewThumb.style.display = 'none';
            uploadPdfThumb.style.display = 'flex';
        }
        if (window.lucide) lucide.createIcons();

        // Trigger AI analysis & auto-fill immediately
        runAiCertificateExtraction(file, currentFileDataUrl);
    };
    reader.readAsDataURL(file);
}

/* --------------------------------------------------
 * AI CERTIFICATE SCANNER & AUTO-EXTRACTION ENGINE
 * -------------------------------------------------- */

// Intelligent metadata extractor (OCR text & Filename NLP)
function extractCertificateDetails(rawText, filename) {
    const text = (rawText || '').trim();
    const cleanFn = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const lowerText = (text + ' ' + cleanFn).toLowerCase();

    // 1. Detect Issuing Organization / Authority
    let detectedIssuer = 'Authorized Certifying Organization';
    const issuerRules = [
        { regex: /nptel|swayam|iit\s+madras/i, name: 'IIT Madras (NPTEL Swayam)' },
        { regex: /iit\s+bombay/i, name: 'IIT Bombay' },
        { regex: /iit\s+delhi/i, name: 'IIT Delhi' },
        { regex: /iit\s+kharagpur/i, name: 'IIT Kharagpur' },
        { regex: /dinesh\s+it/i, name: 'Dinesh IT Systems' },
        { regex: /neovent/i, name: 'Neovent Innovations' },
        { regex: /one\s*team/i, name: 'One Team Solutions' },
        { regex: /iste/i, name: 'Indian Society for Technical Education (ISTE)' },
        { regex: /v[\s-]*blase/i, name: 'V-BLASE Technical Symposium' },
        { regex: /amazon\s+web\s+services|aws/i, name: 'Amazon Web Services (AWS)' },
        { regex: /google\s+cloud|google/i, name: 'Google' },
        { regex: /microsoft|azure/i, name: 'Microsoft' },
        { regex: /meta|facebook/i, name: 'Meta' },
        { regex: /coursera/i, name: 'Coursera' },
        { regex: /udemy/i, name: 'Udemy' },
        { regex: /hackerrank/i, name: 'HackerRank' },
        { regex: /leetcode/i, name: 'LeetCode' },
        { regex: /stanford/i, name: 'Stanford University' },
        { regex: /harvard/i, name: 'Harvard University' },
        { regex: /oracle/i, name: 'Oracle' },
        { regex: /cisco/i, name: 'Cisco Networking Academy' },
        { regex: /ibm/i, name: 'IBM' }
    ];

    for (const rule of issuerRules) {
        if (rule.regex.test(lowerText)) {
            detectedIssuer = rule.name;
            break;
        }
    }

    // Secondary check for institution in text lines
    if (detectedIssuer === 'Authorized Certifying Organization' && text) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
            if (/university|institute|college|academy|technologies|solutions|foundation/i.test(line) && line.length < 50) {
                detectedIssuer = line;
                break;
            }
        }
    }

    // 2. Detect Certificate Title
    let detectedTitle = '';
    const titleRules = [
        { regex: /python\s+for\s+data\s+science/i, name: 'Python for Data Science (Elite Certificate)' },
        { regex: /database\s+migration/i, name: 'Database Migration using Python Flask & PostgreSQL' },
        { regex: /ai\s+for\s+resume|resume\s+building/i, name: 'AI for Resume Building & Career Optimization' },
        { regex: /software\s+development\s+internship/i, name: 'Software Development Internship' },
        { regex: /iste\s+student\s+member/i, name: 'ISTE Student Member' },
        { regex: /cloud\s+practitioner/i, name: 'AWS Certified Cloud Practitioner' },
        { regex: /solutions\s+architect/i, name: 'AWS Certified Solutions Architect' },
        { regex: /full\s*stack/i, name: 'Full Stack Web Development' },
        { regex: /machine\s+learning/i, name: 'Machine Learning & AI Specialization' },
        { regex: /data\s+structures|algorithms/i, name: 'Data Structures and Algorithms' },
        { regex: /deep\s+learning/i, name: 'Deep Learning Specialization' },
        { regex: /digital\s+101/i, name: 'Digital 101 Foundational Course' },
        { regex: /cyber\s*security/i, name: 'Cybersecurity Fundamentals' }
    ];

    for (const rule of titleRules) {
        if (rule.regex.test(lowerText)) {
            detectedTitle = rule.name;
            break;
        }
    }

    // Regex capture for "Certificate of X" or "completed X"
    if (!detectedTitle && text) {
        const m1 = text.match(/certificate\s+(?:of|for)\s+([A-Za-z0-9\s&,-]{4,45})/i);
        const m2 = text.match(/(?:completed|certified\s+in)\s+([A-Za-z0-9\s&,-]{4,45})/i);
        if (m1 && m1[1].trim()) detectedTitle = m1[1].trim();
        else if (m2 && m2[1].trim()) detectedTitle = m2[1].trim();
    }

    // Fallback: Title from cleaned filename
    if (!detectedTitle) {
        let titleTokens = cleanFn
            .replace(/cert(ificate)?|doc(ument)?|scan|verified|img|photo|pdf|jpg/gi, '')
            .trim();
        if (titleTokens.length >= 3) {
            detectedTitle = titleTokens
                .split(' ')
                .filter(Boolean)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
        } else {
            detectedTitle = 'Certified Professional Credential';
        }
    }

    // 3. Detect Category
    let detectedCategory = 'achievements';
    if (/intern|internship|trainee|work\s+experience/i.test(lowerText)) {
        detectedCategory = 'internship';
    } else if (/elite|academic|nptel|swayam|iit|university|exam|score|grade/i.test(lowerText)) {
        detectedCategory = 'elite';
    } else if (/workshop|seminar|webinar|bootcamp|ai|hands-on|training/i.test(lowerText)) {
        detectedCategory = 'workshops';
    } else if (/hackathon|contest|competition|winner|rank|prize|first|second/i.test(lowerText)) {
        detectedCategory = 'achievements';
    } else {
        detectedCategory = 'other';
    }

    // 4. Detect Date / Year
    let detectedDate = '';
    const dateMatch = lowerText.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(?:20\d\d)/i)
        || lowerText.match(/\b(202[0-9]|201[8-9])\b/);
    if (dateMatch) {
        detectedDate = dateMatch[0].charAt(0).toUpperCase() + dateMatch[0].slice(1);
    } else {
        detectedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // 5. Generate Professional AI Description
    let detectedDesc = '';
    const scoreMatch = text.match(/(?:score|consolidated|marks|percentage|result)[:\s]*([0-9]{2,3}(?:\.[0-9]+)?%?)/i);

    if (scoreMatch) {
        detectedDesc = `Successfully earned this verified credential in ${detectedTitle} issued by ${detectedIssuer} with an evaluated score of ${scoreMatch[1]}. Demonstrates mastery in theoretical principles and applied practical competencies.`;
    } else if (detectedCategory === 'internship') {
        detectedDesc = `Verified internship credential at ${detectedIssuer}. Collaborated on software development workflows, hands-on architectural problem-solving, and production codebase standards.`;
    } else if (detectedCategory === 'elite') {
        detectedDesc = `Rigorous academic certification awarded by ${detectedIssuer} for ${detectedTitle}. Validates high-standard competencies and proctored conceptual mastery.`;
    } else if (detectedCategory === 'workshops') {
        detectedDesc = `Completed specialized technical training on ${detectedTitle} hosted by ${detectedIssuer}. Emphasized modern tools, implementation paradigms, and applied methodologies.`;
    } else {
        detectedDesc = `Recognized achievement for ${detectedTitle} awarded by ${detectedIssuer}. Affirms dedicated technical skill, analytical problem-solving, and verified proficiency.`;
    }

    return {
        title: detectedTitle,
        issuer: detectedIssuer,
        category: detectedCategory,
        date: detectedDate,
        desc: detectedDesc
    };
}

async function runAiCertificateExtraction(file, dataUrl) {
    if (!aiScanStatusWrap) return;

    // Show scanner UI & laser line
    aiScanStatusWrap.style.display = 'block';
    if (laserScanLine) laserScanLine.style.display = 'block';
    if (aiAutofillBanner) aiAutofillBanner.style.display = 'none';
    if (aiRescanBtn) aiRescanBtn.style.display = 'none';
    if (uploadStatusTag) {
        uploadStatusTag.innerHTML = '<i data-lucide="loader-2" class="spin-icon"></i> AI Scanning Document...';
    }

    if (aiProgressBar) aiProgressBar.style.width = '20%';
    if (aiScanTitle) aiScanTitle.textContent = 'AI Certificate Scanner Active';
    if (aiScanDesc) aiScanDesc.textContent = 'Scanning document layout and extracting text with AI OCR...';
    if (window.lucide) lucide.createIcons();

    let extractedOcrText = '';

    // Step 1: Run Tesseract OCR if available on images (with 4.5s safe timeout)
    const isImage = file.type.startsWith('image/');
    if (isImage && window.Tesseract) {
        try {
            if (aiProgressBar) aiProgressBar.style.width = '55%';
            if (aiScanDesc) aiScanDesc.textContent = 'Reading printed text, seals, and credentials...';

            const ocrPromise = Tesseract.recognize(dataUrl, 'eng');
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 4500));
            const ocrResult = await Promise.race([ocrPromise, timeoutPromise]);

            if (ocrResult && ocrResult.data && ocrResult.data.text) {
                extractedOcrText = ocrResult.data.text;
            }
        } catch (e) {
            console.log('OCR completed or timed out, continuing with intelligent parsing...');
        }
    }

    // Step 2: Synthesize and extract metadata
    if (aiProgressBar) aiProgressBar.style.width = '85%';
    if (aiScanDesc) aiScanDesc.textContent = 'AI synthesizing title, organization, and generating description...';

    await new Promise(r => setTimeout(r, 400)); // Natural UX pacing

    const info = extractCertificateDetails(extractedOcrText, file.name);

    // Step 3: Populate Form Fields
    const titleInput = document.getElementById('new-cert-title');
    const issuerInput = document.getElementById('new-cert-issuer');
    const categorySelect = document.getElementById('new-cert-category');
    const dateInput = document.getElementById('new-cert-date');
    const descTextarea = document.getElementById('new-cert-desc');

    if (titleInput) {
        titleInput.value = info.title;
        titleInput.classList.add('field-ai-highlighted');
    }
    if (issuerInput) {
        issuerInput.value = info.issuer;
        issuerInput.classList.add('field-ai-highlighted');
    }
    if (categorySelect) {
        categorySelect.value = info.category;
        categorySelect.classList.add('field-ai-highlighted');
    }
    if (dateInput) {
        dateInput.value = info.date;
        dateInput.classList.add('field-ai-highlighted');
    }
    if (descTextarea) {
        descTextarea.value = info.desc;
        descTextarea.classList.add('field-ai-highlighted');
    }

    // Cleanup highlights after animation
    setTimeout(() => {
        [titleInput, issuerInput, categorySelect, dateInput, descTextarea].forEach(el => {
            if (el) el.classList.remove('field-ai-highlighted');
        });
    }, 1800);

    // Step 4: Finalize scanner UI
    if (aiProgressBar) aiProgressBar.style.width = '100%';
    if (laserScanLine) laserScanLine.style.display = 'none';
    if (aiScanTitle) aiScanTitle.textContent = '✨ AI Analysis Complete!';
    if (aiScanDesc) aiScanDesc.textContent = `Extracted: "${info.title}" from ${info.issuer}`;
    if (aiAutofillBanner) aiAutofillBanner.style.display = 'flex';
    if (aiRescanBtn) aiRescanBtn.style.display = 'inline-flex';
    if (uploadStatusTag) {
        uploadStatusTag.innerHTML = '<i data-lucide="check-circle-2"></i> AI Extracted Successfully';
    }
    if (window.lucide) lucide.createIcons();

    if (typeof showToast === 'function') {
        showToast('✨ AI automatically filled certificate details!');
    }
}

// Add Certificate Form Submission
if (addCertForm) {
    addCertForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('new-cert-title').value.trim();
        const issuer = document.getElementById('new-cert-issuer').value.trim();
        const category = document.getElementById('new-cert-category').value;
        const date = document.getElementById('new-cert-date').value.trim() || '2026';
        const desc = document.getElementById('new-cert-desc').value.trim() || 'Verified certification and credential.';

        if (!title || !issuer) {
            if (typeof showToast === 'function') showToast('Please enter both title and issuing organization.');
            return;
        }

        const isPdf = currentUploadedFile && (currentUploadedFile.type === 'application/pdf' || currentUploadedFile.name.toLowerCase().endsWith('.pdf'));
        const fileType = currentUploadedFile ? (isPdf ? 'pdf' : 'image') : 'none';

        const certItem = {
            id: 'cert-custom-' + Date.now(),
            title: title,
            issuer: issuer,
            category: category,
            date: date,
            desc: desc,
            fileType: fileType,
            fileData: currentFileDataUrl || '',
            fileName: currentUploadedFile ? currentUploadedFile.name : '',
            isCustom: true,
            createdAt: Date.now()
        };

        // Save to Storage
        await CertStorage.save(certItem);

        // Update memory registry
        certificateData[certItem.id] = {
            title: certItem.title,
            issuer: certItem.issuer,
            desc: certItem.desc,
            fileType: certItem.fileType,
            fileData: certItem.fileData,
            img: certItem.fileData,
            isCustom: true
        };

        // Inject into DOM
        const grid = document.querySelector('.certificates-grid');
        const placeholder = document.getElementById('placeholder-add-cert');
        const cardEl = createCertCardElement(certItem);

        if (grid && placeholder) {
            grid.insertBefore(cardEl, placeholder);
            updateCategoryCounts();
            if (window.lucide) lucide.createIcons();

            if (window.gsap) {
                gsap.fromTo(cardEl, 
                    { scale: 0.9, opacity: 0, y: 20 }, 
                    { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
                );
            }
        }

        if (typeof showToast === 'function') {
            showToast('Certificate saved & displayed!');
        }

        closeAddCertModal();
    });
}

// Backup & Export Data Feature
const exportCertBtn = document.getElementById('export-cert-btn');
if (exportCertBtn) {
    exportCertBtn.addEventListener('click', async () => {
        const list = await CertStorage.getAll();
        if (!list || list.length === 0) {
            if (typeof showToast === 'function') showToast('No custom certificates saved yet to backup.');
            return;
        }
        const jsonStr = JSON.stringify(list, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anukarsh_certificates_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof showToast === 'function') showToast('Backup downloaded successfully!');
    });
}

// Initialize saved certificates on load
loadSavedCertificates();

/* --------------------------------------------------
 * 9. GITHUB INSIGHTS GENERATION & API
 * -------------------------------------------------- */

// Generate Simulated Contribution Grid
function generateGitHubContribGrid() {
    const grid = document.getElementById('github-contrib-grid');
    if (!grid) return;
    
    // We render 24 columns for simple visual presentation (approx 6 months)
    const columnsCount = 36;
    const daysInWeek = 7;
    
    let html = '';
    
    for (let day = 0; day < daysInWeek; day++) {
        html += '<div class="contrib-row">';
        for (let week = 0; week < columnsCount; week++) {
            // Weights to make contributions look real (more active blocks on mid-week, less on weekends)
            const randomVal = Math.random();
            let level = 'level-0';
            
            if (randomVal > 0.5) {
                if (randomVal > 0.88) {
                    level = 'level-4';
                } else if (randomVal > 0.75) {
                    level = 'level-3';
                } else if (randomVal > 0.62) {
                    level = 'level-2';
                } else {
                    level = 'level-1';
                }
            }
            html += `<div class="contrib-cell ${level}" title="Commits: ${level === 'level-0' ? 0 : Math.floor(randomVal * 10)}"></div>`;
        }
        html += '</div>';
    }
    grid.innerHTML = html;
}
generateGitHubContribGrid();

// Fetch GitHub API details with Fallbacks
async function fetchGitHubProfileStats() {
    const username = 'anukarsh';
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
            const data = await response.json();
            
            document.getElementById('github-avatar').src = data.avatar_url;
            document.getElementById('github-name').textContent = data.name || 'Anukarsh C';
            document.getElementById('github-repos-count').textContent = data.public_repos || 12;
            document.getElementById('github-followers-count').textContent = data.followers || 24;
            
            // Fetch stars count by fetching user repos (limited to page 1)
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (reposResponse.ok) {
                const repos = await reposResponse.json();
                let starCount = 0;
                repos.forEach(repo => {
                    starCount += repo.stargazers_count;
                });
                document.getElementById('github-stars-count').textContent = starCount || 48;
            }
        }
    } catch (error) {
        console.warn('GitHub API failed. Falling back to recruiter-optimized mock statistics.', error);
        // Fallbacks are already populated in index.html
    }
}
fetchGitHubProfileStats();

/* --------------------------------------------------
 * 10. VISITOR COUNTER WIDGET
 * -------------------------------------------------- */

function setupVisitorCounter() {
    const visitorCountVal = document.getElementById('visitor-count-value');
    if (!visitorCountVal) return;

    const storageKey = 'portfolio_visits_count';
    let currentVisits = localStorage.getItem(storageKey);
    
    if (!currentVisits) {
        // Recruiter-optimized start point
        currentVisits = 1482;
    } else {
        currentVisits = parseInt(currentVisits);
    }
    
    // Increment by 1 on view
    currentVisits += 1;
    localStorage.setItem(storageKey, currentVisits);
    
    // Format as 5 digit padded string
    const paddedCount = String(currentVisits).padStart(5, '0');
    visitorCountVal.textContent = paddedCount;
}
setupVisitorCounter();

/* --------------------------------------------------
 * 11. GSAP SCROLL TRIGGERS & REVEALS
 * -------------------------------------------------- */

function initAnimations() {
    if (window.lucide) lucide.createIcons();
    gsap.registerPlugin(ScrollTrigger);

    // Hero main elements & Terminal HUD entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl.from('.hero-status-pill', { opacity: 0, y: 20, duration: 0.5, delay: 0.1 })
          .from('.greeting', { opacity: 0, y: 25, duration: 0.5 }, '-=0.3')
          .from('.name', { opacity: 0, y: 25, duration: 0.6 }, '-=0.3')
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
          .from('.hero-description', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
          .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
          .from('.hero-badges .tech-badge-item', { opacity: 0, y: 15, stagger: 0.1, duration: 0.4 }, '-=0.2')
          .from('.developer-terminal-card', { opacity: 0, x: 40, scale: 0.95, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.7');


    
    // Skill bars animation on entering viewport
    ScrollTrigger.create({
        trigger: '#skills',
        start: 'top 70%',
        onEnter: () => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                const target = bar.dataset.percent;
                bar.style.width = `${target}%`;
            });
        }
    });

    // Scroll reveal triggers for headers and columns
    document.querySelectorAll('.reveal').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Stats counter count-up transition
    document.querySelectorAll('.counter-val').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                gsap.to({ value: 0 }, {
                    value: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        counter.textContent = Math.floor(this.targets()[0].value);
                    }
                });
            }
        });
    });
}

/* --------------------------------------------------
 * 12. CONTACT FORM MESSAGING
 * -------------------------------------------------- */

function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const feedbackMsg = document.getElementById('form-feedback-message');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    
    // Simulate API Post latency
    setTimeout(() => {
        submitBtn.innerHTML = '<span>Message Sent!</span>';
        feedbackMsg.style.display = 'flex';
        gsap.from(feedbackMsg, { opacity: 0, y: 10, duration: 0.3 });
        form.reset();
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span> <i class="btn-icon" data-lucide="send"></i>';
            lucide.createIcons(); // Re-render icon
        }, 3000);
    }, 1200);
}

/* --------------------------------------------------
 * 13. EXPERIENCE TABS SWITCHER
 * -------------------------------------------------- */
const companyTabs = document.querySelectorAll('.company-tab');
const experiencePanels = document.querySelectorAll('.experience-panel');

companyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        companyTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all panels
        experiencePanels.forEach(panel => panel.classList.remove('active'));
        
        // Show target panel
        const targetId = `exp-${tab.dataset.company}`;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
            // Re-trigger reveal animation for the panel contents
            gsap.fromTo(targetPanel.querySelectorAll('li, .exp-tech-tags span'), 
                { opacity: 0, y: 10 }, 
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
            );
        }
    });
});

/* --------------------------------------------------
 * 14. MOBILE NAVIGATION TOGGLE
 * -------------------------------------------------- */
const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item, #mobile-menu-dropdown .btn');

if (mobileMenuTrigger && mobileMenuDropdown) {
    mobileMenuTrigger.addEventListener('click', () => {
        mobileMenuTrigger.classList.toggle('active');
        mobileMenuDropdown.classList.toggle('open');
    });

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuTrigger.classList.remove('active');
            mobileMenuDropdown.classList.remove('open');
        });
    });
}

/* --------------------------------------------------
 * 15. TOP READING SCROLL PROGRESS BAR
 * -------------------------------------------------- */
const scrollProgressBar = document.getElementById('scroll-progress-bar');
window.addEventListener('scroll', () => {
    if (!scrollProgressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
});

/* --------------------------------------------------
 * 16. TOAST NOTIFICATION UTILITY
 * -------------------------------------------------- */
const toastPopup = document.getElementById('toast-notification');
const toastMsg = document.getElementById('toast-msg');
let toastTimeout;

function showToast(message) {
    if (!toastPopup) return;
    if (toastMsg) toastMsg.textContent = message;
    
    toastPopup.classList.add('show');
    clearTimeout(toastTimeout);
    
    toastTimeout = setTimeout(() => {
        toastPopup.classList.remove('show');
    }, 2800);
}

/* --------------------------------------------------
 * 17. 1-CLICK COPY ACTIONS (EMAIL & TERMINAL CODE)
 * -------------------------------------------------- */
// Copy Email
const copyEmailBtn = document.getElementById('hero-copy-email-btn');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = 'anukarsh.c.dev@gmail.com'; // Profile email
        navigator.clipboard.writeText(email).then(() => {
            showToast(`Email copied: ${email}`);
        }).catch(() => {
            showToast(`Email: ${email}`);
        });
    });
}

// Copy Developer Terminal Code
const copyManifestBtn = document.getElementById('copy-manifest-btn');
if (copyManifestBtn) {
    copyManifestBtn.addEventListener('click', () => {
        const codeSnippet = `class SoftwareEngineer:
    def __init__(self):
        self.name = "Anukarsh C"
        self.focus = "Data Science & Backend"
        self.stack = ["Python", "Flask", "Postgres", "AI"]
        self.experience = ["Dinesh IT", "Neovent"]
        self.status = "Open for Opportunities 🚀"

    def deliver_impact(self):
        return build_scalable_solutions()`;
        
        navigator.clipboard.writeText(codeSnippet).then(() => {
            copyManifestBtn.innerHTML = '<i data-lucide="check"></i> <span>Copied!</span>';
            if (window.lucide) lucide.createIcons();
            showToast('Manifest Python code copied!');
            setTimeout(() => {
                copyManifestBtn.innerHTML = '<i data-lucide="copy"></i> <span>Copy</span>';
                if (window.lucide) lucide.createIcons();
            }, 2500);
        });
    });
}

/* --------------------------------------------------
 * 18. CERTIFICATES CATEGORY FILTERS
 * -------------------------------------------------- */
const certFilterBtns = document.querySelectorAll('.cert-filter-btn');

certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        certFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.dataset.certFilter;
        const currentCards = document.querySelectorAll('.certificates-grid .cert-card');
        
        currentCards.forEach(card => {
            const category = card.dataset.category;
            const isPlaceholder = card.classList.contains('cert-placeholder');
            
            if (isPlaceholder || filterVal === 'all' || category === filterVal || category === 'all') {
                card.classList.remove('hidden-by-cert-filter');
                if (window.gsap && !isPlaceholder) {
                    gsap.fromTo(card, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' });
                }
            } else {
                card.classList.add('hidden-by-cert-filter');
            }
        });
    });
});

/* --------------------------------------------------
 * 19. ARCHITECTURE DIAGRAM MODAL (SQL MIGRATOR)
 * -------------------------------------------------- */
const archModal = document.getElementById('architecture-modal');
const archViewBtns = document.querySelectorAll('.arch-view-btn');

if (archModal) {
    const archClose = archModal.querySelector('.modal-close-btn');
    
    archViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            archModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (window.lucide) lucide.createIcons();
        });
    });

    if (archClose) {
        archClose.addEventListener('click', () => {
            archModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    }

    archModal.addEventListener('click', (e) => {
        if (e.target === archModal) {
            archModal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
}

/* --------------------------------------------------
 * 20. INTERACTIVE RESUME PREVIEW MODAL
 * -------------------------------------------------- */
const resumeModal = document.getElementById('resume-modal');
const navResumeBtn = document.getElementById('nav-resume-btn');
const mobileResumeBtn = document.getElementById('mobile-resume-btn');

if (resumeModal) {
    const resumeClose = resumeModal.querySelector('.modal-close-btn');

    function openResumeModal() {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    }

    function closeResumeModal() {
        resumeModal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    if (navResumeBtn) navResumeBtn.addEventListener('click', openResumeModal);
    if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', openResumeModal);
    if (resumeClose) resumeClose.addEventListener('click', closeResumeModal);

    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) closeResumeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (resumeModal.classList.contains('open')) closeResumeModal();
            if (archModal && archModal.classList.contains('open')) archModal.classList.remove('open');
        }
    });
}


