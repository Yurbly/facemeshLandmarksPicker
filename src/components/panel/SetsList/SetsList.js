import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useSetsStore } from '../../../store/RootStore';
import { Set } from "./Set";

const SetsContainer = styled.div`
    border-radius: 6px;

    display: flex;
    flex-flow: column;
    gap: 10px;
    padding: 10px;
    overflow: auto;
`;

export default observer(() => {

    const { sets, removeSet } = useSetsStore();

    if (!sets.length) return null;
    return <SetsContainer>
        {sets.map((set, i) => <Set key={set.id} remove={() => removeSet(set.id)} {...set}/>)}
    </SetsContainer>;
}); 