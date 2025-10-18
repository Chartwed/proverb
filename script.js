document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Navigation (Hamburger Menu) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('nav ul');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });
    }

    // --- Property Image Slideshows ---
    const slideshows = document.querySelectorAll('.slideshow-container');

    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        if (slides.length <= 1) {
            const prev = slideshow.querySelector('.prev');
            const next = slideshow.querySelector('.next');
            if(prev) prev.style.display = 'none';
            if(next) next.style.display = 'none';
            if (slides.length === 1) slides[0].style.display = 'block';
            return;
        }

        const prev = slideshow.querySelector('.prev');
        const next = slideshow.querySelector('.next');
        const dotsContainer = slideshow.querySelector('.dots');
        let slideIndex = 0;
        
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showSlide(i); });
            if(dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        function showSlide(n) {
            slideIndex = (n + slides.length) % slides.length;
            slides.forEach(slide => slide.style.display = 'none');
            if(dots.length > 0) dots.forEach(dot => dot.classList.remove('active'));
            slides[slideIndex].style.display = 'block';
            if(dots.length > 0) dots[slideIndex].classList.add('active');
        }

        if(prev) prev.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showSlide(slideIndex - 1); });
        if(next) next.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showSlide(slideIndex + 1); });
        showSlide(0);
    });

    // --- Calculator Event Listeners ---
    const bondForm = document.getElementById('bond-repayment-form');
    if (bondForm) bondForm.addEventListener('submit', calculateBondRepayment);

    const affordabilityForm = document.getElementById('affordability-form');
    if (affordabilityForm) affordabilityForm.addEventListener('submit', calculateAffordability);

    const transferForm = document.getElementById('transfer-cost-form');
    if (transferForm) transferForm.addEventListener('submit', calculateTransferCost);
});

// --- CALCULATOR FUNCTIONS ---
function calculateBondRepayment(event) {
    if(event) event.preventDefault();
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12;
    const term = parseFloat(document.getElementById('loan-term').value) * 12;
    const resultEl = document.getElementById('bond-repayment-result');
    if (amount > 0 && rate > 0 && term > 0) {
        const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        resultEl.innerHTML = `Estimated Monthly Repayment: <strong>R${monthlyPayment.toFixed(2)}</strong>`;
    } else { resultEl.innerHTML = 'Please enter valid numbers.'; }
}
function calculateAffordability(event) {
    if(event) event.preventDefault();
    const income = parseFloat(document.getElementById('gross-income').value);
    const expenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
    const resultEl = document.getElementById('affordability-result');
    if (income > 0) {
        const maxRepayment = (income - expenses) * 0.30;
        resultEl.innerHTML = `You can likely afford a monthly repayment of up to: <strong>R${maxRepayment.toFixed(2)}</strong>`;
    } else { resultEl.innerHTML = 'Please enter your gross monthly income.'; }
}
function calculateTransferCost(event) {
    if(event) event.preventDefault();
    const value = parseFloat(document.getElementById('property-value').value);
    const resultEl = document.getElementById('transfer-cost-result');
    if (value > 0) {
        let duty = 0;
        if (value > 1100000) {
            if (value <= 1375000) duty = (value - 1100000) * 0.03;
            else if (value <= 1925000) duty = 16500 + (value - 1375000) * 0.06;
            else if (value <= 2475000) duty = 41250 + (value - 1925000) * 0.08;
            else if (value <= 11000000) duty = 85250 + (value - 2475000) * 0.11;
            else duty = 933000 + (value - 11000000) * 0.13;
        }
        resultEl.innerHTML = `Estimated Transfer Duty (excl. fees): <strong>R${duty.toFixed(2)}</strong>`;
    } else { resultEl.innerHTML = 'Please enter a valid property value.'; }
}