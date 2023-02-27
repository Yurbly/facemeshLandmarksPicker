import { TextField } from '@mui/material';
import { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useLandmarksContext } from '../../contexts/LandmarksContext';

const PanelComponent = styled.main`
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
`;

const Search = styled(TextField)`
    width: 100%;
`;

export const Panel = () => {

    const { search } = useLandmarksContext();

    return <PanelComponent>
        <Search
            id="outlined-basic"
            label="Search landmarks"
            variant="outlined"
            onChange={(event) => {
                search(event.target.value);
            }}
        />
    </PanelComponent>;
}; 