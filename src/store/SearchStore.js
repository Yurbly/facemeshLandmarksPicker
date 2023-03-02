import { action, makeAutoObservable, reaction } from 'mobx';
import { getNumbersFromCSVString } from '../utils/strings';

export class SearchStore {

    canvasStore;
    selectedWithSearch = [];
    search = '';

    focused;

    constructor(canvasStore) {
        makeAutoObservable(this, {
            findLandmarksByString: action.bound,
            setSearch: action.bound,
            setFocused: action.bound,
        });
        this.canvasStore = canvasStore;
        reaction(() => this.search, search => this.findLandmarksByString(search));
        reaction(() => this.focused, () => this.findLandmarksByString(this.search));
    }

    findLandmarksByString(input) {
        if (!this.canvasStore.initialized) return;
        if (!input || !input.length) return this.canvasStore.deselectAllBut();
        const numsToSelect = getNumbersFromCSVString(input);
        const maxLandmarkNum = this.canvasStore.getLandmarksCount();
        const fitleredNumsToSelect = numsToSelect.filter(n => n < maxLandmarkNum);

        this.canvasStore.selectLandmarks(fitleredNumsToSelect);
        this.selectedWithSearch = fitleredNumsToSelect;
    };

    setSearch(input) {
        this.search = input;
    }

    setFocused(focused) {
            this.focused = focused;
    }

    addLandmarkToSearch(num) {
        if (!num || this.selectedWithSearch.includes('' + num)) return;
        this.search = `${this.search}${this.search ? ', ' : ''}${num}`;
    }
}


