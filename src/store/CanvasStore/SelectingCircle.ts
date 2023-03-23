import { PointText, Point, Path, Size, Shape, Rectangle } from "paper";

export type SelectionOpts = {
    showLabel: boolean;
};

class HighlightingCircle {

    minCanvasDimension: number;
    circle: paper.Path.Circle;
    label: paper.PointText;
    labelBg: paper.Shape.Rectangle;
    
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
        
        const rect = new Rectangle(new Point(50, 50), new Point(150, 150));
        this.labelBg = new Shape.Rectangle(rect, new Size(4, 4));
        //@ts-ignore
        this.labelBg.fillColor = 'white';
        this.labelBg.opacity = 0;
        
        this.label.insertAbove(this.labelBg);
    }

    highlight(point: paper.Point, num: number, opts: SelectionOpts) {
        if (this.currentHovered === num) return;
        this.currentHovered = num;

        this.showCircle(point);
        this.hideLabel();
        opts.showLabel && this.showLabel(point, num);
    }

    dehighlight() {
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
        
        const { x: xScaling, y: yScaling } = this.label.scaling
        const labelX = point.x + this.label.bounds.width / 2 + (10 * xScaling);
        this.label.position.x = labelX;
        this.label.position.y = point.y;
        this.label.opacity = 1;
        this.label.bringToFront();
        
        this.labelBg.position = this.label.position;
        this.labelBg.size = new Size(this.label.bounds.width / xScaling + 3, this.label.bounds.height / yScaling + 3);
        this.labelBg.opacity = 1;
    }

    hideLabel() {
        this.label.opacity = 0;
        this.label.sendToBack();
        this.labelBg.opacity = 0;
    }

    scale(scale: number) {
        this.circle.scaling = new Point(scale, scale);
        const labelScaling = scale / this.label.scaling.x;
        this.label.scale(labelScaling, this.circle.position);
        
        const labelBgScaling = scale / this.labelBg.scaling.x;
        this.labelBg.scale(labelBgScaling, this.circle.position);
    }
}

export default HighlightingCircle;