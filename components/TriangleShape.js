import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const TriangleShape = (props) => {

    const shapeRef = useRef(null);
    const controls = useRef(null);
    const groups = {};

    let scene, renderer, helper, camera;

    const init = (width, height)=>{
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        
        helper = new THREE.GridHelper( 160, 10 );
        helper.rotation.x = Math.PI / 2;
        //scene.add( helper );
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
	    renderer.setPixelRatio( window.devicePixelRatio );  
        renderer.setSize(width, height);
        setupCamera(width, height);  
        var light = new THREE.HemisphereLight(0x000000, 0xFFFFFF, 1.0);
        scene.add(light);
       
    }
    
    const loader = new SVGLoader();

    const setupCamera = (width, height)=>{
        camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        camera.position.set(0,0,20);
    }

  

    const addShapes = (path, depth, colour)=>{
       
        const group = new THREE.Group();
        group.scale.multiplyScalar( 0.25 );
        group.position.x =  0;
        group.position.y = 0;
        group.position.z = depth;
        group.rotation.z = depth;
        group.scale.y *=  -1;

        const shape = `<svg><path d="${path}"/></svg>`
  
        const svgData = loader.parse(shape);

    
        for ( let i = 0; i < svgData.paths.length; i ++ ) {
            const path =  svgData.paths[ i ];

            const material = new THREE.MeshLambertMaterial({color: colour, side:THREE.DoubleSide, depthWrite:true});

            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {

                const shape = shapes[ j ];
                //const geometry = new THREE.ShapeGeometry( shape );
                const geometry = new THREE.ExtrudeGeometry(shape, {depth: 5,bevelEnabled: false});
                geometry.center();
                const mesh = new THREE.Mesh( geometry, material );
                group.add( mesh );
            }
        }
        return group;
    }

    useEffect(() => {
       
        let group;
        let depth=0;

        //init(shapeRef.current.clientWidth,shapeRef.current.clientHeight);   
        init((window.innerWidth-300)/5, (window.innerWidth-300)/5) 

        const setpath = (path, chapter, colour)=>{
            
            if (groups[chapter]){
                scene.remove(groups[chapter]);
            }
            groups[chapter] = addShapes(path, chapter*1.3, colour);
            scene.add(groups[chapter]);
        };
        
        shapeRef.current.appendChild(renderer.domElement);
        const _controls = new OrbitControls( camera, renderer.domElement );
        _controls.screenSpacePanning = true;

        const animate =  ()=> {
            requestAnimationFrame(animate);

            if (groups[0]){
                const {x,y} = groups[0].rotation;

                for (const key of Object.keys(groups)){
                    const group = groups[key];
                   // group.rotation.x = x + 0.01;
                    //group.rotation.y = y + 0.01;
                }
             }
            renderer.render(scene, camera);
        };
        
        controls.current = { setpath };

        animate();
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
    }, []);

   useEffect(()=>{
        controls.current.setpath(props.path, props.chapter, props.colour);
   },[props.path, props.chapter])

   const [windowSize, setWindowSize] = useState({width: 500,height: 500});


 
//<div style={{ position:"absolute", width: "90%", height: "600px", margin: "40px", border:"2px solid black" }}/>
 return (
   
     
          <div onClick={props.onClick} style={{display:"flex",justifyContent:"center", ...props.style}}>
            <div style={{ background:"transparent", width: (windowSize.width-300)/5, height: (windowSize.width-300)/5, margin: "0px" }} ref={shapeRef}/>
          </div>
 );
};
 
export default TriangleShape;