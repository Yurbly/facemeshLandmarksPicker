import styled from 'styled-components';
import { useLandmarksContext } from '../../../contexts/LandmarksContext';
import { Set } from "./Set";
const SetsContainer = styled.div`
    border-radius: 6px;

    display: flex;
    flex-flow: column;
    gap: 10px;
`;

export default () => {

    const { sets, removeSet } = useLandmarksContext();

    if (!sets.length) return null;
    return <SetsContainer>
        {sets.map((set, i) => <Set key={set.id} remove={() => removeSet(set.id)} {...set}/>)}
    </SetsContainer>;
}; 