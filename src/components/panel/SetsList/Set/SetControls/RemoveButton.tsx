import { FC } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    onClick(): void;   
}

export const RemoveButton: FC<Props> = ({ onClick }) =>
    <IconButton
        onClick={e => {
            e.stopPropagation();
            return onClick();
        }}
    >
        <DeleteIcon />
    </IconButton>; 