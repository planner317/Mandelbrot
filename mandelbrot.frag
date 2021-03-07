
uniform float xMin;
uniform float xMax;
uniform float yMin;
uniform float yMax;
uniform float digN;
uniform float hue;
uniform float repeatHue;
uniform int iterac;
uniform int pallete;
uniform vec2 screen;
uniform vec4 poinsBezie;

float hueCurve3(float i) {
    i = i - float(int(abs(i)));

    float faza2 = 1.0 / 3.0;
    float faza3 = 2.0 / 3.0;

    if (i < faza2) return 1.0 - i / faza2;
    if (i >= faza2 && i < faza3) return 0.0;
    if (i >= faza3) return (i - faza3) / faza2;
}
vec4 hueColorBGR(float i) {
    return vec4(
        hueCurve3(i + 2.0 / 3.0),
        hueCurve3(i + 1.0 / 3.0),
        hueCurve3(i),
        1.0
    );
}
vec4 hueColorRGB(float i) {
    return vec4(
        hueCurve3(i),
        hueCurve3(i + 1.0 / 3.0),
        hueCurve3(i + 2.0 / 3.0),
        1.0
    );
}
float hueCurve2(float i) {
    i = i - float(int(i));
    if (i < 0.0) i = 1.0 - i * -1.0;

    if (i < 0.5) return i * 2.0;
    if (i >= 0.5) return 1.0 - (i-0.5) * 2.0;
}
vec4 hueColorRG(float i) {
    return vec4(
        hueCurve2(i),
        hueCurve2(i *0.5),
        0.0, 1.0
    );
}
float bezier(float t, float p1, float p2, float p3, float p4) {

    float iT = 1.0 - t;
    float iT3 = iT * iT * iT;
    float iT2 = iT * iT;
    float t2 = t * t;
    float t3 = t * t * t;
    return iT3 * p1 + 3.0 * iT2 * t * p2 + 3.0 * iT * t2 * p3 + t3 * p4;
}

int mandelbrotIteration500(vec2 c) {
    float x = 0.0, y = 0.0, xx = 0.0, yy = 0.0, xy = 0.0;
    for (int i = 500; i > 0; i--) {
        xy = x * y; xx = x * x; yy = y * y; x = xx - yy + c.x; y = xy * digN + c.y;
        if ((xx + yy) >= 1000.0) return 500 - i;
    }return 500 + 1;
}
int mandelbrotIteration1000(vec2 c) {
    float x = 0.0, y = 0.0, xx = 0.0, yy = 0.0, xy = 0.0;
    for (int i = 1000; i > 0; i--) {
        xy = x * y; xx = x * x; yy = y * y; x = xx - yy + c.x; y = xy * digN + c.y;
        if ((xx + yy) >= 1000.0) return 1000 - i;
    }return 1000 + 1;
}
int mandelbrotIteration1500(vec2 c) {
    float x = 0.0, y = 0.0, xx = 0.0, yy = 0.0, xy = 0.0;
    for (int i = 1500; i > 0; i--) {
        xy = x * y; xx = x * x; yy = y * y; x = xx - yy + c.x; y = xy * digN + c.y;
        if ((xx + yy) >= 1000.0) return 1500 - i;
    }return 1500 + 1;
}

void main()
{
    vec2 pos = (gl_FragCoord.xy / screen.xy);
    vec2 c;
    c.x = xMin + (xMax - xMin) * pos.x;
    c.y = yMin + (yMax - yMin) * pos.y;
    int i;
    if (iterac == 500) i= mandelbrotIteration500(c);
    else if (iterac == 1000) i= mandelbrotIteration1000(c);
    else  i= mandelbrotIteration1500(c);

    if (i <= iterac) {
        vec4 color;
        float fI = float(i);
        if (pallete == 0) color = hueColorRGB(fI / float(iterac) * repeatHue + hue);
        if (pallete == 1) color = hueColorBGR(fI / float(iterac) * repeatHue + hue);
        if (pallete == 2) {
            float c = bezier(fI / float(iterac), poinsBezie[0],poinsBezie[1],poinsBezie[2],poinsBezie[3]);
            color = vec4(c,c,c,1);
        }
        if (pallete == 3) {
            float i = fI / float(iterac) * repeatHue + hue;
            i = i - float(int(i));
            float c = bezier( i, poinsBezie[0],poinsBezie[1],poinsBezie[2],poinsBezie[3]);
            color = hueColorBGR(c);
        }
        gl_FragColor = color;
    }
}
