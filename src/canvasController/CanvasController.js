import Paper from "paper";
import { UVS, FACES } from '../geometryData';

const INIT_LANDMARK_COLOR = '#00ff00';

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
        this.drawLandmarks();
        this.drawFaces();

        Paper.view.draw();
    }

    drawLandmarks = () => {
        UVS.forEach(uv => {
            this.drawSingleLandmark(uv[0], uv[1]);
        });

    };


    drawSingleLandmark = (x, y) => {
        const { width, height } = this.canvasDimensions;
        const point = new Paper.Point(x * width, y * height);
        const item = new Paper.Path.Circle(point, 2);
        item.fillColor = INIT_LANDMARK_COLOR;
        item.onMouseEnter = () => {
            console.log('enter');
            item.fillColor = 'red';
        };
        item.onMouseLeave = () => {
            console.log('leave');
            item.fillColor = INIT_LANDMARK_COLOR;
        };
        item.onClick = () => {
            console.log('click');
            item.fillColor = 'red';
        };

        this.landmarks.push(item);
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
        item.strokeColor = 'black';
        item.strokeWidth = 0.5;
        // item.add(position1);
        // item.add(position2);

        this.faces.push({
            landmarks: [num1, num2],
            item
        });
    }
}

export default CanvasController;