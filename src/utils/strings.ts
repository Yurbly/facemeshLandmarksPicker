export const getNumbersFromCSVString = (input: string) => input
    .split(',')
    .map(v => Number(v.trim()))
    .filter((v, i, array) => v && !Number.isNaN(v) && array.indexOf(v) === i);