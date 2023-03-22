import { FC, useState } from "react";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";

const InfoIconButton = styled(IconButton)`
    position: absolute !important;
    top: 10px !important;
    left: 10px !important;
`;

const InfoContainer = styled.div`
    position: absolute !important;
    top: 0;
    left: 0;
    background: white;
    margin: 20px;
    padding: 15px 15px;
    border-radius: 8px;

    display: flex;
    flex-flow: column;
    width: 30%;

    max-height: 90vh;
    overflow: hidden;

    min-height: 200px;
`;

const Header = styled.h3`
    display: flex;
    justify-content: center;  
`;

export const Info: FC = () => {

    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);


    if(!isInfoOpen) return <InfoIconButton title="Help" onClick={() => setIsInfoOpen(true)}><QuestionMarkIcon/></InfoIconButton>;

    return <InfoContainer>
        <Header>Welcome to facemesh landmarks picker!</Header>
        <InfoIconButton title="Close help" onClick={() => setIsInfoOpen(false)}><CloseIcon/></InfoIconButton>

        <ul>
            <li>Find landmarks using search bar in the right top corner. If the landmark is found it will be highlighted on the canvas.</li>
            <li>Found landmarks can be saved to set by pressing enter or clicking a save button near the search bar</li>
            <li>Set can be selected by clicking on it. The landmarks of this set are highlighted on the canvas</li>
            <li>
                Landmark sets can be edited:
                <ul>
                    <li>add landmarks(click on plus button on a set)</li>    
                    <li>remove landmarks(click on cross button that appears on landmark number hover)</li>    
                </ul> 
            </li>
            <li>Add or remove landmarks by clicking on them on the canvas. The landmark is added/removed to/from 
                <ul>
                    <li>the search bar if it is active</li>    
                    <li>the set if it is selected</li>    
                    <li>the set edition bar if set edition is active</li>    
                </ul> 
            </li>
        </ul>
    </InfoContainer>
};