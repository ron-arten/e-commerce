'use strict';

(() => {
  const sidebar = document.querySelector('[data-adm-sidebar]');
  const toggleBtn = document.querySelector('[data-adm-toggle]');
  if (!sidebar || !toggleBtn) return;

  const parents = sidebar.querySelectorAll('[data-adm-parent]');

  const isExpanded = () => sidebar.classList.contains('is-expanded');

  const clearTransient = () => {
    parents.forEach((li) => {
      li.classList.remove('is-hover');
      li.style.removeProperty('--adm-y');
    });
  };

  const clearOpen = () => {
    parents.forEach((li) => {
      li.classList.remove('is-open');
      const btn = li.querySelector('.adm-link--parent');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  const setExpanded = (open) => {
    sidebar.classList.toggle('is-expanded', open);
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', open ? 'Collapse menu' : 'Expand menu');
    clearTransient();
    if (!open) clearOpen();
  };

  toggleBtn.addEventListener('click', () => {
    setExpanded(!isExpanded());
  });

  parents.forEach((li) => {
    const parentBtn = li.querySelector('.adm-link--parent');

    if (parentBtn) {
      parentBtn.addEventListener('click', (e) => {
        if (!isExpanded()) return;
        e.preventDefault();
        const willOpen = !li.classList.contains('is-open');
        clearOpen();
        if (willOpen) {
          li.classList.add('is-open');
          parentBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    li.addEventListener('mouseenter', () => {
      if (isExpanded()) return;
      const rect = li.getBoundingClientRect();
      li.style.setProperty('--adm-y', `${Math.max(0, rect.top)}px`);
      li.classList.add('is-hover');
    });

    li.addEventListener('mouseleave', () => {
      if (isExpanded()) return;
      li.classList.remove('is-hover');
    });

    li.addEventListener('focusin', () => {
      if (isExpanded()) return;
      const rect = li.getBoundingClientRect();
      li.style.setProperty('--adm-y', `${Math.max(0, rect.top)}px`);
      li.classList.add('is-hover');
    });

    li.addEventListener('focusout', (e) => {
      if (isExpanded()) return;
      if (!li.contains(e.relatedTarget)) li.classList.remove('is-hover');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isExpanded()) {
      setExpanded(false);
    } else {
      clearTransient();
    }
  });
})();
