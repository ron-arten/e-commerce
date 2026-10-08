'use strict';

// Pendo Track Events in this file go through trackPendoEvent (pendo-functions.js),
// which every page with the Pendo snippet loads. extension.html loads neither, so
// tracking is skipped there.

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

  // Pendo: a question sent to Ask Agora, typed in the composer (Enter) or picked
  // from the suggestions. Typed text isn't captured automatically, so the question
  // itself is the key data.
  const composerInput = panel.querySelector('.agora-panel__input');
  const suggestionBtns = panel.querySelectorAll('.agora-suggestion');
  const dataSourceLabel = panel.querySelector('.agora-panel__datasourceText strong');
  let lastTypedQuestion = '';

  const trackQuestion = (question, source) => {
    if (typeof trackPendoEvent !== 'function') return;

    // the data source label shown in the panel ("PMX:" -> "PMX")
    const dataSource = dataSourceLabel ? dataSourceLabel.textContent : '';
    trackPendoEvent('agora_question_submitted', {
      question_text: question.slice(0, 100),
      question_length: question.length,
      source,
      data_source: dataSource.replace(':', '').trim() || undefined,
      page_path: window.location.pathname,
    });
  };

  if (composerInput) {
    composerInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      const question = composerInput.value.trim();
      // pressing Enter again on an unchanged question doesn't send a new one
      if (!question || question === lastTypedQuestion) return;
      lastTypedQuestion = question;
      trackQuestion(question, 'typed');
    });
  }

  suggestionBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.detail > 1) return; // second click of a double-click
      trackQuestion(btn.textContent.trim(), 'suggestion');
    });
  });
})();

// Header product search. The same header is rendered on index.html and the
// sub-pages (forms, components, extension, nested, shadow), and this is the one
// script they all load.
(() => {
  const searchField = document.querySelector('.header-search-container .search-field');
  const searchBtn = document.querySelector('.header-search-container .search-btn');
  if (!searchField) return;

  let lastQuery = '';

  // Pendo: the typed query isn't captured automatically, so it is the core of
  // this event. Search doesn't return results yet; add results_count once it does.
  const submitSearch = (trigger) => {
    const query = searchField.value.trim();
    // an empty box or re-submitting the same query isn't a new search
    if (!query || query === lastQuery) return;
    lastQuery = query;

    if (typeof trackPendoEvent !== 'function') return;
    trackPendoEvent('product_search_submitted', {
      search_query: query.slice(0, 100),
      query_length: query.length,
      trigger,
      page_path: window.location.pathname,
    });
  };

  searchField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) submitSearch('enter');
  });

  if (searchBtn) searchBtn.addEventListener('click', () => submitSearch('button'));
})();

// Storefront display preferences: the currency/language selects in the shared
// header and, on index.html, the Language/Currency options of the mobile menu
// (links with data-preference).
(() => {
  const headerSelects = document.querySelectorAll('.header-top-actions select[name]');
  const mobileMenuOptions = document.querySelectorAll('[data-preference]');
  const currentValues = {};

  const setPreference = (type, value, source) => {
    const previousValue = currentValues[type];
    if (!value || value === previousValue) return;
    currentValues[type] = value;

    // a choice made in the mobile menu is reflected in the header select
    headerSelects.forEach((select) => {
      if (select.name === type) select.value = value;
    });

    // Pendo: the selected value isn't part of the auto-captured click data,
    // so send the previous and new values
    if (typeof trackPendoEvent !== 'function') return;
    trackPendoEvent('storefront_preference_changed', {
      preference_type: type,
      previous_value: previousValue,
      new_value: value,
      source,
      page_path: window.location.pathname,
    });
  };

  headerSelects.forEach((select) => {
    currentValues[select.name] = select.value;
    select.addEventListener('change', () => {
      setPreference(select.name, select.value, 'header_select');
    });
  });

  mobileMenuOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const { preference, preferenceValue } = option.dataset;
      setPreference(preference, preferenceValue, 'mobile_menu');
    });
  });
})();


