'use strict';

// modal variables
const contactModal = document.querySelector('[data-modal="contact-modal"]');
const clientModal = document.querySelector('[data-modal="client-modal"]');
const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
const modalCloseOverlays = document.querySelectorAll('[data-modal-overlay]');
const shopNowBtns = document.querySelectorAll('.banner-btn');
const contactForm = document.querySelector('#contact-form');
const clientForm = document.querySelector('#client-form');

// Pendo: the current run through the onboarding modal (reset when it opens)
const onboarding = {
  entryPoint: 'unknown',
  openedAt: null,
  usedBackButton: false,
  contactInfoTracked: false,
  completedTracked: false,
};

// trimmed value of a named form field ('' when it is empty or missing)
const getFieldValue = function(form, name) {
  const field = form ? form.elements[name] : null;
  return field ? field.value.trim() : '';
}

// every .banner-btn opens the modal: the "Shop now" banners, but also the
// Pendo demo controls in the header
const getOnboardingEntryPoint = function(btn) {
  if (btn && btn.closest('.banner-content')) return 'shop_now_banner';
  if (btn && btn.closest('.header-top')) return 'demo_control';
  return 'unknown';
}

// modal functions
const showContactModal = function(e) {
  onboarding.entryPoint = getOnboardingEntryPoint(e ? e.currentTarget : null);
  onboarding.openedAt = Date.now();
  onboarding.usedBackButton = false;
  onboarding.contactInfoTracked = false;
  onboarding.completedTracked = false;

  contactModal.classList.add('active');
}

const showClientModal = function() {
  contactModal.classList.remove('active');
  clientModal.classList.add('active');

  // Pendo: step 1 (Contact Information) completed, once per run. "Next" is
  // type="button", so required fields aren't enforced: send completeness
  // flags instead of the personal data
  if (onboarding.contactInfoTracked) return;
  onboarding.contactInfoTracked = true;

  const requiredFields = contactForm
    ? Array.from(contactForm.querySelectorAll('[required]'))
    : [];

  trackPendoEvent('contact_information_submitted', {
    country: getFieldValue(contactForm, 'country'),
    has_full_name: getFieldValue(contactForm, 'fullName') !== '',
    has_phone: getFieldValue(contactForm, 'phone') !== '',
    fields_completed: requiredFields.filter(field => field.value.trim() !== '').length,
    form_valid: contactForm ? contactForm.checkValidity() : false,
    entry_point: onboarding.entryPoint,
  });
}

const showPreviousModal = function() {
  clientModal.classList.remove('active');
  contactModal.classList.add('active');
  onboarding.usedBackButton = true;
}

const closeAllModals = function() {
  contactModal.classList.remove('active');
  clientModal.classList.remove('active');
}

// "Done" completes the onboarding; the X buttons and the overlay only close
// (abandon) it
const completeOnboarding = function() {
  if (!onboarding.completedTracked) {
    onboarding.completedTracked = true;

    const contactCountry = getFieldValue(contactForm, 'country');
    const incorporationCountry = getFieldValue(clientForm, 'incorporationCountry');
    const companyName = getFieldValue(clientForm, 'companyName');
    const contactFormValid = contactForm ? contactForm.checkValidity() : false;
    const clientFormValid = clientForm ? clientForm.checkValidity() : false;

    // Pendo: one event describing the whole onboarding (step 1 + step 2);
    // the registration number is sent as a flag, not its value
    trackPendoEvent('client_onboarding_completed', {
      contact_country: contactCountry,
      incorporation_country: incorporationCountry,
      same_country: contactCountry !== '' && contactCountry === incorporationCountry,
      company_name: companyName.slice(0, 50),
      has_company_name: companyName !== '',
      has_registration_number: getFieldValue(clientForm, 'registrationNumber') !== '',
      form_valid: contactFormValid && clientFormValid,
      used_back_button: onboarding.usedBackButton,
      entry_point: onboarding.entryPoint,
      duration_ms: onboarding.openedAt ? Date.now() - onboarding.openedAt : undefined,
    });
  }

  closeAllModals();
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
window.completeOnboarding = completeOnboarding;





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener (the toast markup is commented out in
// index.html: without this guard the null button throws and stops the rest)
if (notificationToast && toastCloseBtn) {
  toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
  });
}





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





// cart & wishlist variables
const cartCountBadges = document.querySelectorAll(
  '.action-btn > ion-icon[name="bag-handle-outline"] ~ .count'
);
const wishlistCountBadges = document.querySelectorAll(
  '.action-btn > ion-icon[name="heart-outline"] ~ .count'
);
const addToCartBtns = document.querySelectorAll('.add-cart-btn');
const addToCartIcons = document.querySelectorAll(
  '.showcase-actions .btn-action > ion-icon[name="bag-add-outline"]'
);
const addToWishlistIcons = document.querySelectorAll(
  '.showcase-actions .btn-action > ion-icon[name="heart-outline"]'
);
const wishlistedProducts = new Set();
let cartItemCount = 0;

// text of the first match for selector inside a .showcase card ('' if missing)
const getShowcaseText = function(card, selector) {
  const el = card.querySelector(selector);
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

// "$1990.00" -> 1990, "already sold: 20" -> 20 (undefined when there is no number)
const parseNumber = function(text) {
  const value = parseFloat(text.replace(/[^0-9.]/g, ''));
  return Number.isNaN(value) ? undefined : value;
}

const getShowcaseSection = function(card) {
  if (card.closest('.product-featured')) return 'deal_of_the_day';
  if (card.closest('.product-main')) return 'new_products';
  return 'other';
}

// product shown on a .showcase card. The cart and wishlist buttons are
// identical icon buttons, so these details tell the products apart in Pendo
const getShowcaseProduct = function(card) {
  return {
    name: getShowcaseText(card, '.showcase-title'),
    category: getShowcaseText(card, '.showcase-category') || undefined,
    price: parseNumber(getShowcaseText(card, '.price')),
    originalPrice: parseNumber(getShowcaseText(card, '.price-box del')),
    badge: getShowcaseText(card, '.showcase-badge') || undefined,
    section: getShowcaseSection(card),
  };
}

// "already sold: 20" / "available: 40" rows of the Deal of the day cards
// (undefined on other cards)
const getDealUnits = function(card, label) {
  const row = Array.from(card.querySelectorAll('.showcase-status p'))
    .find(p => p.textContent.trim().toLowerCase().startsWith(label));
  return row ? parseNumber(row.textContent) : undefined;
}

// adds the product on the clicked card to the cart and updates the bag badges
const addToCart = function() {
  const card = this.closest('.showcase');
  if (!card) return;

  cartItemCount++;
  cartCountBadges.forEach(badge => {
    badge.textContent = cartItemCount;
  });

  // Pendo: fired once the item is in the cart, with the product read from its card
  const product = getShowcaseProduct(card);
  trackPendoEvent('product_added_to_cart', {
    product_name: product.name,
    product_category: product.category,
    price: product.price,
    original_price: product.originalPrice,
    discount_badge: product.badge,
    source_section: product.section,
    cart_item_count: cartItemCount,
    deal_units_available: getDealUnits(card, 'available'),
    deal_units_sold: getDealUnits(card, 'already sold'),
  });
}

// saves the product on the clicked card to the wishlist (once per product)
// and updates the heart badges
const addToWishlist = function() {
  const card = this.closest('.showcase');
  if (!card || wishlistedProducts.has(card)) return;

  wishlistedProducts.add(card);
  wishlistCountBadges.forEach(badge => {
    badge.textContent = wishlistedProducts.size;
  });

  // Pendo: fired once the item is saved, with the product read from its card
  const product = getShowcaseProduct(card);
  trackPendoEvent('product_added_to_wishlist', {
    product_name: product.name,
    product_category: product.category,
    price: product.price,
    original_price: product.originalPrice,
    discount_badge: product.badge,
    source_section: product.section,
    wishlist_item_count: wishlistedProducts.size,
  });
}

// cart & wishlist event listeners
addToCartBtns.forEach(btn => {
  btn.addEventListener('click', addToCart);
});

addToCartIcons.forEach(icon => {
  icon.parentElement.addEventListener('click', addToCart);
});

addToWishlistIcons.forEach(icon => {
  icon.parentElement.addEventListener('click', addToWishlist);
});