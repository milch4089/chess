import * as THREE from 'three'
import { WEBGL } from './webgl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CubeTextureLoader } from 'three'


if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1d1d1d)
  // const axesHelper = new THREE.AxesHelper(8)
  // scene.add(axesHelper)

  //radians
  function radian(degree) {
    return (degree * Math.PI) / 180
  }

  //renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    // alpha: true,
    // logarithmicDepthBuffer: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  document.body.appendChild(renderer.domElement)

  //camera
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(3.5, 3, 3.5)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(3.5, 0, 3.5)
  
  controls.update()
  //Responsive
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  //light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
  directionalLight.position.set(-4, 10, 6)

  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 20
  directionalLight.target.position.set(6,0,1)
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = -7
  scene.add(directionalLight)
  scene.add(directionalLight.target)

  const light = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(light)

  const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
  scene.add(helper)

  //load souces
  const fontLoader = new THREE.FontLoader()
  let textGeo 
  let rankTextMesh = []
  let FileTextMesh = []

  fontLoader.load('../static/font/SB Aggro Medium_Regular.json', (font)=>{
    let File = ["A", "B", "C", "D", "E", "F", "G", "H"]
    
    for (let x=0;x<2;x++) {
      for (let y=0;y<8;y++) {

        textGeo = new THREE.TextGeometry(x==0 ? String(y+1) : File[y],{
          font: font,
          size: 0.4,
          height:0
        }) 
        
        if (x==0) {
          FileTextMesh[y] = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial({color: 0xffffff}))    
          FileTextMesh[y].position.set(y-0.13,0.15,-1.3)
          FileTextMesh[y].rotation.set(radian(90),radian(180),radian(90))
          scene.add(FileTextMesh[y])
        } else {
          rankTextMesh[y] = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial({color: 0xffffff}))
          rankTextMesh[y].position.set(-1.3,0.15,y-0.22)
          rankTextMesh[y].rotation.set(radian(90),radian(180),radian(90))
          scene.add(rankTextMesh[y])
        }

      }
    }
  })
  


  const textureLoader = new THREE.TextureLoader()
  const skyboximgs = new CubeTextureLoader().load([
    '../static/texture/skybox/px.png',
    '../static/texture/skybox/nx.png',
    '../static/texture/skybox/py.png',
    '../static/texture/skybox/ny.png',
    '../static/texture/skybox/pz.png',
    '../static/texture/skybox/nz.png',
  ])
  scene.background = skyboximgs
  const board_texture = [
    textureLoader.load('../static/texture/board/Wood07_2K_BaseColor.png'),
    textureLoader.load('../static/texture/board/Wood07_2K_Normal.png'),
    textureLoader.load('../static/texture/board/Wood07_2K_Roughness.png'),
    textureLoader.load('../static/texture/board/Wood06_2K_BaseColor.png'),
    textureLoader.load('../static/texture/board/Wood06_2K_Normal.png'),
    textureLoader.load('../static/texture/board/Wood06_2K_Roughness.png'),
  ]
  const piece_texture = [
    textureLoader.load('../static/texture/piece/Marble08_2K_BaseColor.png'),
    textureLoader.load('../static/texture/piece/Marble08_2K_Normal.png'),
    textureLoader.load('../static/texture/piece/Marble08_2K_Roughness.png'),
    textureLoader.load('../static/texture/piece/Marble09_2K_BaseColor.png'),
    textureLoader.load('../static/texture/piece/Marble09_2K_Normal.png'),
    textureLoader.load('../static/texture/piece/Marble09_2K_Roughness.png'),
  ]

  // const skybox = textureLoader.load
  // const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);

  // const skybox = new THREE.Mesh(skyboxGeo);
  // scene.add(skybox);

  //object
  const geometry_chessboard = new THREE.BoxGeometry(1, 0.3, 1)

  for (let x = 0; x < 8; x++) {

    for (let y = 0; y < 8; y++) {

      let chessboard
      if (x % 2 != 0) {
        
        chessboard = new THREE.Mesh(
          geometry_chessboard,
          new THREE.MeshStandardMaterial({
            map: y % 2 == 0 ? board_texture[3] : board_texture[0],
            normalMap: y % 2 == 0 ? board_texture[4] : board_texture[1],
            roughness: y % 2 == 0 ? board_texture[5] : board_texture[2],
          })
        )

      } else {

        chessboard = new THREE.Mesh(
          geometry_chessboard,
          new THREE.MeshStandardMaterial({
            map: y % 2 == 0 ? board_texture[0] : board_texture[3],
            normalMap: y % 2 == 0 ? board_texture[1] : board_texture[4],
            roughness: y % 2 == 0 ? board_texture[2] : board_texture[5],
          }))

      }

      chessboard.position.set(x, 0, y)
      chessboard.receiveShadow = true
      scene.add(chessboard)

    }
  }



  let chessPieces = []
  const loader = new GLTFLoader()

  for (let i = 0; i < 6; i++) {

    loader.load(`../static/models/${i}.glb`, (glb) => {
      glb.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true

    }
      })

      chessPieces[i] = glb.scene.children[0]
      chessPieces[i].scale.set(1.3, 1.3, 1.3)

      if (i == 5) arrangePieces()

    })
  }

  const Piece_material = [

    new THREE.MeshStandardMaterial({
      map: piece_texture[3],
      normalMap: piece_texture[4],
      roughness: piece_texture[5],
    }),
    new THREE.MeshStandardMaterial({
      map: piece_texture[0],
      normalMap: piece_texture[1],
      roughness: piece_texture[2],
    }),

  ]


  function arrangePieces() {

    for (let x = 0; x < 2; x++) {

      chessPieces[0].position.set(x * 7, 0.15, 4)
      chessPieces[0].material = Piece_material[x]
      scene.add(chessPieces[0].clone())

      chessPieces[1].position.set(x * 7, 0.15, 3)
      chessPieces[1].material = Piece_material[x]
      scene.add(chessPieces[1].clone())

      for (let y = 0; y < 2; y++) {

        chessPieces[2].position.set(x * 7, 0.15, y * 7)
        chessPieces[2].material = Piece_material[x]
        scene.add(chessPieces[2].clone())

        chessPieces[3].position.set(x * 7, 0.15, 3 * y + 2)
        chessPieces[3].material = Piece_material[x]
        scene.add(chessPieces[3].clone())

        chessPieces[4].position.set(x * 7, 0.15, 5 * y + 1)
        chessPieces[4].material = Piece_material[x]
        chessPieces[4].rotation.set(radian(90), 0, radian(x == 0 ? 90 : -90))
        scene.add(chessPieces[4].clone())

      }

      for (let y = 0; y < 8; y++) {

        chessPieces[5].position.set(5 * x + 1, 0.15, y)
        chessPieces[5].material = Piece_material[x]
        scene.add(chessPieces[5].clone())

      }
    }
  }

  const mouse = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()

  function onPointerMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  }

  document.addEventListener('mousemove', onPointerMove)
  renderer.domElement.addEventListener('click', onclick, true)

  function onclick() {

    raycaster.setFromCamera(mouse, camera)
    let intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
      
      console.log(intersects)
    }

  }

  //rendering
  function render(time) {

    renderer.render(scene, camera)
    requestAnimationFrame(render)

  }

  requestAnimationFrame(render)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
