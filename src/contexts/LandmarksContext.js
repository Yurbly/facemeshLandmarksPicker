import React, { useContext, useEffect, useRef, useState } from "react";
import CanvasController from "../canvasController/CanvasController";
import { getNumbersFromCSVString } from "../utils/strings";
import { arraysHaveSameItems } from "../utils/arrays";

const Context = React.createContext(null);

export const LandmarksContextProvider = ({ children }) => {

    const canvasRef = useRef(null);
    const [canvasController, setCanvasController] = useState(null);

    const [selectedWithSearch, setSelectedWithSearch] = useState([]);
    const [sets, setSets] = useState([]);
    const [selectedSetId, setSelectedSetId] = useState(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvasController = new CanvasController(canvasRef.current);
        setCanvasController(canvasController);
    }, [canvasRef.current]);

    //todo throttle search
    const findLandmarksByString = (input) => {
        if (!canvasController) return;
        deselectSet();
        if (!input || !input.length) canvasController.deselectAllBut();
        const numsToSelect = getNumbersFromCSVString(input);
        selectLandmarks(numsToSelect);
        setSelectedWithSearch(numsToSelect);
    };

    const selectLandmarks = (numsToSelect) => {
        if (!canvasController) return;
        canvasController.deselectAllBut(numsToSelect);
        numsToSelect.forEach(v => canvasController.selectLandmarkByNumber(v));
    }

    const saveSet = () => {
        const sameSet = sets.find(s => arraysHaveSameItems(s.landmarks, selectedWithSearch));
        if (sameSet) {
            return alert("Same set is already present");
        }
        const newSet = {
            id: new Date().getTime(),
            landmarks: selectedWithSearch,
            color: 'blue',
            visible: false,
        }
        setSets(sets => [...sets, newSet]);
    }

    const selectSet = (id) => {
        const selectedSet = sets.find(s => s.id === id);
        selectLandmarks(selectedSet.landmarks);
        setSelectedSetId(id);
    };


    const deselectSet = () => {
        setSelectedSetId(null);
        canvasController.deselectAllBut();
    };

    const removeSet = (id) => {
        setSets(sets => sets.filter(s => s.id !== id));
    }

    const state = {
        canvasRef,
        sets,
        selectedSetId,
    };

    const funcs = {
        findLandmarksByString,
        saveSet,
        removeSet,
        selectLandmarks,
        selectSet,
        deselectSet,
    }

    const value = {
        ...state,
        ...funcs,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLandmarksContext = () => useContext(Context);