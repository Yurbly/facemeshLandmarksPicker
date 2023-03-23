import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import styled from 'styled-components';
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from '@mui/material';
import { useCanvasStore } from '../../../../store/RootStore';

const LandmarkStyled = styled.div`
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    height: fit-content;
    position: relative;
`;

type RemoveButtonProps = {
    $visible?: boolean;
};

const RemoveButton = styled(IconButton)<RemoveButtonProps>`
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    padding: 0 !important;
    transform: translate(50%, -50%);
    ${props => !props.$visible && 'display: none !important;'}
    >svg {
        width: 14px;
        height: 14px;
    }
`;

type Props = {
    value: number;
    removeLandmark(): void;
};

export const Landmark: FC<Props> = observer(({ value, removeLandmark }) => {
    const [rmButtonVisible, setRmButtonVisible] = useState<boolean>(false);
    const { highlightLandmark, dehighlightLandmark } = useCanvasStore();

    const onMouseEnter = () => {
        highlightLandmark(value);
        setRmButtonVisible(true);
    };

    const onMouseLeave = () => {
        setRmButtonVisible(false);  
        dehighlightLandmark(); 
    };

    return <LandmarkStyled onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
        {value}
        <RemoveButton 
            title="Remove landmark"
            onClick={removeLandmark}
            $visible={rmButtonVisible}
        >
            <CancelIcon />
        </RemoveButton>
    </LandmarkStyled>
})