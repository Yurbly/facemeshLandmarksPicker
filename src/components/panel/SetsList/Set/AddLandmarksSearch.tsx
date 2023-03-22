import { TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';
import { useSearchStore, useSetsStore } from '../../../../store/RootStore';

const DEFAULT_INPUT_WIDTH = 50;

const LandmarksSearch = styled(TextField)`
    flex: 1;
    min-width: ${DEFAULT_INPUT_WIDTH}px !important;
    max-width: 100% !important;
`;

type Props = {
    setId: number;
};

export const AddLandmarksSearch: FC<Props> = observer(({ setId }) => {

    const { editionSearch, setEditionSearch } = useSearchStore();
    const { addSearchedLandmarksToSet } = useSetsStore();

    return  <LandmarksSearch
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
                onChange={e => setEditionSearch(e.target.value)}
                onKeyDown={e => e.code === "Enter" && addSearchedLandmarksToSet(setId)}
                value={editionSearch}
                autoFocus
            />
})