import { createContext, useContext } from "react";
import { CanvasStore } from "./CanvasStore/CanvasStore";
import { SearchStore } from './SearchStore';
import { SetsStore } from './SetsStore';

export class RootStore {
    search: SearchStore;
    canvas: CanvasStore;
    sets: SetsStore;

    constructor() {
        this.canvas = new CanvasStore();
        this.search = new SearchStore(this.canvas);
        this.sets = new SetsStore(this.search, this.canvas);
    }

    init() {
        this.canvas.init(this.search);
    }
}

export const RootStoreContext = createContext<RootStore | null>(null);

export const useRootStore = () => {
    const context = useContext(RootStoreContext);
    if (context === undefined) {
        throw new Error("useRootStore must be used within RootStoreProvider")
    }

    return context;
}

const getStore = (name: keyof RootStore) => {
    const root = useRootStore();
    if (!root) throw new Error('Root store is not initialized');
    return root[name];
}

// export const useSearchStore = () => useRootStore().search;
// export const useSetsStore = () => useRootStore().sets;
// export const useCanvasStore = () => {
//     const root = useRootStore();
//     if (!root) throw new Error('Root store is not initialized');
//     return root.canvas;
// };
export const useSearchStore = () => getStore('search') as SearchStore;
export const useSetsStore = () => getStore('sets') as SetsStore;
export const useCanvasStore = () => getStore('canvas') as CanvasStore;