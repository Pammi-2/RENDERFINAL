import * as THREE from 'three'
import {gsap} from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

console.log(gsap);

/**
 * Base
 */
// Debug
const gui = new GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene -fondo

const scene = new THREE.Scene()// Crear canvas para el gradiente


// Crear fondo con gradiente radial (canvas + textura)
const canvasGradient = document.createElement('canvas');
canvasGradient.width = 512;
canvasGradient.height = 512;

const ctx = canvasGradient.getContext('2d');

const gradient = ctx.createRadialGradient(
    canvasGradient.width / 2, 
    canvasGradient.height / 2, 
    0, 
    canvasGradient.width / 2, 
    canvasGradient.height / 2, 
    canvasGradient.width / 2
);

gradient.addColorStop(0.8, '#dde1ff'); 
gradient.addColorStop(1, '#e1e3ef'); 

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvasGradient.width, canvasGradient.height);

const gradientTexture = new THREE.CanvasTexture(canvasGradient);

scene.background = gradientTexture;







//vinil 
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)



//teclas


const loader = new THREE.TextureLoader()
let sprite1 = null;
let sprite2 = null;
let sprite3 = null;
let sprite4 = null;
let sprite5 = null;


loader.load('/texturas/tecla 1.png', (texture) => {
    const spriteMaterial1 = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    })

    sprite1 = new THREE.Sprite(spriteMaterial1)
    sprite1.scale.set(0.35, 0.35, 0.35 ) 
    sprite1.position.set(0, 40, 50)
    scene.add(sprite1)
    sprite1.visible = false 
    
})

loader.load('/texturas/tecla2.png', (texture) => {
    const spriteMaterial2 = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    })

    sprite2 = new THREE.Sprite(spriteMaterial2)
    sprite2.scale.set(0.35, 0.35, 0.35)
    sprite2.position.set(0, 40, 50)
    scene.add(sprite2)
    sprite2.visible = false 
  
})



loader.load('/texturas/tecla3.png', (texture) => {
    const spriteMaterial3 = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    sprite3 = new THREE.Sprite(spriteMaterial3);  // <- Aquí creas el sprite
    sprite3.scale.set(20, 20, 20);
    sprite3.position.set(0, 40, 50);
 
    scene.add(sprite3);
    sprite3.visible = false;
});

loader.load('/texturas/tecla4.png', (texture) => {
    const spriteMaterial4 = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    sprite4 = new THREE.Sprite(spriteMaterial4);  // <- Aquí creas el sprite

    sprite4.position.set(-10, 0, 50);
    sprite4.scale.set(10, 10, 20);
    scene.add(sprite4);
    sprite4.visible = false;
});


loader.load('/texturas/tecla5.png', (texture) => {
    console.log("Textura cargada:", texture);  
    const spriteMaterial5 = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    sprite5 = new THREE.Sprite(spriteMaterial5);  // <- Aquí creas el sprite

    sprite5.position.set(0, 0, 0);
    sprite5.scale.set(10, 10, 10);
    scene.add(sprite5);
    sprite5.visible = true;
});




let tocadiscosClose = null;
let tocadiscosFinal = null;

//tocadiscosclose 

let close = null;

gltfLoader.load('/models/tocadiscos/tocadiscosclose.glb', (gltf) => {
    gltf.scene.scale.set(6.5, 6.5, 6.5)
    gltf.scene.position.y = 5
    tocadiscosClose = gltf.scene
    tocadiscosClose.visible = true
    scene.add(tocadiscosClose)
})

let mixer = null

gltfLoader.load(
    '/models/tocadiscos/tocadiscosfinal.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(6.5, 6.5, 6.5)
        gltf.scene.position.y = 5

        tocadiscosFinal = gltf.scene
        tocadiscosFinal.visible = false // se oculta el tocadiscos abierto para la animación inicial
        scene.add(tocadiscosFinal)
    }
)


 


//movimiento  del giro del vinilo
let mixer1 = null
let vinilo = null
let animacionEjecutada = false; 
//gira el dissco
let viniloPivot = new THREE.Group(); // Grupo que rotará

scene.add(viniloPivot); 
gltfLoader.load('/models/vinil/discovinilo-optimized.gltf', (gltf) => {
  
    vinilo = gltf.scene
    vinilo.scale.set(6.5, 6.5, 6.5)

    // Calcular centro del bounding box
    const box = new THREE.Box3().setFromObject(vinilo)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Reposicionar el vinilo para que esté centrado
    vinilo.position.sub(center) // mueve el modelo para que su centro esté en el origen (0,0,0)

    // Añadir al grupo pivote y posicionar el grupo
    viniloPivot.add(vinilo)
    viniloPivot.position.set(4.8, 100, 2.9) // posición del vinilo
    scene.add(viniloPivot)


    canvas.addEventListener('click', animatediscovinilo) // cae el vinilo


    function animatediscovinilo() {
        if (!scrollActivado) return; 
        if (animacionEjecutada) return; // si ya se ejecutó, no hacer nada
    
        
    
        gsap.to(viniloPivot.position, {
            y: 9.5,
            duration: 4,
            ease: 'power4.out'
        })
    
        if (sprite1) sprite1.visible = true;
        if (sprite2) sprite2.visible = true;
        if (sprite3) sprite3.visible = false;
        if (sprite4) sprite4.visible = true;
        if (sprite5) sprite5.visible = false;
        animacionEjecutada = true; // ya no se puede volver a ejecutar
    }
})



 /*
 * Models
 */


let mixer2 = null
let Personaje3 = null
let personaje2 = null

//Fiona Apple

gltfLoader.load(
    '/models/personaje/Personaje3_draco.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.position.y = 1
       Personaje3 = gltf.scene
       Personaje3.visible = false 
       viniloPivot.add(gltf.scene)

    
    }
)

//Alex Turner

gltfLoader.load(
    '/models/personaje/personaje2_draco.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.position.y = 0
       
        personaje2 = gltf.scene
        personaje2.visible = false 
        viniloPivot.add(gltf.scene)

    
    }
)


//audio //
const audio1 = new Audio('/audio/cancion1.mp3')
const audio2 = new Audio('/audio/cancion2.mp3')
window.addEventListener('keydown', (event) => {
    if(event.key === '1') {
      audio2.pause()
      audio2.currentTime = 0
      audio1.play()
      if (Personaje3) Personaje3.visible = true
      if (personaje2) personaje2.visible = false
    }
    if(event.key === '2') {
      audio1.pause()
      audio1.currentTime = 0
      audio2.play()
      if (personaje2) personaje2.visible = true
      if (Personaje3) Personaje3.visible = false
    }
  })


/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const ambientLightBackground = new THREE.AmbientLight(0xffcc66, 0.3)  // amarillo cálido, intensidad baja
scene.add(ambientLightBackground)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

//luz lampara
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let lightOn = true
const pointLight = new THREE.PointLight(0xffffff, 500, 500)
pointLight.position.set(-10, 23, -24)
scene.add(pointLight)

const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(15, 10, 15), // tamaño un poco más grande para la zona clickeable
    new THREE.MeshBasicMaterial({ color: 0xffff00, visible: false }) // invisible
)
lightSphere.position.copy(pointLight.position)
scene.add(lightSphere)

//extra light
const extraLight = new THREE.PointLight(0xffcc00, 0, 1500) // intensidad 0 al inicio
extraLight.position.set(20, 15, 5) // puedes cambiar esta posición
scene.add(extraLight)






/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(10, 55, 0); // Frontal desde Z
camera.lookAt(0, 0,0);        // Apunta al centro de la escena
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0) // Opcional: el centro del disco
controls.enableDamping = true

controls.enableRotate = true
controls.enablePan = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))






//teclado
let girando = false
window.addEventListener('keydown', (event) => {
    if(event.code === 'Space') {
        girando = !girando // Alterna entre girar y no girar
    }
})

//luz lampara 
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(lightSphere)

    if (intersects.length > 0) {
        lightOn = !lightOn

        // Luz principal
        pointLight.intensity = lightOn ? 200 : 0

        // Luz adicional
        extraLight.intensity = lightOn ? 150 : 0 // el valor que tú quieras

        // Luz ambiental
        ambientLight.intensity = lightOn ? 0.2 : 1 // baja cuando se prenden las luces
    }
})

//instrucciones

/**
 * Animate
 */

const floatParams12 = { amplitude: 0.005, speed: 10 };


const floatParams345 = { amplitude: 0.1, speed: 8 };


// scroll camara 
let transicionHecha = false;
let scrollActivado = false;

function hacerTransicionCamara() {
    transicionHecha = true;
    controls.enabled = false;

    // Ocultar instrucciones
    const fadeTexto = document.getElementById('cajaInstrucciones');
    if (fadeTexto) {
        gsap.to(fadeTexto, {
            duration: 2,
            opacity: 0
            // No usamos display: none para que se pueda volver a mostrar luego
        });
    }

    if (tocadiscosClose) {
        gsap.to(tocadiscosClose.rotation, {
            duration: 1.2,
            y: tocadiscosClose.rotation.y + Math.PI * 2,
            ease: 'power1.inOut',
            onComplete: () => {
                tocadiscosClose.visible = false;
                if (tocadiscosFinal) tocadiscosFinal.visible = true;

                // Mover cámara
                gsap.to(camera.position, {
                    duration: 1,
                    y: 20,
                    z: 30,
                    x: 40,
                    ease: 'power4.out',
                    onUpdate: () => camera.lookAt(0, 0, 0),
                    onComplete: () => {
                        controls.enabled = true;

                        // Mostrar sprite3 tras 1.5s
                        gsap.delayedCall(1.2, () => {
                            if (sprite5) sprite5.visible = false;
                            if (sprite3) sprite3.visible = true
                        
                        });
                    }
                });
            }
        });
    }
}


window.addEventListener('wheel', (event) => {
    if (!transicionHecha) {
        hacerTransicionCamara();
    }
    if (!scrollActivado) {
        scrollActivado = true;
        console.log("Scroll activado. Ahora se puede hacer clic.");
      }
});



//animacion sprite

const offset1 = new THREE.Vector3(0.85, 0.2, -1);
const offset2 = new THREE.Vector3(0.85, 0, -1);
const offset3 = new THREE.Vector3(-15, 0, -15);
const offset4 = new THREE.Vector3(8, -1,-10);
const offset5 = new THREE.Vector3(-5, 2,-5);
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Actualizar animaciones
    if (mixer) mixer.update(deltaTime)

    // Girar vinilo
    if (girando && viniloPivot) {
        viniloPivot.rotation.y += 0.05
    }

    // Movimiento flotante
    const floatOffset12 = Math.sin(elapsedTime * floatParams12.speed) * floatParams12.amplitude
    const floatOffset345 = Math.sin(elapsedTime * floatParams345.speed) * floatParams345.amplitude

    if (sprite1) {
        const pos = camera.position.clone().add(offset1.clone().applyQuaternion(camera.quaternion))
        pos.y += floatOffset12
        sprite1.position.copy(pos)
    }

    if (sprite2) {
        const pos = camera.position.clone().add(offset2.clone().applyQuaternion(camera.quaternion))
        pos.y += floatOffset12
        sprite2.position.copy(pos)
    }

    if (sprite3) {
        const pos = camera.position.clone().add(offset3.clone().applyQuaternion(camera.quaternion))
        pos.y += floatOffset345
        sprite3.position.copy(pos)
    }

    if (sprite4) {
        const pos = camera.position.clone().add(offset4.clone().applyQuaternion(camera.quaternion))
        pos.y += floatOffset345
        sprite4.position.copy(pos)
    }

    if (sprite5) {
        const pos = camera.position.clone().add(offset5.clone().applyQuaternion(camera.quaternion))
        pos.y += floatOffset345
        sprite5.position.copy(pos)
    }

    // Actualizar controles
    controls.update()

    // Renderizar escena
    renderer.render(scene, camera)

    // Próximo frame
    window.requestAnimationFrame(tick)
}

tick()

const botonInstrucciones = document.getElementById('Instrucciones');
const cajaInstrucciones = document.getElementById('cajaInstrucciones');

let instruccionesVisibles = false;

botonInstrucciones.addEventListener('click', () => {
    instruccionesVisibles = !instruccionesVisibles;

    if (instruccionesVisibles) {
        cajaInstrucciones.style.opacity = '1';
        cajaInstrucciones.style.pointerEvents = 'auto';
    } else {
        cajaInstrucciones.style.opacity = '0';
        cajaInstrucciones.style.pointerEvents = 'none';
    }
});


const toggleSoundBtn = document.getElementById('toggleSound')
let muted = false // estado del sonido

toggleSoundBtn.addEventListener('click', () => {
    muted = !muted
    audio1.muted = muted
    audio2.muted = muted
    toggleSoundBtn.textContent = muted ? 'Sonido 🔇' : 'Sonido 🔊'
})