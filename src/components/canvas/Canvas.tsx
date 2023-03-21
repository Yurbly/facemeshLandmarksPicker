import { useRef, useEffect, HTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../consts/colors';
import { useCanvasStore } from '../../store/RootStore';

const CanvasComponent = styled.canvas<{ resize: string }>`
  background-color: ${BACKGROUND_COLOR};
  height: 100vh;
  width: 100vw;
`;

const Canvas = (props: HTMLAttributes<HTMLCanvasElement>) => {

  const ref = useRef(null);
  const canvasStore = useCanvasStore();
  useEffect(() => {
    ref.current && canvasStore.initPaper(ref.current);
  }, [ref]);

  return <CanvasComponent ref={ref} {...props} id="canvas" resize="true" />;
};

export default Canvas;