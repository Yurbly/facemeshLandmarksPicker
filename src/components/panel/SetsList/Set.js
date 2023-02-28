import styled from 'styled-components';
import { useLandmarksContext } from '../../../contexts/LandmarksContext';
import SetControls from './SetControls';

const SetContainer = styled.div`
    display: flex;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0px 0px 10px ${props => props.selected ? 'orange' : 'rgba(0, 0, 0, 0.5)'} ;
    align-items: center;
    cursor: pointer;
    `;

const LandmarksContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    gap: 5px;
    `;

const Landmark = styled.div`
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    height: fit-content;
    ${props => props.selected && 'background: red;'}
`;

export const Set = ({remove, landmarks, color, visible, id}) => {

    const { selectSet, selectedSetId } = useLandmarksContext();
    
    const selected = selectedSetId === id;
    console.log('selected', selectedSetId);

return <SetContainer selected={selected} onClick={() => selectSet(id)}>
        <LandmarksContainer>{landmarks.map(l => <Landmark key={l}>{l}</Landmark>)}</LandmarksContainer>
        <SetControls remove={remove} />
    </SetContainer>
}