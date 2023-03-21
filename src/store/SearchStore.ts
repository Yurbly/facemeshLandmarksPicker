import { action, makeAutoObservable, reaction } from 'mobx';
import { getNumbersFromCSVString } from '../utils/strings';
import { CanvasStore } from './CanvasStore/CanvasStore';
import { SetsStore } from './SetsStore';

export class SearchStore {
    canvasStore: CanvasStore;
    setsStore: SetsStore;
    selectedWithSearch: number[] = [];
    search = '';
    editionSearch = '';

    focused?: boolean = undefined; //todo due to babel configuration fields should be initialized with some value

    constructor(canvasStore: CanvasStore) {
        makeAutoObservable(this, {
            findLandmarksByString: action.bound,
            setSearch: action.bound,
            setFocused: action.bound,
            setEditionSearch: action.bound,
        });
        this.canvasStore = canvasStore;
        reaction(() => this.search, search => this.findLandmarksByString(search));
        reaction(() => this.editionSearch, editionSearch => this.findLandmarksByString(editionSearch));
        reaction(() => this.focused, focused => {
            this.setsStore.deselectSet();
            focused && this.findLandmarksByString(this.search);
        });
    }

    init(setsStore: SetsStore) {
        this.setsStore = setsStore;
    }

    findLandmarksByString(input: string) {
        if (!this.canvasStore.viewInitialized) return;
        const selectedSet = this.setsStore.getSelectedSet();
        if (!input || !input.length) {
            this.selectedWithSearch = [];
            this.canvasStore.deselectAllBut(selectedSet?.landmarks);
            return 
        }
        const numsToSelect = getNumbersFromCSVString(input);
        const maxLandmarkNum = this.canvasStore.getLandmarksCount();
        const fitleredNumsToSelect = numsToSelect
            .filter(n => n < maxLandmarkNum)
            .map(n => +n);
        
        const allNumsToSelect = fitleredNumsToSelect.slice();
        selectedSet && allNumsToSelect.push(...selectedSet.landmarks);

        this.canvasStore.selectLandmarks(allNumsToSelect);
        this.selectedWithSearch = fitleredNumsToSelect;
    };

    setSearch(input: string) {
        this.search = input;
    }

    setEditionSearch(input: string) {
        this.editionSearch = input;
    }

    setFocused(focused: boolean) {
            this.focused = focused;
    }

    addLandmarkToSearch(num: number) {
        if (!num || this.selectedWithSearch.includes(num)) return;
        this.search = `${this.search}${this.search ? ', ' : ''}${num}`;
    }

    removeLandmarkFromSearch(num: number) {
        if (!num || !this.selectedWithSearch.includes(num)) return;
        this.search = this.search.split(',').filter(v => v.trim() !== num.toString()).join(',');
    }

    resetEditionSearch() {
        this.editionSearch = '';
    }
}