import Paper from "paper";
import { Point, Path, Size } from "paper";
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
        canvas.width = height;
        canvas.height = height;
        Paper.view.viewSize = new Paper.Size(height, height);
        this.canvasDimensions = { width, height };
        this.landmarksPath = new Paper.Path();

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
                return this.deselectLandmark();
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
            this.deselectLandmark();
            //todo here sometimes comes landmark with red fillcolor - wrong
            //this.hoveredLandmark is deleted, but the fillColor remains red 
            this.selectLandmark(closest);
        };
        Paper.view.onMouseLeave = () => this.deselectLandmark();
        Paper.view.onMouseEnter = () => this.deselectLandmark();
    }

    selectLandmark(landmark) {
        landmark.data.prevFillColor = landmark.fillColor;
        landmark.fillColor = 'red';
        landmark.tween(
            { scaling: landmark.scaling },
            { scaling: HOVER_SCALE },
            {
                duration: 150
            });
            landmark.data.scaled = true;
            
            this.hoveredLandmark = landmark;
        }
        
    deselectLandmark = () => {
        if (!this.hoveredLandmark) return;
        this.hoveredLandmark.fillColor = this.hoveredLandmark.data.prevFillColor || INIT_LANDMARK_COLOR;
        this.hoveredLandmark.data.prevFillColor = null;
        if (this.hoveredLandmark.data.scaled) {
            this.hoveredLandmark.data.scaled = false;
            this.hoveredLandmark.tween({ scaling: this.hoveredLandmark.scaling }, { scaling: 1 }, { duration: 150 })
        }
        this.hoveredLandmark = null;
    }

    drawLandmarks = () => {
        UVS.forEach(uv => {
            this.drawSingleLandmark(uv[0], uv[1]);
        });

    };


    drawSingleLandmark = (xRel, yRel) => {
        const { width, height } = this.canvasDimensions;
        const x = xRel * width;
        const y = yRel * height;
        const point = new Paper.Point(x, y);
        const landmark = new Paper.Path.Circle({
            position: point,
            radius: LANDMARK_SIZE,
            applyMatrix: false
        });
        landmark.data.type = 'landmark';
        landmark.fillColor = INIT_LANDMARK_COLOR;

        this.landmarks.push(landmark);
    };

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