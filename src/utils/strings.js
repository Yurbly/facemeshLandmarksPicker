export const getNumbersFromCSVString = (input) => input
    .split(',')
    .map(v => v.trim())
    .filter(v => v && Number.isInteger(+v))