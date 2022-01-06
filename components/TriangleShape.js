import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const TriangleShape = (props) => {
    const shapeRef = useRef(null);
    const controls = useRef(null);

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
        var light = new THREE.HemisphereLight(0xD25252, 0xFFFFFF, 0.8);
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

  

    const addShapes = (path, depth)=>{
        console.log("ok path is", path);
        const group = new THREE.Group();
        group.scale.multiplyScalar( 0.25 );
        group.position.x =  0;
        group.position.y = 0;
        group.position.z = depth;
        group.rotation.z = depth;
        group.scale.y *=  -1;

        const shape = `<svg><path d="${path}"/></svg>`
        console.log("shape is", shape);
        const svgData = loader.parse(shape);

    
        for ( let i = 0; i < svgData.paths.length; i ++ ) {
            const path =  svgData.paths[ i ];

            const material = new THREE.MeshLambertMaterial({color: "#D25252", side:THREE.DoubleSide, depthWrite:true});

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

        init(shapeRef.current.clientWidth,shapeRef.current.clientHeight);   
           

        const setpath = (path)=>{
            if (group){
                scene.remove(group);
            }
            group = addShapes(path, depth);
           
            //depth += 2;
            scene.add(group);
        };
        
        shapeRef.current.appendChild(renderer.domElement);
        const _controls = new OrbitControls( camera, renderer.domElement );
        _controls.screenSpacePanning = true;

        const animate =  ()=> {
            requestAnimationFrame(animate);
            if (group){
                group.rotation.x += 0.01;
                group.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        };
        
        controls.current = { setpath };

        animate();
    }, []);

   useEffect(()=>{
        controls.current.setpath(props.path);
   },[props.path])

  
//<div style={{ position:"absolute", width: "90%", height: "600px", margin: "40px", border:"2px solid black" }}/>
 return (
   
     
          <div style={{display:"flex",justifyContent:"center"}}>
           
            <div style={{ background:"transparent", width: "100%", height: "400px", margin: "0px" }} ref={shapeRef}/>
            
          </div>
 );
};
 
export default TriangleShape;