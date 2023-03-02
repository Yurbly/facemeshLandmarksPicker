import { createContext, useContext } from "react";
import CanvasStore from "./CanvasStore/CanvasStore";
import { SearchStore } from './SearchStore';
import { SetsStore } from './SetsStore';

const RootStoreContext = createContext(null);

class RootStore {
    search;
    canvas;

    constructor() {
        this.canvas = new CanvasStore();
        this.search = new SearchStore(this.canvas);
        this.sets = new SetsStore(this.search, this.canvas);
    }

    init() {
        this.canvas.init(this.search);
    }
}

const rootStore = new RootStore();
rootStore.init();

export const RootStoreProvider = ({ children }) => (<RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>);

export const useRootStore = () => {
    const context = useContext(RootStoreContext)
    if (context === undefined) {
        throw new Error("useRootStore must be used within RootStoreProvider")
    }

    return context;
}

export const useSearchStore = () => useRootStore().search;
export const useSetsStore = () => useRootStore().sets;
export const useCanvasStore = () => {
    const root = useRootStore();
    return root.canvas;
};