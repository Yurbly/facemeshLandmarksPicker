const SETS_KEY = 'landmarksSets';

export const dumpSetsToLocalStorage = (item: Object | Array<unknown>) => {
    const str = JSON.stringify(item);
    localStorage.setItem(SETS_KEY, str);
};

export const getSetsFromLocalStorage = () => {
    const str = localStorage.getItem(SETS_KEY);
    if (!str) return [];
    return JSON.parse(str);
};