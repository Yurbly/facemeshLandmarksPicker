import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../consts/colors';
import { useLandmarksContext } from '../contexts/LandmarksContext';
import Canvas from './canvas/Canvas';
import { Panel } from './panel/Panel';

const MainComponent = styled.main`
    background-color: ${BACKGROUND_COLOR};
    position: relative;
`;

export const Main = () => {

    const { canvasRef } = useLandmarksContext();

    return (
        <MainComponent>
            <Canvas ref={canvasRef} />
            <Panel />
        </MainComponent>
    )
}; 