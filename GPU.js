var scene, camera, renderer, material, mesh1;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10);
camera.position.z = 1
renderer = new THREE.WebGLRenderer({ antialias : true});
canvasDiv.appendChild(renderer.domElement)

let uniforms = {};
uniforms.screen = { type: "v2", value: new THREE.Vector2(200,100) }
uniforms.xMin = { type: "f", value: -2 }
uniforms.xMax = { type: "f", value: 2 }
uniforms.yMin = { type: "f", value: -2 }
uniforms.yMax = { type: "f", value: 2 }
uniforms.digN = { type: "f", value: +digN.value }
uniforms.hue = { type: "f", value: 0 }
uniforms.poinsBezie = { type: "v4", value: new THREE.Vector4(1,0,0,0) }
uniforms.repeatHue = { type: "f", value: 0.333 }
uniforms.pallete = { type: "i", value: pallete.selectedIndex }
uniforms.iterac = { type: "i", value: 1000 }

fetch("mandelbrot.frag").then((r) => {
    r.text().then((shaderCode) => {
        material = new THREE.ShaderMaterial({ uniforms: uniforms, fragmentShader: shaderCode })
        mesh1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), material);
        scene.add(mesh1);
        resize()
        flyControl()
        updateBezier()
    })
})

function UpdateUniformsXY( xmin, xmax, ymin, ymax) {
    uniforms.xMin.value = xmin
    uniforms.xMax.value = xmax
    uniforms.yMin.value = ymin
    uniforms.yMax.value = ymax
}

function render() {
    renderer.render(scene, camera);
}

function resize() {
    uniforms.screen.value.x = window.innerWidth * high.value 
    uniforms.screen.value.y = window.innerHeight * high.value 
    renderer.setSize(window.innerWidth * high.value, window.innerHeight * high.value);
    renderer.domElement.style.width = "100vw"
    renderer.domElement.style.height = "100vh"
}

high.oninput = ()=>{
    resize()
    render()
}

digN.oninput = ()=>{
    uniforms.digN.value = digN.value
    render()
}

hue.oninput = ()=>{
    uniforms.hue.value = hue.value
    render()
}
repeatHue.oninput = ()=>{
    uniforms.repeatHue.value = repeatHue.value
    render()
}

pallete.oninput = ()=>{
    uniforms.pallete.value = pallete.selectedIndex
    render()
}
iterac.oninput = ()=>{
    uniforms.iterac.value = iterac.value
    viewIterac.innerText = `итераций: ` + iterac.value
    render()
}

