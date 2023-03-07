import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';
import { useSetsStore } from '../../../store/RootStore';
import { Landmark } from './Landmark';
import { SetControls } from './SetControls';

type SelectableProps = {
    selected?: boolean;
}

const SetContainer = styled.div<SelectableProps>`
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

type Props = {
    id: number;
    landmarks: number[];
    color?: string;
    visible?: boolean;
};

export const Set: FC<Props> = observer(({ landmarks, color, visible, id }) => {

    const { selectSet, selectedSetId, removeLandmark, removeSet, copySet } = useSetsStore();
    const selected = selectedSetId === id;

    return <SetContainer selected={selected} onClick={() => selectSet(id)}>
        <LandmarksContainer>
            {landmarks.map(l => <Landmark key={l} value={l} removeLandmark={() => removeLandmark(id, l)} />)}
        </LandmarksContainer>
        <SetControls
            copy={() => copySet(id)} 
            remove={() => removeSet(id)}
        />
    </SetContainer>
})