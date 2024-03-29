import { action, makeAutoObservable, reaction } from 'mobx';
import { arraysHaveSameItems } from '../utils/arrays';
import { dumpSetsToLocalStorage, getSetsFromLocalStorage } from '../utils/localStorage';
import { CanvasStore } from './CanvasStore/CanvasStore';
import { SearchStore } from './SearchStore';

type Set = {
    id: number;
    landmarks: number[];
    color: string;
    visible: boolean;
};

export class SetsStore {
    canvasStore: CanvasStore;
    searchStore: SearchStore;
    sets: Set[];
    selectedSetId?: number = undefined; //todo due to babel configuration fields should be initialized with some value
    isLandmarksAdditionMode = false;

    constructor(searchStore: SearchStore, canvasStore: CanvasStore) {
        this.searchStore = searchStore;
        this.canvasStore = canvasStore;

        const sets = getSetsFromLocalStorage();
        this.sets = sets || [];

        makeAutoObservable(this, {
            saveSet: action.bound,
            selectSet: action.bound,
            deselectSet: action.bound,
            removeSet: action.bound,
            removeLandmark: action.bound,
            copySet: action.bound,
            addSearchedLandmarksToSet: action.bound,
            setIsLandmarksAdditionMode: action.bound,
            addLandmarkToSelectedSet: action.bound,
            removeLandmarkFromSelectedSet: action.bound,
        });
        reaction(() => this.sets.map(s => ({...s, landmarks: [...s.landmarks]})), sets => dumpSetsToLocalStorage(sets));
    }
    
    saveSet() {
        const { selectedWithSearch } = this.searchStore;
        if (!selectedWithSearch || !selectedWithSearch.length) return;
        const sameSet = this.sets.slice().find(s => arraysHaveSameItems(s.landmarks, selectedWithSearch));
        if (sameSet) {
            return alert("Same set is already present");
        }
        const newSet = {
            id: new Date().getTime(),
            landmarks: selectedWithSearch,
            color: 'blue',
            visible: false,
        }
        this.sets.unshift(newSet);
    }
    
    selectSet(id: number) {
        const selectedSet = this.sets.find(s => s.id === id);
        if (!selectedSet) return;
        if (this.selectedSetId !== id) {
            this.setIsLandmarksAdditionMode(false);
            this.searchStore.resetEditionSearch();
        }
        this.canvasStore.selectLandmarks(selectedSet.landmarks);
        this.selectedSetId = id;
    };   
    
    deselectSet() {
        this.selectedSetId = undefined;
        this.canvasStore.deselectAllBut();
    };
    
    removeSet(id: number) {
        const shouldRemove = confirm('Are you sure you want delete the set?');
        if (shouldRemove) {
            const set = this.sets.find(s => s.id === id);
            set && this.deselectSet();
            this.sets = this.sets.filter(s => s.id !== id);
        }
    }
    
    removeLandmark(setId: number, landmark: number) {
        const setIndex = this.sets.findIndex(s => s.id === setId);
        if (this.sets[setIndex].landmarks.length === 1) return this.removeSet(this.sets[setIndex].id);
        this.sets[setIndex].landmarks = this.sets[setIndex].landmarks.filter(l => l !== landmark);
    }
    
    copySet(id: number) {
        const set = this.sets.find(s => s.id === id);
        if (!set) return;
        navigator.clipboard.writeText(set?.landmarks.join(', '));
    }
    
    addSearchedLandmarksToSet(id: number) {
        const { selectedWithSearch } = this.searchStore;
        if (!selectedWithSearch || !selectedWithSearch.length) return;
        const set = this.sets.find(s => s.id === id);
        if (!set) return;

        const filtered = selectedWithSearch.filter(l => !set.landmarks.includes(l));

        set.landmarks.push(...filtered);
        this.searchStore.resetEditionSearch();
    }

    addLandmarkToSelectedSet(landmark: number) {
        const set = this.sets.find(s => s.id === this.selectedSetId);
        if (!set) return;
        set.landmarks.push(landmark);
        this.canvasStore.selectLandmarks(set.landmarks);
    }

    removeLandmarkFromSelectedSet(landmark: number) {
        const set = this.sets.find(s => s.id === this.selectedSetId);
        if (!set) return;
        const index = set.landmarks.findIndex(l => l === landmark);
        set.landmarks.splice(index, 1);
        this.canvasStore.selectLandmarks(set.landmarks);
    }
    
    getSelectedSet() {
        return this.sets.find(s => s.id === this.selectedSetId);
    }

    setIsLandmarksAdditionMode(value: boolean) {
        this.isLandmarksAdditionMode = value
    }
}


