import { Main } from './components/Main';
import { RootStore, RootStoreContext } from './store/RootStore';

const rootStore = new RootStore();
rootStore.init();

export const App = () => {
    return (
        <RootStoreContext.Provider value={rootStore}>
            <Main />
        </RootStoreContext.Provider>)
}; 