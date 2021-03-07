canvasBezier.width = canvasBezier.parentElement.offsetWidth;
canvasBezier.height = canvasBezier.parentElement.offsetWidth;
/** @type{CanvasRenderingContext2D} */
var ctxBezier = canvasBezier.getContext("2d");

let pointsBezier = { y0: 0, y1: 0, y2: 0, y3: 0 }

function updateBezier() {
    pointsBezier.y0 = bezierY0.value
    pointsBezier.y1 = bezierCY1.value
    pointsBezier.y2 = bezierCY2.value
    pointsBezier.y3 = bezierY1.value
    console.log(pointsBezier)
    draw(JSON.parse(JSON.stringify(pointsBezier)), ctxBezier)
    uniforms.poinsBezie.value.x=bezierY0.value
    uniforms.poinsBezie.value.y=bezierCY1.value
    uniforms.poinsBezie.value.z=bezierCY2.value
    uniforms.poinsBezie.value.w=bezierY1.value
    render()
}

const circle = (ctx, { x, y }, size, fill) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    const method = fill ? 'fill' : 'stroke';
    ctx[method]();
};

const line = (ctx, { x: fromX, y: fromY }, { x: toX, y: toY }) => {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
};

const draw = (pointsBezier, ctx) => {
    for (let [key, val] of Object.entries(pointsBezier)) {
        pointsBezier[key] *= ctx.canvas.width
    }
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#fff';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Main subject line
    ctx.beginPath();
    ctx.moveTo(0, pointsBezier.y0);
    ctx.bezierCurveTo(
        ctx.canvas.width / 3,
        pointsBezier.y1,
        ctx.canvas.width * 0.666,
        pointsBezier.y2,
        ctx.canvas.width,
        pointsBezier.y3
    );
    ctx.stroke();

    // Bezier lines
    ctx.fillStyle = '#Ff0';
    ctx.strokeStyle = '#Ff0';
    ctx.setLineDash([5, 3]);

    line(ctx, { x: 0, y: pointsBezier.y0 }, { x: ctx.canvas.width / 3, y: pointsBezier.y1 });
    line(ctx, { x: ctx.canvas.width * 0.666, y: pointsBezier.y2 }, { x: ctx.canvas.width, y: pointsBezier.y3 });

    // Bezier control points
    ctx.setLineDash([]);
    circle(ctx, { x: ctx.canvas.width / 3, y: pointsBezier.y1 }, 5, false);
    circle(ctx, { x: ctx.canvas.width * 0.666, y: pointsBezier.y2 }, 5, false);
};
