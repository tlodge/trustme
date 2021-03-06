import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



const TriangleShape = (props) => {
    const TOTALSHAPES = props.deviceType === "mobile" ? 1 : 3;
    const shapeRef = useRef(null);
    const controls = useRef(null);
    const groups = {};

    let scene, renderer, helper, camera;
    const parent = new THREE.Object3D();

    const init = (width, height)=>{
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x2b2b55 );
        
       //helper = new THREE.GridHelper( 160, 100 );
        //helper.rotation.x = Math.PI / 2;
        //scene.add( helper );
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
	    renderer.setPixelRatio( window.devicePixelRatio );  
        renderer.setSize(width, height);
        setupCamera(width, height);  
        var light = new THREE.HemisphereLight(0x000000, 0xFFFFFF, 2.0);
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
        camera.position.set(0,0,25);
    }

  

    const addShapes = (path, depth, bevel, colour)=>{
 
        const group = new THREE.Group();
        group.scale.multiplyScalar( 0.25 );
        group.position.x =  0;
        group.position.y = 0;
        group.position.z = -depth;
        group.scale.y *=  -1;

        const shape = `<svg><path d="${path}"/></svg>`
  
        const svgData = loader.parse(shape);

    
        for ( let i = 0; i < svgData.paths.length; i ++ ) {
            const path =  svgData.paths[ i ];

            const material = new THREE.MeshLambertMaterial({color: colour, side:THREE.DoubleSide, depthWrite:true});

            const shapes = SVGLoader.createShapes( path );

            for ( let j = 0; j < shapes.length; j ++ ) {
                const shape = shapes[ j ];
                const geometry = new THREE.ExtrudeGeometry(shape, {depth: bevel,bevelEnabled: false});
                geometry.center();
                const mesh = new THREE.Mesh( geometry, material );
                group.add( mesh );
            }
        }
        return group;
    }

    useEffect(() => {
       
        const DIMSHAPE = props.deviceType==="mobile" ? window.innerWidth : 300;// (window.innerWidth-320)/TOTALSHAPES;

        init(DIMSHAPE, DIMSHAPE-100);
 
        const depths = [0,0,10,6.65,5,4,3.3,2.85,2.5];
        const ty = [0,0,-5,-6.5,-7,-8,-9,-9.5,-10];

        const setpath = (path, chapter, colour, tc)=>{
    
            Object.keys(groups).map((k,i)=>{
                const g = groups[k];
                g.children[0].material.color.setHex(colour[i]);
            })

            if (groups[chapter]){
                parent.remove(groups[chapter]);
                delete groups[chapter];
            }
            
            const TOTALCHAPTERS = Math.max(tc,Object.keys(groups).length + 1);      
            groups[chapter] = addShapes(path, depths[TOTALCHAPTERS]*chapter, 80/(TOTALCHAPTERS), TOTALCHAPTERS> 1 ? props.selectedColour : colour[0]);
            //TODO: record resources that are used here then when deleting a group make sure dispose, i.e:
            //geometry.dispose();
			///	material.dispose();
		    //	texture.dispose();
            parent.add(groups[chapter]);
            parent.position.y = ty[TOTALCHAPTERS]
        };
        
        parent.position.x = 0; //intercept with axis
        parent.position.z = -1.5;
        parent.rotation.x =  Math.PI / 2;

        shapeRef.current.appendChild(renderer.domElement);
        const _controls = new OrbitControls( camera, renderer.domElement );
     
        _controls.screenSpacePanning = true;

        const animate =  ()=> {
            requestAnimationFrame(animate);
            parent.rotation.z += 0.002;
            parent.rotation.x = Math.PI / 2  + 0.4
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
        props.paths.map((p,i)=>controls.current.setpath(p, i, props.colour, (props.paths||[]).length))
   },[props.paths])

 const [windowSize, setWindowSize] = useState({width: 500,height: 500});
 const DIMSHAPE = props.deviceType==="mobile"  ? windowSize.width:300 /*(windowSize.width-320)/TOTALSHAPES;*/
 
 return (
          <div onClick={props.onClick} style={{display:"flex",justifyContent:"center", ...props.style}}>
            <div style={{ background:"black", width: {DIMSHAPE}, height: {DIMSHAPE}, margin: "0px" }} ref={shapeRef}/>
          </div>
 );
};
 
export default TriangleShape;