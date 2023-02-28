import { TextField } from '@mui/material';
import styled from 'styled-components';
import { useLandmarksContext } from '../../contexts/LandmarksContext';
import SetsList from './SetsList/SetsList';
import { SaveButton } from './SaveButton';

const PanelComponent = styled.aside`
    position: absolute;
    top: 0;
    right: 0;
    background: white;
    margin: 20px;
    padding: 10px;
    border-radius: 6px;

    display: flex;
    flex-flow: column;
    width: 30%;
    gap: 20px;
`;

const Search = styled(TextField)`
    width: 100%;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
`;

export const Panel = () => {

    const { findLandmarks, saveSet } = useLandmarksContext();

    return <PanelComponent>
        <Header>
            <Search
                id="outlined-basic"
                label="Search landmarks"
                variant="outlined"
                onChange={(event) => {
                    findLandmarks(event.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                placeholder="1, 34, 252"
                onKeyDown={e => {
                    console.log(e);
                    return e.code === "Enter" && saveSet();
                }}
                autoFocus
            />
            <SaveButton />
        </Header>
        <SetsList/>
    </PanelComponent>;
}; 