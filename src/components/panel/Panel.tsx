import styled from 'styled-components';
import SetsList from './SetsList/SetsList';
import { SaveButton } from './SaveButton';
import { Search } from './Search';
import { observer } from 'mobx-react-lite';

const PanelComponent = styled.aside`
    position: absolute;
    top: 0;
    right: 0;
    background: white;
    margin: 20px;
    padding: 5px 0 0;
    border-radius: 8px;

    display: flex;
    flex-flow: column;
    width: 30%;

    max-height: 90vh;
    overflow: hidden;
`;

const Header = styled.div`
    max-width: 100%;
    display: flex;
    gap: 10px;
    padding: 10px;
`;

export const Panel = () => <PanelComponent>
    <Header>
        <Search />
        <SaveButton />
    </Header>
    <SetsList />
</PanelComponent>; 