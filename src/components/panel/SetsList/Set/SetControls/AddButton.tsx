import { FC } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

type Props = {
    onClick(): void;   
}

export const AddButton: FC<Props> = ({ onClick }) =>
    <IconButton
        onClick={e => {
            e.stopPropagation();
            return onClick();
        }}
    >
        <AddIcon />
    </IconButton>; 