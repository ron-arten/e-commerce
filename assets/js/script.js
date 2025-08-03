'use strict';

// modal variables
const contactModal = document.querySelector('[data-modal="contact-modal"]');
const clientModal = document.querySelector('[data-modal="client-modal"]');
const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
const modalCloseOverlays = document.querySelectorAll('[data-modal-overlay]');
const shopNowBtns = document.querySelectorAll('.banner-btn');

// modal functions
const showContactModal = function() {
  contactModal.classList.add('active');
}

const showClientModal = function() {
  contactModal.classList.remove('active');
  clientModal.classList.add('active');
}

const showPreviousModal = function() {
  clientModal.classList.remove('active');
  contactModal.classList.add('active');
}

const closeAllModals = function() {
  contactModal.classList.remove('active');
  clientModal.classList.remove('active');
}

// modal event listeners
shopNowBtns.forEach(btn => {
  btn.addEventListener('click', showContactModal);
});

modalCloseBtns.forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

modalCloseOverlays.forEach(overlay => {
  overlay.addEventListener('click', closeAllModals);
});

// Expose functions to window for onclick handlers
window.showNextModal = showClientModal;
window.showPreviousModal = showPreviousModal;
window.closeAllModals = closeAllModals;





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}