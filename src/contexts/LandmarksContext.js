import React, { useContext, useEffect, useRef, useState } from "react";
import CanvasController from "../canvasController/CanvasController";

const Context = React.createContext(null);

export const LandmarksContextProvider = ({ children }) => {

    const canvasRef = useRef(null);
    const [canvasController, setCanvasController] = useState(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvasController = new CanvasController(canvasRef.current);
        setCanvasController(canvasController);
    }, [canvasRef.current]);

    //todo throttle search
    const search = (input) => {
        if (!canvasController) return;
        const  numsToSelect = input
        .split(',')
        .map(v => v.trim())
        .filter(v => v && Number.isInteger(+v));
        canvasController.deselectAllBut(numsToSelect);
        numsToSelect.forEach(v => canvasController.selectLandmarkByNumber(v));
    }

    const value = { 
        search,
        canvasRef,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLandmarksContext = () => useContext(Context);