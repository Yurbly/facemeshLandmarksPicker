import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../consts/colors';
import { useCanvasStore } from '../../store/RootStore';

const CanvasComponent = styled.canvas`
  background-color: ${BACKGROUND_COLOR};
  height: 100vh;
`;

const Canvas = (props) => {

  const ref = useRef(null);
  const canvasStore = useCanvasStore();
  useEffect(() => {
    ref.current && canvasStore.initPaper(ref.current);
  }, [ref]);

  return <CanvasComponent ref={ref} {...props} id="canvas" resize="true" />;
};

export default Canvas;