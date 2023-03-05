import Paper, { PointText, Point, Path } from "paper";

export type SelectionOpts = {
    showLabel: boolean;
};

class SelectingCircle {

    minCanvasDimension: number;
    circle: paper.Path.Circle;
    label: paper.PointText;
    
    currentHovered: number | null;

    constructor(minCanvasDimension: number) {
        this.minCanvasDimension = minCanvasDimension;
        const initPoint = new Point(0, 0); 

        this.circle = new Path.Circle({
            position: initPoint,
            radius: 5,
            applyMatrix: false,
            opacity: 0,
            strokeColor: 'red',
            strokeWidth: 1,
            dashArray: [4, 3]
        });
        this.label = new PointText(initPoint);
        this.label.opacity = 0;
    }

    select(point: paper.Point, num: number, opts: SelectionOpts) {
        if (this.currentHovered === num) return;
        this.currentHovered = num;

        this.showCircle(point);
        this.hideLabel();
        opts.showLabel && this.showLabel(point, num);
    }

    deselect() {
        this.hideCircle();
        this.hideLabel();
        this.currentHovered = null;
    }
    
    showCircle(point: paper.Point) {
        this.circle.position = point;
        this.circle.opacity = 1;
        this.circle.bringToFront();
    }

    hideCircle() {
        this.circle.opacity = 0;
        this.circle.sendToBack();
    }

    showLabel(point: paper.Point, num: number) {
        this.label.content = num.toString();
        const labelWidth = this.label.bounds.width;
        const isLabelToLeft = point.x > Paper.view.size.width / 2;
        const labelX = isLabelToLeft ? point.x - labelWidth : point.x + 15;
        this.label.position.x = labelX;
        this.label.position.y = point.y;
        this.label.opacity = 1;
        this.label.bringToFront();
    }

    hideLabel() {
        this.label.opacity = 0;
        this.label.sendToBack();
    }
}

export default SelectingCircle;