import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLandmarksContext } from '../../../contexts/LandmarksContext';

export const RemoveButton = ({ onClick }) =>
    <IconButton
        onClick={e => {
            e.stopPropagation();
            return onClick();
        }}
    >
        <DeleteIcon />
    </IconButton>; 