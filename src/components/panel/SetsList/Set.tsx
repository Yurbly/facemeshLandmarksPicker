import { TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { useSearchStore, useSetsStore } from '../../../store/RootStore';
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
    align-items: center;
    `;

const LandmarksSearch = styled(TextField)`
    flex: 1;
    min-width: 100px;
`;

type Props = {
    id: number;
    landmarks: number[];
    color?: string;
    visible?: boolean;
};

export const Set: FC<Props> = observer(({ landmarks, color, visible, id }) => {

    const [isLandmarksAdditionMode, setIsLandmarksAdditionMode] = useState<boolean>(false);
    const { editionSearch, setEditionSearch } = useSearchStore();
    const { selectSet, selectedSetId, removeLandmark, removeSet, copySet, addSearchedLandmarksToSet } = useSetsStore();
    const selected = selectedSetId === id;

    return <SetContainer selected={selected} onClick={() => selectSet(id)}>
        <LandmarksContainer>
            {landmarks.map(l => <Landmark key={l} value={l} removeLandmark={() => removeLandmark(id, l)} />)}
            {isLandmarksAdditionMode && <LandmarksSearch
                sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                            borderColor: "orange",
                        }
                    },
                    "& .MuiInputLabel-outlined.Mui-focused": {
                        color: 'orange'
                    },
                }}
                size="small"
                onBlur={() => setIsLandmarksAdditionMode(false)}
                onChange={e => setEditionSearch(e.target.value)}
                onKeyDown={e => e.code === "Enter" && addSearchedLandmarksToSet(id)}
                value={editionSearch}
                autoFocus
            />}
        </LandmarksContainer>
        <SetControls
            isLandmarksAdditionMode={isLandmarksAdditionMode}
            enableLandmarksAddition={() => {
                selectSet(id);
                return setIsLandmarksAdditionMode(true);
            }}
            copy={() => copySet(id)}
            remove={() => removeSet(id)}
        />
    </SetContainer>
})