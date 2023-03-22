import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';
import { useSetsStore } from '../../../../store/RootStore';
import { AddLandmarksSearch } from './AddLandmarksSearch';
import { Landmark } from './Landmark';
import { SetControls } from './SetControls/SetControls';

type SelectableProps = {
    $selected?: boolean;
}

const SetContainer = styled.div<SelectableProps>`
    display: flex;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0px 0px 10px ${props => props.$selected ? 'orange' : 'rgba(0, 0, 0, 0.5)'} ;
    align-items: center;
    cursor: pointer;
    max-width: 100%;
    `;

const LandmarksContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    gap: 5px;
    align-items: center;
    max-width: 80%;
    `;

type Props = {
    id: number;
    landmarks: number[];
    color?: string;
    visible?: boolean;
};

export const Set: FC<Props> = observer(({ landmarks, id }) => {

    const {
        selectSet,
        selectedSetId,
        removeLandmark,
        removeSet,
        copySet,
        isLandmarksAdditionMode,
        setIsLandmarksAdditionMode,
    } = useSetsStore();
    const selected = selectedSetId === id;

    return <SetContainer $selected={selected} onClick={() => selectSet(id)}>
        <LandmarksContainer>
            {landmarks.map(l => <Landmark key={l} value={l} removeLandmark={() => removeLandmark(id, l)} />)}
            {selected && isLandmarksAdditionMode && <AddLandmarksSearch setId={id} />}
        </LandmarksContainer>
        <SetControls
            isLandmarksAdditionMode={selected && isLandmarksAdditionMode}
            enableLandmarksAddition={() => {
                selectSet(id);
                return setIsLandmarksAdditionMode(true);
            }}
            copy={() => copySet(id)}
            remove={() => removeSet(id)}
        />
    </SetContainer>
})