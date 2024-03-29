import { action, makeObservable } from "mobx";
import Paper, { PointText, Point, Path, Tool } from "paper";
import { UVS, FACES } from '../../geometryData';
import { SearchStore } from '../SearchStore';
import HighlightingCircle from "./SelectingCircle";

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
const MIN_SELECTED_SCALE = 0.6;
const MIN_UNSELECTED_SCALE = 0.4;

export type CanvasDimensions = { width: number; height: number };

type Face = {
    landmarks: number[];
    item: paper.Path.Line;
};

export class CanvasStore {

    minCanvasDimension: number;
    canvasDimensions: CanvasDimensions;
    highlightingCircle: HighlightingCircle;
    landmarks: paper.Path.Circle[] = [];
    faces: Face[] = [];
    searchStore: SearchStore;
    viewInitialized: boolean;
    isDragging?: boolean = false;

    constructor() {
        makeObservable(this, {
            deselectAllBut: action.bound,
            selectLandmarkByNumber: action.bound,
            getLandmarksCount: action.bound,
            initPaper: action.bound,
            highlightLandmark: action.bound,
            dehighlightLandmark: action.bound,
        })
    }

    init(searchStore: SearchStore) {
        this.searchStore = searchStore;
    }

    initPaper(canvas: HTMLCanvasElement) {

        Paper.project = new Paper.Project(canvas);

        Paper.setup(canvas);
        const { width, height } = canvas.getBoundingClientRect();
        // canvas.width = height;
        // canvas.height = height;
        // Paper.view.viewSize = new Size(height, height);
        this.canvasDimensions = { width, height };
        this.minCanvasDimension = Math.min(width, height);
        this.highlightingCircle = new HighlightingCircle(this.minCanvasDimension);

        this.drawLandmarks();
        this.drawFaces();

        this.makeLandmarksHoverable();
        this.makeLandmarksClickable();
        this.initZoom(canvas);
        this.initPan();

        Paper.view.onMouseLeave = () => this.highlightingCircle.dehighlight();

        this.viewInitialized = true;
        Paper.view.center = new Point(canvas.width * 0.31, Paper.view.center.y) ;
    }

    initPan() {
        const tool = new Tool();

        tool.onMouseDrag = (event: paper.ToolEvent) => {
            this.isDragging = true;
            const pan_offset = event.point.subtract(event.downPoint);
            Paper.view.center = Paper.view.center.subtract(pan_offset);
        }

        tool.onMouseUp = () => {
            this.isDragging = false;
        }
    }

    makeLandmarksHoverable() {
        Paper.view.onMouseMove = (e: paper.MouseEvent) => {
            const closest = this.getClosestLandmark(e.point);
            if (!closest) return;

            const opts = { showLabel: true };
            this.highlightingCircle.highlight(closest.position, closest.data.number, opts);
        };
    }

    makeLandmarksClickable() {
        Paper.view.onClick = (e: paper.MouseEvent) => {
            if (!this.searchStore || this.isDragging) return;
            const closest = this.getClosestLandmark(e.point);
            if (!closest) return;

            if (closest.data.selected) {
                return this.searchStore.removeLandmarkFromSearch(closest.data.number);    
            }
            this.searchStore.addLandmarkToSearch(closest.data.number);
        };
    }

    initZoom(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousewheel', (event: WheelEvent) => {
            const oldZoom = Paper.view.zoom;

            let newZoom = Paper.view.zoom;
            if (event.deltaY < 0) {
                if (oldZoom > 10) return;
                newZoom = oldZoom * 1.05;
            } else {
                if (oldZoom < 0.5) return;
                newZoom = oldZoom * 0.95;
            }

            const zoomRatio = oldZoom / newZoom;

            const mousePosition = new Point(event.offsetX, event.offsetY);

            //viewToProject: gives the coordinates in the Project space from the Screen Coordinates
            const viewPosition = Paper.view.viewToProject(mousePosition);

            const mpos = viewPosition;
            const ctr = Paper.view.center;

            const pc = mpos.subtract(ctr);
            const offset = mpos.subtract(pc.multiply(zoomRatio)).subtract(ctr);

            Paper.view.zoom = newZoom;
            Paper.view.center = Paper.view.center.add(offset);

            event.preventDefault();

            const lmScale = this.getUnselectedLmScaling();
            this.compemsateLandmarksZoom(lmScale);
            this.highlightingCircle.scale(lmScale);
        })
    }

    compemsateLandmarksZoom(lmScale: number) {
        this.landmarks.forEach(landmark => {
            const { label } = landmark.data;
            const labelScaling = lmScale / label.scaling.x;
            landmark.data.label.scale(labelScaling, landmark.position);

            const selectedLmScale = this.getSelectedLmScaling();
            landmark.scaling = landmark.data.scaled ? new Point(selectedLmScale, selectedLmScale) : new Point(lmScale, lmScale);
        });
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
                closest = l.item as paper.Path.Circle;
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
            { scaling: this.getSelectedLmScaling() },
            {
                duration: 150
            });
        landmark.data.selected = true;
        landmark.data.scaled = true;
    }

    getSelectedLmScaling() {
        const scaling = 1 / Paper.view.zoom * HOVER_SCALE;
        return Math.min(2, Math.max(MIN_SELECTED_SCALE, scaling));
    }

    getUnselectedLmScaling() {
        const scaling = 1 / Paper.view.zoom;
        return Math.min(1, Math.max(MIN_UNSELECTED_SCALE, scaling));
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
            landmark.tween({ scaling: landmark.scaling }, { scaling: this.getUnselectedLmScaling() }, { duration: 150 });
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
        const label = new PointText(point);
        label.content = num.toString();
        const labelWidth = label.bounds.width;
        const labelX = isLabelToLeft ? point.x - labelWidth : point.x + 15;
        label.position.x = labelX;
        label.opacity = 0;
        landmark.data.label = label;
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

    highlightLandmark(num: number) {
        const landmark = this.landmarks.find(l => l.data.number === num);
        if (!landmark) return;
        const opts = { showLabel: true };
        this.highlightingCircle.highlight(landmark.position, num, opts);
    }

    dehighlightLandmark() {
        this.highlightingCircle.dehighlight();
    }

    getLandmarksCount() {
        return this.landmarks.length;
    }
}