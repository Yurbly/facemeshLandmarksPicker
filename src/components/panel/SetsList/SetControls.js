import styled from 'styled-components';
import { useLandmarksContext } from '../../../contexts/LandmarksContext';
import { RemoveButton } from './RemoveButton';

const SetControls = styled.div`
    justify-self: flex-end;
`;

export default ({remove}) => {

    return <SetControls><RemoveButton onClick={remove}/></SetControls>;
}; 