import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../consts/colors';
import Canvas from './canvas/Canvas';
import { Info } from './info/Info';
import { Panel } from './panel/Panel';

const MainComponent = styled.main`
    background-color: ${BACKGROUND_COLOR};
    position: relative;
    overflow: hidden;
    height: 100vh;
`;

export const Main = () => {

    return (
        <MainComponent>
            <Canvas />
            <Panel />
            <Info />
        </MainComponent>
    )
}; 