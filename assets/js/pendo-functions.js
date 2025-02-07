function updateVisitorMeta() {
  pendo.updateOptions({
    visitor: { testMetaData: 'Only this one shows now' },
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
  pendo.identify({
    visitor: {
      id: `${randomId(10)}-visitor`,
    },
  });
}
//Random account ID generator
function changeAccountId() {
  pendo.identify({
    account: {
      id: `${randomId(10)}-account`,
    },
  });
}
