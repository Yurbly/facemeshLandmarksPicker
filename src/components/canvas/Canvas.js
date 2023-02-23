import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../consts/colors';
import CanvasController from '../../canvasController/CanvasController';

const CanvasComponent = styled.canvas`
  background-color: ${BACKGROUND_COLOR};
`;

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasController = new CanvasController(canvas);
  }, []);
  
  return <CanvasComponent ref={canvasRef} {...props} id="canvas" style={{height: '100vh'}} />
}

export default Canvas;