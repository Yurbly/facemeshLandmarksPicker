import { TextField } from '@mui/material';
import styled from 'styled-components';
import { useLandmarksContext } from '../../contexts/LandmarksContext';
import { useState } from 'react';

const SearchComponent = styled(TextField)`
     width: 100%;
     notchedOutline {
         border-color: #53af5b !important;
    }
 `;

export const Search = () => {

    const [search, setSearch] = useState('');
    const { findLandmarksByString, saveSet } = useLandmarksContext();

    return <TextField
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
        id="outlined-basic"
        label="Search landmarks"
        variant="outlined"
        value={search}
        onChange={(event) => {
            const { value } = event.target;
            setSearch(value);
            findLandmarksByString(value);
        }}
        InputLabelProps={{ shrink: true }}
        placeholder="1, 34, 252"
        onKeyDown={e => e.code === "Enter" && saveSet()}
        onFocus={() => findLandmarksByString(search)}
        autoFocus
    />
}; 