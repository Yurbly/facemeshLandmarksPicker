import styled from 'styled-components';
import { useLandmarksContext } from '../../../contexts/LandmarksContext';
import SetControls from './SetControls';

const SetsContainer = styled.div`
    border-radius: 6px;

    display: flex;
    flex-flow: column;
    gap: 10px;
`;

const SetContainer = styled.div`
    display: flex;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
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
`;

const Set = ({remove, landmarks, color, visible}) => {
    return <SetContainer>
        <LandmarksContainer>{landmarks.map(l => <Landmark key={l}>{l}</Landmark>)}</LandmarksContainer>
        <SetControls remove={remove} />
    </SetContainer>
}

export default () => {

    const { sets, removeSet } = useLandmarksContext();

    if (!sets.length) return null;
    return <SetsContainer>
        {sets.map((set, i) => <Set key={set.id} remove={() => removeSet(i)} {...set}/>)}
    </SetsContainer>;
}; 