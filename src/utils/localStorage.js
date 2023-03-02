const SETS_KEY = 'landmarksSets';

export const dumpSetsToLocalStorage = (item) => {
    const str = JSON.stringify(item);
    localStorage.setItem(SETS_KEY, str);
};

export const getSetsFromLocalStorage = () => {
    const str = localStorage.getItem(SETS_KEY);
    return JSON.parse(str);
};