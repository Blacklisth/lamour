// ============================================
// CONFIGURATION INITIALE
// ============================================

// Configuration par défaut (modifiable via le modal)
const defaultConfig = {
    name: "Mon Amour",
    message: "Chaque jour passé à tes côtés est un cadeau précieux. Tu illumines ma vie comme le soleil illumine le monde. Dans tes yeux, je trouve mon refuge, et dans ton sourire, ma raison d'être. Je t'aime plus que les mots ne pourront jamais le dire.",
    date: "2026-02-14" // Format: YYYY-MM-DD
};

// ============================================
// ÉLÉMENTS DU DOM
// ============================================

const elements = {
    // Musique
    musicToggle: document.getElementById('musicToggle'),
    bgMusic: document.getElementById('bgMusic'),
    
    // Contenu personnalisable
    nameDisplay: document.getElementById('nameDisplay'),
    messageDisplay: document.getElementById('messageDisplay'),
    dateDisplay: document.getElementById('dateDisplay'),
    dayCounter: document.getElementById('dayCounter'),
    
    // Modal
    customModal: document.getElementById('customModal'),
    customForm: document.getElementById('customForm'),
    
    // Container pour les cœurs
    heartsContainer: document.getElementById('heartsContainer'),
    
    // Sections pour animations au scroll
    sections: document.querySelectorAll('.section')
};

// ============================================
// GESTION DE LA MUSIQUE
// ============================================

let isMusicPlaying = false;

// Fonction pour démarrer la musique
function toggleMusic() {
    if (isMusicPlaying) {
        elements.bgMusic.pause();
        elements.musicToggle.classList.remove('playing');
        isMusicPlaying = false;
    } else {
        elements.bgMusic.play().catch(err => {
            console.log("La lecture automatique a été bloquée par le navigateur");
        });
        elements.musicToggle.classList.add('playing');
        isMusicPlaying = true;
    }
}

// Écouteur d'événement pour le bouton musique
elements.musicToggle.addEventListener('click', toggleMusic);

// Tentative de lecture automatique (peut être bloquée par le navigateur)
window.addEventListener('load', () => {
    // Petite astuce: on attend une interaction utilisateur
    document.body.addEventListener('click', function initMusic() {
        if (!isMusicPlaying) {
            elements.bgMusic.play().then(() => {
                elements.musicToggle.classList.add('playing');
                isMusicPlaying = true;
            }).catch(err => {
                console.log("Lecture automatique impossible");
            });
        }
        document.body.removeEventListener('click', initMusic);
    }, { once: true });
});

// ============================================
// GÉNÉRATION DES CŒURS FLOTTANTS
// ============================================

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '♥';
    
    // Position horizontale aléatoire
    heart.style.left = Math.random() * 100 + '%';
    
    // Taille aléatoire
    const size = Math.random() * 2 + 1;
    heart.style.fontSize = size + 'rem';
    
    // Durée d'animation aléatoire
    const duration = Math.random() * 10 + 15;
    heart.style.animationDuration = duration + 's';
    
    // Délai aléatoire
    const delay = Math.random() * 5;
    heart.style.animationDelay = delay + 's';
    
    // Couleur avec opacité variable
    const colors = ['#ff6b9d', '#ffa8c5', '#c44569', '#ff9a9e'];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    elements.heartsContainer.appendChild(heart);
    
    // Retirer le cœur après l'animation
    setTimeout(() => {
        heart.remove();
    }, (duration + delay) * 1000);
}

// Créer des cœurs régulièrement
function startHeartAnimation() {
    // Créer 15 cœurs initiaux
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createFloatingHeart(), i * 500);
    }
    
    // Continuer à créer des cœurs
    setInterval(() => {
        createFloatingHeart();
    }, 3000);
}

// ============================================
// CALCUL DU NOMBRE DE JOURS
// ============================================

function calculateDaysSince(dateString) {
    const startDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function updateDayCounter(dateString) {
    const days = calculateDaysSince(dateString);
    const counterNumber = elements.dayCounter.querySelector('.counter-number');
    
    // Animation du compteur
    let currentCount = 0;
    const increment = Math.ceil(days / 50);
    const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= days) {
            currentCount = days;
            clearInterval(timer);
        }
        counterNumber.textContent = currentCount;
    }, 30);
}

// ============================================
// FORMATAGE DE LA DATE
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return { day, month, year };
}

function updateDateDisplay(dateString) {
    const { day, month, year } = formatDate(dateString);
    
    const dateNumber = elements.dateDisplay.querySelector('.date-number');
    const dateMonth = elements.dateDisplay.querySelector('.date-month');
    const dateYear = elements.dateDisplay.querySelector('.date-year');
    
    dateNumber.textContent = day;
    dateMonth.textContent = month;
    dateYear.textContent = year;
}

// ============================================
// PERSONNALISATION DU CONTENU
// ============================================

function loadCustomContent() {
    // Charger depuis le localStorage si disponible
    const savedConfig = localStorage.getItem('loveLetterConfig');
    
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        applyCustomization(config);
    } else {
        // Afficher le modal de personnalisation au premier chargement
        // Commenté pour permettre une utilisation directe, décommentez si vous voulez le modal au démarrage
        // elements.customModal.classList.add('active');
        applyCustomization(defaultConfig);
    }
}

function applyCustomization(config) {
    // Mettre à jour le nom
    elements.nameDisplay.textContent = config.name;
    
    // Mettre à jour le message
    elements.messageDisplay.textContent = config.message;
    
    // Mettre à jour la date
    updateDateDisplay(config.date);
    updateDayCounter(config.date);
}

// ============================================
// GESTION DU FORMULAIRE DE PERSONNALISATION
// ============================================

elements.customForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const config = {
        name: document.getElementById('recipientName').value,
        message: document.getElementById('loveMessage').value,
        date: document.getElementById('importantDate').value
    };
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('loveLetterConfig', JSON.stringify(config));
    
    // Appliquer la personnalisation
    applyCustomization(config);
    
    // Fermer le modal
    elements.customModal.classList.remove('active');
    
    // Animation de confirmation
    showConfirmationAnimation();
});

// Animation de confirmation
function showConfirmationAnimation() {
    const sections = document.querySelectorAll('.content-wrapper');
    sections.forEach((section, index) => {
        section.style.animation = 'none';
        setTimeout(() => {
            section.style.animation = '';
        }, index * 100);
    });
}

// ============================================
// ANIMATIONS AU SCROLL
// ============================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelector('.content-wrapper')?.classList.add('visible');
        }
    });
}, observerOptions);

// Observer toutes les sections
elements.sections.forEach(section => {
    observer.observe(section);
});

// ============================================
// EFFET DE PARALLAXE LÉGER
// ============================================

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hearts = document.querySelectorAll('.floating-heart');
    
    hearts.forEach((heart, index) => {
        const speed = 0.5 + (index % 3) * 0.2;
        const yPos = -(scrolled * speed);
        heart.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
        });
        ticking = true;
    }
});

// ============================================
// ANIMATION D'ÉCRITURE POUR LE MESSAGE
// ============================================

function typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Optionnel: activer l'effet machine à écrire pour le message
// Décommentez les lignes suivantes pour l'activer
/*
window.addEventListener('load', () => {
    const messageText = elements.messageDisplay.textContent;
    setTimeout(() => {
        typewriterEffect(elements.messageDisplay, messageText, 30);
    }, 1500);
});
*/

// ============================================
// GESTION DU CLAVIER (RACCOURCIS)
// ============================================

document.addEventListener('keydown', (e) => {
    // Touche 'M' pour toggle la musique
    if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }
    
    // Touche 'P' pour ouvrir le panneau de personnalisation
    if (e.key === 'p' || e.key === 'P') {
        elements.customModal.classList.toggle('active');
    }
    
    // Touche 'Escape' pour fermer le modal
    if (e.key === 'Escape') {
        elements.customModal.classList.remove('active');
    }
});

// Fermer le modal en cliquant à l'extérieur
elements.customModal.addEventListener('click', (e) => {
    if (e.target === elements.customModal) {
        elements.customModal.classList.remove('active');
    }
});

// ============================================
// ANIMATION DU CURSEUR (EFFET CŒUR)
// ============================================

function createCursorHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '♡';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.color = '#ff6b9d';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'fadeIn 0.5s ease-out, floatHeart 2s ease-out forwards';
    heart.style.opacity = '0';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Créer des cœurs au clic (optionnel)
let clickCount = 0;
document.addEventListener('click', (e) => {
    clickCount++;
    // Créer un cœur tous les 3 clics pour ne pas surcharger
    if (clickCount % 3 === 0) {
        createCursorHeart(e.clientX, e.clientY);
    }
});

// ============================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('💌 Lettre d\'amour chargée avec succès!');
    
    // Charger le contenu personnalisé
    loadCustomContent();
    
    // Démarrer l'animation des cœurs flottants
    startHeartAnimation();
    
    // Petit message dans la console pour les curieux 😊
    console.log('%c Fait avec ❤️ pour toi ', 'background: #ff6b9d; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
    
    // Ajouter une classe pour les animations initiales
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ============================================
// FONCTION UTILITAIRE: OUVRIR LE MODAL DE PERSONNALISATION
// ============================================

// Cette fonction peut être appelée depuis la console pour personnaliser
window.openCustomizationModal = function() {
    elements.customModal.classList.add('active');
};

// ============================================
// GESTION DE LA VISIBILITÉ DE LA PAGE
// ============================================

// Mettre en pause la musique quand l'utilisateur change d'onglet
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isMusicPlaying) {
        elements.bgMusic.pause();
    } else if (!document.hidden && isMusicPlaying) {
        elements.bgMusic.play().catch(err => {
            console.log("Impossible de reprendre la lecture");
        });
    }
});

// ============================================
// EASTER EGG: DOUBLE CLIC SUR LE TITRE
// ============================================

elements.nameDisplay.addEventListener('dblclick', () => {
    // Créer une explosion de cœurs!
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createCursorHeart(x, y);
        }, i * 50);
    }
});

// ============================================
// EXPORT DES FONCTIONS UTILES
// ============================================

// Rendre certaines fonctions accessibles globalement pour debug/personnalisation
window.loveLetterUtils = {
    toggleMusic,
    openCustomizationModal: () => elements.customModal.classList.add('active'),
    resetCustomization: () => {
        localStorage.removeItem('loveLetterConfig');
        applyCustomization(defaultConfig);
    },
    createHeartExplosion: () => {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createFloatingHeart(), i * 100);
        }
    }
};


console.log('💡 Astuce: Tape "loveLetterUtils" dans la console pour voir les fonctions disponibles!');
