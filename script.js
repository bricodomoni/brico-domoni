document.addEventListener('DOMContentLoaded', () => {
    
    // --- GESTION DU SLIDER ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let index = 0;

    function changerSlide(n) {
        slides[index].classList.remove('active'); // On cache l'actuelle
        index = (n + slides.length) % slides.length; // On calcule la suivante
        slides[index].classList.add('active'); // On affiche la nouvelle
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => changerSlide(index + 1));
        prevBtn.addEventListener('click', () => changerSlide(index - 1));
    }

    // Automatique toutes les 5 secondes
    setInterval(() => changerSlide(index + 1), 5000);

    // --- GESTION DES ONGLETS ---
    const boutons = document.querySelectorAll('.tab-btn');
    boutons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cible = btn.getAttribute('data-tab');
            
            // Masquer tout
            document.querySelectorAll('.tab-content').forEach(section => {
                section.classList.remove('active');
            });
            boutons.forEach(b => b.classList.remove('active'));

            // Afficher la cible
            document.getElementById(cible).classList.add('active');
            btn.classList.add('active');
        });
    });
});
