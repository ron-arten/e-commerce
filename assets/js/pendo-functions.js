// Sends a Pendo Track Event. Shared by the page scripts (script.js, sidebar.js
// and the inline scripts in pages/), so a missing or failing Pendo agent can
// never break the page. Properties without a value (undefined or null) are
// left out of the event.
function trackPendoEvent(eventName, properties) {
  if (!window.pendo || typeof window.pendo.track !== 'function') return;

  const eventProperties = {};
  Object.keys(properties || {}).forEach((key) => {
    const value = properties[key];
    if (value !== undefined && value !== null) eventProperties[key] = value;
  });

  try {
    window.pendo.track(eventName, eventProperties);
  } catch (err) {
    console.warn(`Pendo track "${eventName}" failed`, err);
  }
}

function updateVisitorMeta() {
  const visitorMetadata = { testMetaData: 'Only this one shows now' };
  const updatedFields = Object.keys(visitorMetadata).join(',');

  pendo.updateOptions({
    visitor: visitorMetadata,
  });

  // Pendo: timestamped change log of the visitor metadata this control sets
  trackPendoEvent('visitor_metadata_updated', {
    updated_fields: updatedFields,
    testMetaData: visitorMetadata.testMetaData,
  });
}

// program to generate random strings

// declare all characters
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomId(length) {
  let rand_string_id = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    rand_string_id += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return rand_string_id;
}

// Radom visitor Id generator
function changeVisitorId() {
  // getVisitorId exists once the Pendo agent has loaded (the stub lacks it)
  const previousVisitorId =
    typeof pendo.getVisitorId === 'function' ? pendo.getVisitorId() : undefined;
  const newVisitorId = `${randomId(10)}-visitor`;

  pendo.identify({
    visitor: {
      id: newVisitorId,
    },
  });

  // Pendo: identify starts a new visitor, so send both IDs to connect the
  // demo sessions before and after the switch
  trackPendoEvent('visitor_id_changed', {
    previous_visitor_id: previousVisitorId,
    new_visitor_id: newVisitorId,
    page_path: window.location.pathname,
  });
}
//Random account ID generator
function changeAccountId() {
  // getAccountId exists once the Pendo agent has loaded (the stub lacks it)
  const previousAccountId =
    typeof pendo.getAccountId === 'function' ? pendo.getAccountId() : undefined;
  const newAccountId = `${randomId(10)}-account`;

  pendo.identify({
    account: {
      id: newAccountId,
    },
  });

  // Pendo: send the previous and new account so the activity before and after
  // the switch can be traced
  trackPendoEvent('account_id_changed', {
    previous_account_id: previousAccountId,
    new_account_id: newAccountId,
    page_path: window.location.pathname,
  });
}
