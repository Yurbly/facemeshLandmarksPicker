export const getNumbersFromCSVString = (input) => input
    .split(',')
    .map(v => v.trim())
    .filter((v, i, array) => v && Number.isInteger(+v) && array.indexOf(v) === i);