import React, { useContext, useEffect, useRef, useState } from "react";
import CanvasController from "../canvasController/CanvasController";
import { getNumbersFromCSVString } from "../utils/strings";

const Context = React.createContext(null);

export const LandmarksContextProvider = ({ children }) => {

    const canvasRef = useRef(null);
    const [canvasController, setCanvasController] = useState(null);

    const [selectedWithSearch, setSelectedWithSearch] = useState([]);
    const [sets, setSets] = useState([]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvasController = new CanvasController(canvasRef.current);
        setCanvasController(canvasController);
    }, [canvasRef.current]);

    //todo throttle search
    const findLandmarks = (input) => {
        if (!canvasController) return;
        const  numsToSelect = getNumbersFromCSVString(input);
        canvasController.deselectAllBut(numsToSelect);
        numsToSelect.forEach(v => canvasController.selectLandmarkByNumber(v));
        setSelectedWithSearch(numsToSelect);
    };

    const saveSet = () => {
        const newSet = {
            id: new Date().getTime(),
            landmarks: selectedWithSearch,
            color: 'blue',
            visible: false,
        }
        setSets(sets => [...sets, newSet]);
    }

    const removeSet = (num) => {
        setSets(sets => sets.filter((s, i) => i !== num));
    }

    const state = {
        canvasRef,
        sets,
    };
    
    const funcs = {
        findLandmarks,
        saveSet,
        removeSet,
    }

    const value = { 
        ...state,
        ...funcs,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLandmarksContext = () => useContext(Context);