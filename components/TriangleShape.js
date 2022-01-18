import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const TOTALSHAPES = 3;

const TriangleShape = (props) => {

    const shapeRef = useRef(null);
    const controls = useRef(null);
    const groups = {};

    let scene, renderer, helper, camera;
    const parent = new THREE.Object3D();

    const init = (width, height)=>{
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        
       //helper = new THREE.GridHelper( 160, 100 );
        //helper.rotation.x = Math.PI / 2;
        //scene.add( helper );
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
	    renderer.setPixelRatio( window.devicePixelRatio );  
        renderer.setSize(width, height);
        setupCamera(width, height);  
        var light = new THREE.HemisphereLight(0x000000, 0xFFFFFF, 1.0);
        scene.add(light);
        scene.add( parent );
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
        //group.rotation.z = depth;
        group.scale.y *=  -1;

        const shape = `<svg><path d="${path}"/></svg>`
  
        const svgData = loader.parse(shape);

    
        for ( let i = 0; i < svgData.paths.length; i ++ ) {
            const path =  svgData.paths[ i ];

            const material = new THREE.MeshLambertMaterial({color: colour, side:THREE.DoubleSide, depthWrite:true});

            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {
                const shape = shapes[ j ];
                const geometry = new THREE.ExtrudeGeometry(shape, {depth: 15,bevelEnabled: false});
                //geometry.center();
                const mesh = new THREE.Mesh( geometry, material );
                group.add( mesh );
            }
        }
        return group;
    }

    useEffect(() => {
       
        init((window.innerWidth-300)/TOTALSHAPES, (window.innerWidth-300)/TOTALSHAPES) 

        const setpath = (path, chapter, colour)=>{
            
            Object.keys(groups).map((k,i)=>{
                const g = groups[k];
                g.children[0].material.color.setHex(colour[i]);
            })

            if (groups[chapter]){
                parent.remove(groups[chapter]);
            }

            groups[chapter] = addShapes(path, chapter*4, Object.keys(groups).length > 1 ? 0x4E89F8 : colour[0]);
            parent.add(groups[chapter]);
            console.log("Adding chapter", chapter, "x", groups[chapter].position.x, "y", groups[chapter].position.y, "z", groups[chapter].position.z);

            parent.position.y = 10; //how close to top (make vary with chapter)
            parent.position.x = 0; //intercept with axis
            parent.position.z = -1;
            parent.rotation.x =  Math.PI / 2;
        };
        
        shapeRef.current.appendChild(renderer.domElement);
        const _controls = new OrbitControls( camera, renderer.domElement );
     
        _controls.screenSpacePanning = true;

        const animate =  ()=> {
            requestAnimationFrame(animate);
            parent.rotation.z += 0.002;
            //parent.rotation.y += 0.002;
           
            //parent.rotation.z += 0.002;
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
    props.paths.map((p,i)=>controls.current.setpath(p, i, props.colour))
   },[props.paths])

   const [windowSize, setWindowSize] = useState({width: 500,height: 500});


 
//<div style={{ position:"absolute", width: "90%", height: "600px", margin: "40px", border:"2px solid black" }}/>
 return (
   
     
          <div onClick={props.onClick} style={{display:"flex",justifyContent:"center", ...props.style}}>
            <div style={{ background:"transparent", width: (windowSize.width-300)/TOTALSHAPES, height: (windowSize.width-300)/TOTALSHAPES, margin: "0px" }} ref={shapeRef}/>
          </div>
 );
};
 
export default TriangleShape;