import { action, makeObservable } from "mobx";
import Paper, { PointText, Point, Path, Size } from "paper";
import { UVS, FACES } from '../../geometryData';
import { SearchStore } from '../SearchStore';
import SelectingCircle from "./SelectingCircle";

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

export type CanvasDimensions = { width: number; height: number };

type SelectOptions = {};

type Face = {
    landmarks: number[];
    item: paper.Path.Line;
};

export class CanvasStore {

    minCanvasDimension: number;
    canvasDimensions: CanvasDimensions;
    selectingCircle: SelectingCircle;
    landmarks: paper.Path.Circle[] = [];
    faces: Face[] = [];
    searchStore: SearchStore;
    viewInitialized: boolean;

    constructor() {
        makeObservable(this, {
            deselectAllBut: action.bound,
            selectLandmarkByNumber: action.bound,
            getLandmarksCount: action.bound,
            initPaper: action.bound,
        })
    }

    init(searchStore: SearchStore) {
        this.searchStore = searchStore;
    }

    initPaper(canvas: HTMLCanvasElement) {
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
        this.makeLandmarksClickable();

        Paper.view.onMouseLeave = () => this.selectingCircle.deselect();
        Paper.view.onMouseEnter = () => this.selectingCircle.deselect();

        this.viewInitialized = true;
    }

    makeLandmarksHoverable() {
        this.selectingCircle = new SelectingCircle(this.minCanvasDimension);
        Paper.view.onMouseMove = (e: paper.MouseEvent) => {
            const closest = this.getClosestLandmark(e.point);
            if (!closest) return;

            const opts = { showLabel: !closest.data.selected };
            this.selectingCircle.select(closest.position, closest.data.number, opts);
        };

    }

    makeLandmarksClickable() {
        Paper.view.onClick = (e: paper.MouseEvent) => {
            if (!this.searchStore) return;
            const closest = this.getClosestLandmark(e.point);
            if (!closest) return;

            this.searchStore.addLandmarkToSearch(closest.data.number);
        };
    }

    getClosestLandmark(point: paper.Point) {
        const result = Paper.project.hitTestAll(point, hitOptions);
        const landmarks = result?.filter(r => r.item.data.type === 'landmark');

        if (!landmarks?.length) {
            return
        }
        let minDist: number | undefined;
        let closest: paper.Path.Circle | undefined;
        landmarks.forEach(l => {
            if (!closest) closest = l.item as paper.Path.Circle;
            const dist = point.getDistance(l.item.position);
            if (!minDist || dist < minDist) {
                closest = l.item as paper.Path.Circle;                ;
                minDist = dist;
            }
        });

        return closest;
    }

    selectLandmarkByNumber(num: number) {
        const landmark = this.landmarks[num];
        this.selectSingleLandmark(landmark);
    }

    selectSingleLandmark(landmark: paper.Path.Circle) {
        if (!landmark) return;
        //@ts-ignore
        landmark.fillColor = 'orange';
        landmark.tween(
            { scaling: landmark.scaling },
            { scaling: HOVER_SCALE },
            {
                duration: 150
            });
        landmark.data.selected = true;
        landmark.data.scaled = true;
        landmark.data.label.opacity = 1;
    }

    selectLandmarks(numsToSelect: number[]) {
        if (!this.viewInitialized) return;
        this.deselectAllBut(numsToSelect);
        numsToSelect.forEach(v => this.selectLandmarkByNumber(v));
    }

    deselectLandmark(landmark: paper.Path.Circle) {
        //@ts-ignore
        landmark.fillColor = INIT_LANDMARK_COLOR;
        landmark.data.label.opacity = 0;
        if (landmark.data.scaled) {
            landmark.data.scaled = false;
            landmark.tween({ scaling: landmark.scaling }, { scaling: 1 }, { duration: 150 });
        }
        landmark.data.selected = false;
    }

    deselectAllBut(landmarkNums?: number[]) {
        this.landmarks
            .filter(lm => {
                if (!landmarkNums || !landmarkNums.includes) return true;
                return !landmarkNums.includes(lm.data.number);
            })
            .forEach(lm => this.deselectLandmark(lm));
    }

    drawLandmarks() {
        UVS.forEach((uv, i) => {
            this.drawSingleLandmark(uv[0], uv[1], i);
        });
    };


    drawSingleLandmark(xRel: number, yRel: number, num: number) {
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
        //@ts-ignore
        landmark.fillColor = INIT_LANDMARK_COLOR;
        landmark.sendToBack();

        this.addLandmarkLabel(landmark, num);

        this.landmarks.push(landmark);
    };

    addLandmarkLabel(landmark: paper.Path.Circle, num: number) {
        const point = landmark.position;
        const isLabelToLeft = point.x > Paper.view.size.width / 2;
        landmark.data.label = new PointText(point);
        landmark.data.label.content = num;
        const labelWidth = landmark.data.label.bounds.width;
        const labelX = isLabelToLeft ? point.x - labelWidth : point.x + 15;
        landmark.data.label.position.x = labelX;
        landmark.data.label.opacity = 0;
        landmark.data.number = num;
    }

    drawFaces() {
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

    drawFaceByNums(num1: number, num2: number) {
        const isFacePresent = this.faces.some(v => v.landmarks.includes(num1) && v.landmarks.includes(num2));
        if (isFacePresent) {
            return;
        }
        const position1 = this.landmarks[num1].position;
        const position2 = this.landmarks[num2].position;

        const item = new Paper.Path.Line(position1, position2);
        item.sendToBack();
        //@ts-ignore
        item.strokeColor = 'black';
        item.strokeWidth = 0.5;

        this.faces.push({
            landmarks: [num1, num2],
            item
        });
    }

    getLandmarksCount() {
        return this.landmarks.length;
    }
}