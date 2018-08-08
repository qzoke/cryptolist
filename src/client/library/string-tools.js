const endings = {
  '0': 'th',
  '1': 'st',
  '2': 'nd',
  '3': 'rd',
  '4': 'th',
  '5': 'th',
  '6': 'th',
  '7': 'th',
  '8': 'th',
  '9': 'th',
};

export function stringifyNumber(number) {
  let numberAsString = '' + number;
  let lastNumber = numberAsString[numberAsString.length - 1];
  let ending;
  if (number > 10 && number < 20) ending = 'th';
  else ending = endings[lastNumber];
  return numberAsString + ending;
}
