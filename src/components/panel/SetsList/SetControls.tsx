import { FC } from 'react';
import styled from 'styled-components';
import { RemoveButton } from './RemoveButton';

const SetControlsComponent = styled.div`
    justify-self: flex-end;
`;

type Props = {
    remove(): void;   
};

export const SetControls: FC<Props> = ({remove}) => <SetControlsComponent><RemoveButton onClick={remove} /></SetControlsComponent>; 