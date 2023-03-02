import { Main } from './components/Main';
import { RootStoreProvider } from './store/RootStore';

export const App = () => {
    return (
        <RootStoreProvider>
            <Main />
        </RootStoreProvider>)
}; 