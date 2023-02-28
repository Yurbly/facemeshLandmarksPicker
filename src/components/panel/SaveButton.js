import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import { useLandmarksContext } from '../../contexts/LandmarksContext';

export const SaveButton = () => {

    const { saveSet } = useLandmarksContext();

    return <IconButton onClick={saveSet}><SaveIcon /></IconButton>
}; 