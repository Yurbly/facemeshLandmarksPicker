import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import { useSetsStore } from '../../store/RootStore';
import { observer } from 'mobx-react-lite';

export const SaveButton = observer(() => {

    const { saveSet } = useSetsStore();

    return <IconButton onClick={saveSet}><SaveIcon /></IconButton>
}); 