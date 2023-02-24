import {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import Canvas from "./components/canvas/Canvas";
import { BACKGROUND_COLOR } from './consts/colors';
import CanvasController from './canvasController/CanvasController';

const Main = styled.main`
    background-color: ${BACKGROUND_COLOR};
`;

export const App = () => {

    const canvasRef = useRef(null);
    const [canvasController, setCanvasController] = useState(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvasController = new CanvasController(canvasRef.current);
        setCanvasController(canvasController);
      }, [canvasRef.current]);

    return <Main>
        <Canvas ref={canvasRef} width={500} height={500} />
    </Main>;
}; 