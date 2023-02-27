import { Main } from './components/Main';
import { LandmarksContextProvider, useLandmarksContext } from './contexts/LandmarksContext';

export const App = () => {
    return (<LandmarksContextProvider>
        <Main />
    </LandmarksContextProvider>)
}; 