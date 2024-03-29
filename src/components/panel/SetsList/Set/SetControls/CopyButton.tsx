import { FC } from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Props = {
    onClick(): void;   
}

export const CopyButton: FC<Props> = ({ onClick }) =>
    <IconButton
        title="Copy landmarks to clipboard"
        onClick={e => {
            e.stopPropagation();
            return onClick();
        }}
    >
        <ContentCopyIcon />
    </IconButton>; 