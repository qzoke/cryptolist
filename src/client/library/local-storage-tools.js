let tempStorage = {};
const hasLocalStorage = testLocalStorage();

export const setItem = (item, value) => {
  if (hasLocalStorage) {
    localStorage.setItem(item, value);
  } else {
    tempStorage[item] = value;
  }
};

export const getItem = item => {
  if (hasLocalStorage) {
    return localStorage.getItem(item);
  } else {
    return tempStorage[item];
  }
};

function testLocalStorage() {
  var test = 'test123';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
