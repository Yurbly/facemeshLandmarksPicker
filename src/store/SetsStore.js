import { action, makeAutoObservable, reaction } from 'mobx';
import {createContext, useContext} from "react";
import { arraysHaveSameItems } from '../utils/arrays';

export class SetsStore {

    sets = [];
    selectedSetId;

    constructor(searchStore, canvasStore) {
        this.searchStore = searchStore;
        this.canvasStore = canvasStore;
        makeAutoObservable(this, {
            saveSet: action.bound,
            selectSet: action.bound,
            deselectSet: action.bound,
            removeSet: action.bound,
        });
        reaction(() => this.searchStore.focused, (focused) => focused && this.deselectSet()); 
    }

    
    saveSet() {
        const { selectedWithSearch } = this.searchStore;
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
        this.sets.push(newSet);
    }

    selectSet(id) {
        const selectedSet = this.sets.find(s => s.id === id);
        this.canvasStore.selectLandmarks(selectedSet.landmarks);
        this.selectedSetId = id;
    };


    deselectSet() {
        this.selectedSetId = null;
        this.canvasStore.deselectAllBut();
    };

    removeSet(id) {
        const shouldRemove = confirm('Are you sure you want delete the set?');
        if (shouldRemove) this.sets = this.sets.filter(s => s.id !== id);
    }
}


