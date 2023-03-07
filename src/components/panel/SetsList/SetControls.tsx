import { FC } from 'react';
import styled from 'styled-components';
import { CopyButton } from './CopyButton';
import { RemoveButton } from './RemoveButton';

const SetControlsComponent = styled.div`
    justify-self: flex-end;
`;

type Props = {
    remove(): void;
    copy(): void;
};

export const SetControls: FC<Props> = ({ remove, copy }) =>
    <SetControlsComponent>
        <CopyButton onClick={copy} />
        <RemoveButton onClick={remove} />
    </SetControlsComponent>; 