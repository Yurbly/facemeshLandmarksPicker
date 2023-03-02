import styled from 'styled-components';
import { RemoveButton } from './RemoveButton';

const SetControls = styled.div`
    justify-self: flex-end;
`;

export default ({remove}) => <SetControls><RemoveButton onClick={remove} /></SetControls>; 