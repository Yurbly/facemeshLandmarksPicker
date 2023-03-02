import { TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useSearchStore, useSetsStore } from '../../store/RootStore';

const SearchComponent = styled(TextField)`
     width: 100%;
 `;

export const Search = observer(() => {

    const { search, setSearch, setFocused } = useSearchStore();
    const { saveSet } = useSetsStore();

    return <SearchComponent
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
        onChange={(e) => setSearch(e.target.value)}
        InputLabelProps={{ shrink: true }}
        placeholder="Ex.: 1, 34, 252..."
        onKeyDown={e => e.code === "Enter" && saveSet()}
        onFocus={() => setFocused(true)}
        autoFocus
    />
}); 