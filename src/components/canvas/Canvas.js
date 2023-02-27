import { forwardRef, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../consts/colors';
import CanvasController from '../../canvasController/CanvasController';

const CanvasComponent = styled.canvas`
  background-color: ${BACKGROUND_COLOR};
  height: 100vh;
`;

const Canvas = forwardRef((props, ref) => <CanvasComponent ref={ref} {...props} id="canvas" resize="true" />);

export default Canvas;