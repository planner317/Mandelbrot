'use strict'

let iterac = document.getElementById("iterac");
let speed = document.getElementById("speed");
let poistion = document.getElementById("poistion");
let viewIterac = document.getElementById("viewIterac");
let canvasDiv = document.getElementById("canvasDiv");
let canvas1 = document.getElementById("canvas1");
canvas1.width = window.innerWidth / 2
canvas1.height = window.innerHeight / 2
/** @type{CanvasRenderingContext2D} */
let context1 = canvas1.getContext("2d");
let image = context1.createImageData(canvas1.width, canvas1.height)



function flyControl() {

    let width = 5
    let height = window.innerHeight / window.innerWidth * width
    let startX = -2.2;
    let startY = -1.2
    let zoomAnim = false
    let buttons
    let positionProcentCursor = { x: 0, y: 0 }
    let oldStartX, oldStartY, oldIterac
    drawMandelbrot()
    canvasDiv.onmousemove = (e) => {
        if (e.buttons == 4) { // средняя кнопка мыши (перемещение)
            canvasDiv.style.cursor = "grabbing"
            startX -= e.movementX / window.innerWidth * width
            startY += e.movementY / window.innerHeight * height
            drawMandelbrot()
        }
        positionProcentCursor.x = e.x / window.innerWidth
        positionProcentCursor.y = e.y / window.innerHeight
    }
    canvasDiv.onmousedown = (e) => {
        if (e.buttons == 1 || e.buttons == 2) {
            zoomAnim = true
            buttons = e.buttons
            zoom()
        }
    }
    canvasDiv.onmouseup = stop
    canvasDiv.onmouseout = stop
    function stop() {
        zoomAnim = false
        canvasDiv.style.cursor = "default"
        buttons = 0
    }

    function zoom() {

        if (buttons == 1) { // 1 кнопка мыши (увеличение)
            if (width < 0.000051) {
                width = 0.00005
                canvasDiv.style.cursor = "not-allowed"
                return
            }
            canvasDiv.style.cursor = "zoom-in"
            startX += width * +speed.value * positionProcentCursor.x
            startY += height * +speed.value * (1 - positionProcentCursor.y)
            width *= 1 - speed.value
            height *= 1 - speed.value
            drawMandelbrot()
        }
        if (buttons == 2) { // 2 кнопка мыши (уменьшение)
            if (width > 7) {
                width = 7.1
                canvasDiv.style.cursor = "not-allowed"
                return
            }
            canvasDiv.style.cursor = "zoom-out"
            startX -= width * +speed.value * positionProcentCursor.x
            startY -= height * +speed.value * (1 - positionProcentCursor.y)
            width *= 1 + +speed.value
            height *= 1 + +speed.value
            drawMandelbrot()
        }
        if (zoomAnim) requestAnimationFrame(zoom)
    }

    function drawMandelbrot() {
        if (startY == oldStartY && startX == oldStartX &&
            +iterac.value == oldIterac) return
        oldIterac = +iterac.value
        oldStartX = startX
        oldStartY = startY
        poistion.innerHTML = `x: ${(startX + width/2).toFixed(12)}<br> y: ${(startY + height/2).toFixed(12)}<br>ширина:<br>${width.toFixed(12)}`

        UpdateUniformsXY(startX, startX + width, startY, startY + height)
        render()
    }
    pos0.onclick = () => {
        startX = -2.7
        startY = -1.2
        width = 5
        height = window.innerHeight / window.innerWidth * width
        drawMandelbrot()
    }
    pos1.onclick = () => {
        startX = -0.7664475
        startY = -0.0966387
        width = 0.004707265
        height = window.innerHeight / window.innerWidth * width
        drawMandelbrot()
    }
    pos2.onclick = () => {
        startX = -0.7186940
        startY = -0.2161652
        width = 0.002112830
        height = window.innerHeight / window.innerWidth * width
        drawMandelbrot()
    }
    pos3.onclick = () => {
        startX = -0.644274326762
        startY = 0.374459173316
        width = 0.000186793922
        height = window.innerHeight / window.innerWidth * width
        drawMandelbrot()
    }
    pos4.onclick = () => {
        startX = -0.128157111692
        startY = 0.882268555820
        width = 0.036555199355
        height = window.innerHeight / window.innerWidth * width
        drawMandelbrot()
    }
    window.onresize = () => {
        height = window.innerHeight / window.innerWidth * width
        resize()
        oldStartX = 0
        drawMandelbrot()
    }
}


function mandelbrotIteration(cx, cy, maxIter) {
    let x = 0, y = 0, xx = 0, yy = 0, xy

    for (let i = maxIter; i > 0; i--) {
        xy = x * y;
        xx = x * x;
        yy = y * y;
        x = xx - yy + cx;
        y = xy + xy + cy;
        if ((xx + yy) >= 4.0) return maxIter - i;
    }
    return maxIter + 1;
}

function mandelbrot(context, image, xmin, xmax, ymin, ymax, iterations) {

    let width = image.width;
    let height = image.height;
    let pixels = image.data;

    for (let ix = 0; ix < width; ++ix) {
        for (let iy = 0; iy < height; ++iy) {

            let x = xmin + (xmax - xmin) * ix / (width - 1);
            let y = ymin + (ymax - ymin) * iy / (height - 1);
            let i = mandelbrotIteration(x, y, iterations);
            let index = (width * iy + ix) * 4;
            if (i > iterations) {
                pixels[index] = 0;
                pixels[index + 1] = 0;
                pixels[index + 2] = 0;
            }
            else {
                // pixels[index + 1] = 255
                let color = hueColor(3 * Math.log(i) / Math.log(iterations - 1.0))
                pixels[index] = color.r
                pixels[index + 1] = color.g
                pixels[index + 2] = color.b
            }
            pixels[index + 3] = 255;
        }
    }
    context.putImageData(image, 0, 0);
}

function hueCurve(i) {
    i = i % 1;
    if (i < 0) i = 1 - i * -1

    let faza2 = 1 / 3
    let faza3 = 2 / 3

    if (i < faza2) return 1 - i / faza2
    if (i >= faza2 && i < faza3) return 0
    if (i >= faza3) return (i - faza3) / faza2
}
function hueColor(i) {
    return {
        r: hueCurve(i) * 255,
        g: hueCurve(i + 2 / 3) * 255,
        b: hueCurve(i + 1 / 3) * 255,
    }
}
