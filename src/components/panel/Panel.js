import styled from 'styled-components';
import SetsList from './SetsList/SetsList';
import { SaveButton } from './SaveButton';
import { Search } from './Search';

const PanelComponent = styled.aside`
    position: absolute;
    top: 0;
    right: 0;
    background: white;
    margin: 20px;
    padding: 10px;
    border-radius: 6px;

    display: flex;
    flex-flow: column;
    width: 30%;
    gap: 20px;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
`;

export const Panel = () => {

    return <PanelComponent>
        <Header>
            <Search />
            <SaveButton />
        </Header>
        <SetsList />
    </PanelComponent>;
}; 