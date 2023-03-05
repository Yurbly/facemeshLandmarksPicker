import { action, makeAutoObservable, reaction } from 'mobx';
import { getNumbersFromCSVString } from '../utils/strings';
import { CanvasStore } from './CanvasStore/CanvasStore';

export class SearchStore {
    canvasStore: CanvasStore;
    selectedWithSearch: number[] = [];
    search = '';

    focused: boolean;

    constructor(canvasStore: CanvasStore) {
        makeAutoObservable(this, {
            findLandmarksByString: action.bound,
            setSearch: action.bound,
            setFocused: action.bound,
        });
        this.canvasStore = canvasStore;
        reaction(() => this.search, search => this.findLandmarksByString(search));
        reaction(() => this.focused, () => this.findLandmarksByString(this.search));
    }

    findLandmarksByString(input: string) {
        if (!this.canvasStore.viewInitialized) return;
        if (!input || !input.length) return this.canvasStore.deselectAllBut();
        const numsToSelect = getNumbersFromCSVString(input);
        const maxLandmarkNum = this.canvasStore.getLandmarksCount();
        const fitleredNumsToSelect = numsToSelect
            .filter(n => n < maxLandmarkNum)
            .map(n => +n);

        this.canvasStore.selectLandmarks(fitleredNumsToSelect);
        this.selectedWithSearch = fitleredNumsToSelect;
    };

    setSearch(input: string) {
        this.search = input;
    }

    setFocused(focused: boolean) {
            this.focused = focused;
    }

    addLandmarkToSearch(num: number) {
        if (!num || this.selectedWithSearch.includes(num)) return;
        this.search = `${this.search}${this.search ? ', ' : ''}${num}`;
    }
}


