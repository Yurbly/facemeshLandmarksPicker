import Paper from "paper";
import { PointText, Point, Path, Size } from "paper";
import { UVS, FACES } from '../geometryData';

const INIT_LANDMARK_COLOR = '#00ff00';
const HOVER_TOLERANCE = 10;
const LANDMARK_SIZE = 2;

const hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: HOVER_TOLERANCE,
};

const HOVER_SCALE = 2;

class CanvasController {

    canvasDimensions;
    landmarks = [];
    faces = [];

    constructor(canvas) {
        Paper.setup(canvas);
        const { width, height } = canvas.getBoundingClientRect();
        // canvas.width = height;
        // canvas.height = height;
        // Paper.view.viewSize = new Size(height, height);
        this.canvasDimensions = { width, height };
        this.minCanvasDimension = Math.min(width, height); 

        this.drawLandmarks();
        this.drawFaces();

        this.makeLandmarksHoverable();

        Paper.view.draw();
    }

    makeLandmarksHoverable = () => {
        Paper.view.onMouseMove = (e) => {
            const { point } = e;

            const result = Paper.project.hitTestAll(point, hitOptions);
            const landmarks = result?.filter(r => r.item.data.type === 'landmark');

            if (!landmarks?.length) {
                return this.deselectHoveredLandmark();
            }
            let minDist;
            let closest;
            landmarks.forEach(l => {
                if (!closest) closest = l.item;
                const dist = point.getDistance(l.item.position);
                if (!minDist || dist < minDist) {
                    closest = l.item;
                    minDist = dist;
                }
            });
            if (!closest) return;
            const isClosestAlreadyHoverd = this.hoveredLandmark && this.hoveredLandmark === closest;
            if (isClosestAlreadyHoverd) return;
            this.deselectHoveredLandmark();
            //todo here sometimes comes landmark with red fillcolor - wrong
            //this.hoveredLandmark is deleted, but the fillColor remains red 
            this.selectLandmark(closest);
        };
        Paper.view.onMouseLeave = () => this.deselectHoveredLandmark();
        Paper.view.onMouseEnter = () => this.deselectHoveredLandmark();
        // Paper.view.onClick = () => {
        //     const circ = new PointText(new Point(50, 50));
        //     circ.content = 'red';
        //     circ.tween({opacity: 1}, {opacity: 0}, 5000);
        // };
    }


    // onLandmarkHover(landmark) {
    //     this.markLandmark(landmark, 'red');
    //     this.hoveredLandmark = landmark;
    // }

    // markLandmark(landmark, color) {
    //     landmark.data.savedProperties = {
    //         fillColor: landmark.fillColor,
    //         scaling: landmark.scaling,
    //     }

    //     landmark.data.prevFillColor = landmark.fillColor;
    //     landmark.fillColor = color;
    //     landmark.tween(
    //         { scaling: landmark.scaling },
    //         { scaling: HOVER_SCALE },
    //         {
    //             duration: 150
    //         });
    //     landmark.data.scaled = true;
    //     landmark.data.label.opacity = 1;
    // }
    
    selectLandmarkByNumber(number) {
        const landmark = this.landmarks[number];
        this.selectLandmark(landmark);
    }
    
    selectLandmark(landmark) {
        if (!landmark) return;
        landmark.data.prevFillColor = landmark.fillColor;
        landmark.fillColor = 'red';
        landmark.tween(
            { scaling: landmark.scaling },
            { scaling: HOVER_SCALE },
            {
                duration: 150
            });
        landmark.data.scaled = true;
        landmark.data.label.opacity = 1;
        // landmark.data.label.tween({ opacity: 0 }, { opacity: 1 }, { duration: 150 });
        
        this.hoveredLandmark = landmark;
    }
    
    
    deselectHoveredLandmark = () => {
        if (!this.hoveredLandmark) return;
        this.deselectLandmark(this.hoveredLandmark);
        this.hoveredLandmark = null;
    }

    deselectLandmark(landmark) {
        landmark.fillColor = landmark.data.prevFillColor || INIT_LANDMARK_COLOR;
        landmark.data.prevFillColor = null;
        landmark.data.label.opacity = 0;
        // landmark.data.label.tween({ opacity: 1 }, { opacity: 0 }, { duration: 150 });
        if (landmark.data.scaled) {
            landmark.data.scaled = false;
            landmark.tween({ scaling: landmark.scaling }, { scaling: 1 }, { duration: 150 });
        }
    }

    deselectAllBut(landmarkNums) {
        const lmsToDeselect = this.landmarks
            .filter(lm => !landmarkNums
            .includes(lm.data.number))
            .forEach(lm => this.deselectLandmark(lm));
    }

    drawLandmarks = () => {
        UVS.forEach((uv, i) => {
            this.drawSingleLandmark(uv[0], uv[1], i);
        });

    };


    drawSingleLandmark = (xRel, yRel, number) => {
        const { width, height } = this.canvasDimensions;
        const x = xRel * this.minCanvasDimension;
        const y = yRel * this.minCanvasDimension;
        const point = new Point(x, y);
        const landmark = new Path.Circle({
            position: point,
            radius: LANDMARK_SIZE,
            applyMatrix: false
        }); 
        landmark.data.type = 'landmark';
        landmark.fillColor = INIT_LANDMARK_COLOR;
        landmark.sendToBack();

        this.addLandmarkLabel(landmark, number);
        
        this.landmarks.push(landmark);
    };

    addLandmarkLabel = (landmark, number) => {
        const point = landmark.position;
        const isLabelToLeft = point.x > Paper.view.size.width / 2;
        landmark.data.label = new PointText(point);
        landmark.data.label.content = number;
        const labelWidth = landmark.data.label.bounds.width;
        const labelX = isLabelToLeft ? point.x - labelWidth : point.x + 15;
        landmark.data.label.position.x = labelX;
        landmark.data.label.opacity = 0;
        landmark.data.number = number;
    }

    drawFaces = () => {
        const { landmarks } = this;
        if (!landmarks.length) {
            return console.error('Landmarks are not initialized');
        }
        for (let i = 0; i < FACES.length; i += 3) {
            const num1 = FACES[i];
            const num2 = FACES[i + 1];
            const num3 = FACES[i + 2];
            this.drawFaceByNums(num1, num2);
            this.drawFaceByNums(num1, num3);
            this.drawFaceByNums(num3, num2);
        }
    }

    drawFaceByNums(num1, num2) {
        const isFacePresent = this.faces.some(v => v.landmarks.includes(num1) && v.landmarks.includes(num2));
        if (isFacePresent) {
            return;
        }
        const position1 = this.landmarks[num1].position;
        const position2 = this.landmarks[num2].position;

        const item = new Paper.Path.Line(position1, position2);
        item.sendToBack();
        item.strokeColor = 'black';
        item.strokeWidth = 0.5;

        this.faces.push({
            landmarks: [num1, num2],
            item
        });
    }
}

export default CanvasController;