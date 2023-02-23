import styled from 'styled-components';
import Canvas from "./components/canvas/Canvas";
import { BACKGROUND_COLOR } from './consts/colors';

const Main = styled.main`
    background-color: ${BACKGROUND_COLOR};
`;

export const App = () => <Main>
    <Canvas width={500} height={500} />
</Main>; 