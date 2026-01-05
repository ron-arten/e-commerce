'use strict';

(() => {
  const panel = document.querySelector('[data-agora-panel]');
  const toggleBtn = document.querySelector('[data-agora-toggle]');
  const overlay = document.querySelector('[data-overlay]');

  if (!panel || !toggleBtn || !overlay) return;

  const isOtherOverlayConsumerActive = () =>
    Boolean(document.querySelector('.mobile-navigation-menu.active, .sidebar.active'));

  const setOpen = (open) => {
    panel.classList.toggle('active', open);
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (open) {
      overlay.classList.add('active');
    } else if (!isOtherOverlayConsumerActive()) {
      overlay.classList.remove('active');
    }
  };

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(!panel.classList.contains('active'));
  });

  overlay.addEventListener('click', () => {
    if (panel.classList.contains('active')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('active')) setOpen(false);
  });
})();


