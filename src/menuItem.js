export function MenuItem(x, y, width, height, id, p) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;

    this.stroke = "#AA00AA";

    this.display = () => {
        p.fill("rgba(0, 0, 0 ,0.0)");
        p.stroke(this.stroke);
        p.strokeWeight(5);
        p.rect(this.x, this.y, this.width, this.height);
    };

    this.highlight = () => {
        this.stroke = "white";
    };

    this.unHighlight = () => {
        this.stroke = "#AA00AA";
    };
}
