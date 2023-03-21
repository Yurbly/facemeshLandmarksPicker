import { FC } from 'react';
import styled from 'styled-components';
import { AddButton } from './AddButton';
import { CopyButton } from './CopyButton';
import { RemoveButton } from './RemoveButton';

const SetControlsComponent = styled.div`
    justify-self: flex-end;
`;

type Props = {
    remove(): void;
    copy(): void;
    enableLandmarksAddition(): void;
    isLandmarksAdditionMode: boolean;
};

export const SetControls: FC<Props> = ({ remove, copy, enableLandmarksAddition, isLandmarksAdditionMode }) =>
    <SetControlsComponent>
        {!isLandmarksAdditionMode && <AddButton onClick={enableLandmarksAddition} />}
        <CopyButton onClick={copy} />
        <RemoveButton onClick={remove} />
    </SetControlsComponent>; 