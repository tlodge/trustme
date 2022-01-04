import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as THREE from 'three';
import { useLoader, useThree} from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame } from "@react-three/fiber";
import {useRef, useState} from 'react';
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as d3 from 'd3';
import {useD3} from './hooks/useD3';

const SVGMARGIN = 40;
//const svgData = loader.parse(svgMarkup);
function SvgShape(props) {
  
  const mesh = useRef();
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  //useFrame((state, delta) => (/*mesh.current.rotation.y += 0.01)*/))

  const geometry = new THREE.ExtrudeGeometry(props.shape, {depth: 5,bevelEnabled: false});
  geometry.center();

  useFrame((state, delta) => {
      mesh.current.rotation.x  = (mesh.current.rotation.x - 0.01) % (360 * Math.PI/180);
      
      //console.log(mesh.current.rotation.x*180/Math.PI, mesh.current.rotat)
      //mesh.current.rotation.y += 0.01; 
      mesh.current.rotation.z += 0.01;
  });

  return (

    <mesh
      {...props}
      ref={mesh}
      geometry={geometry} 
      position={props.position}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}

      >
      <meshStandardMaterial color={props.color} />
    </mesh>

     
      
  );
}



/*
<mesh
          ref={mesh}
      >
          <shapeBufferGeometry attach="geometry" args={[shape]} />
          <meshBasicMaterial
              aspect={window.innerWidth / window.innerHeight}
              attach="material"
              color={color}
              opacity={1}
              side={THREE.DoubleSide}
              flatShading={true}
              depthWrite={true}
              
        polygonOffset
        polygonOffsetFactor={index * -0.1}
    />
</mesh>*/



function Scene(props) {
  
  const loader = new SVGLoader();

  const svgData = loader.parse( document.querySelector("svg#trustshape").outerHTML);
  
  ;(`<svg width="100%" height="100%">
    <path d="M0,0.475l22.976,42.529l-45.951,-0l22.975,-42.529Z" style="fill:#c7b461;stroke:#000;stroke-width:0.95px;"/>
  </svg>`);


  const shapes = svgData.paths.reduce((acc, path) => {
    return [...acc, ...path.toShapes(true)]
  },[])

  return (<group 
          color={new THREE.Color(0xb0b0b0)} >
          {shapes.map((item,i) =>  
              <SvgShape key={item.uuid} {...{...props, shape:item, index:i}} />
          )}
      </group>
     
  );
  
}

export default function Home() {
  
 
  const LIMITY = {
    q1: {max:91, min:15},
    q2: {max:127, min:91},
    q3: {max:126, min:91},
  }

  const LIMITX = {
    q1: {max:106.5, min:106.5},
    q2: {max:173, min:106},
    q3: {max:106, min:47},
  }

  const q2ypos = (x)=>{
    return (17/32 * x) + 34.92
  }

  const q3ypos = (x)=>{
    return (-13.5/23 * x) + 153.72
  }
  
  const q1ypos = (x,y)=>{
    return y;
  }
  
 

  const ycontrolfn = {
    q1:q1ypos,
    q2:q2ypos,
    q3:q3ypos,
  }

  const xcontrolfn = {
    q1: (x)=>106.5,
    q2: (x)=>x,
    q3: (x)=>x
  }
  
  const limitx = (name,x)=>{
    return Math.min(LIMITX[name].max,Math.max(x,LIMITX[name].min));
  }

  const limity = (name, y)=>{
      return Math.min(LIMITY[name].max,Math.max(y,LIMITY[name].min));
  }
  

  const controlfn = (name, x,y)=>{
    return {x:limitx(name,xcontrolfn[name](x,y)), y:limity(name,ycontrolfn[name](x,y))}
  }

  const genLine = (_coords)=>{
    const {bl,br,t} = _coords;
    return `M${t.x},${t.y}L${bl.x},${bl.y}L${br.x},${br.y}L${t.x},${t.y}Z`
  }

  const triangle = useD3((root)=>{
    
    let _points = points;

    const controls = root.select("g#controls");
    const q1 = controls.select("circle#q1");
    const q2 = controls.select("circle#q2");
    const q3 = controls.select("circle#q3");
    const dimshape = root.select("path#dimshape");

    const controlpoints = {q1,q2,q3};

    const linefn = (points)=>{
      return `M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`;
    }

    Object.keys(controlpoints).map((name)=>{
      const elem = controlpoints[name];

      elem.call(d3.drag().on("drag", (e)=>{
        
        const {x,y} = controlfn(name,e.x,e.y);
console.log(x,y)
        _points = {..._points, [name] : {x, y}}
      
        elem.attr("cx",x).attr("cy",y);
        dimshape.attr("d", linefn(_points));
      }).on("end", ()=>{
        setPoints(_points);
      }))
    })
  });

  const editshape = useD3((root)=>{
    let _coords = coords;
    const controls = root.select("g#controls");

    const bl = controls.select("circle#bottomleft");
    const br = controls.select("circle#bottomright");
    const t = controls.select("circle#top");
    
    [{name:"br", elem:br},{name:"bl",elem:bl},{name:"t", elem:t}].map((item)=>{
      const {name,elem} = item;

      elem.call(d3.drag().on("drag", (e)=>{

        _coords = {..._coords, [name] : {x:e.x, y:e.y}}
        root.select("path").attr("d", genLine(_coords));
        elem.attr("cx",e.x).attr("cy",e.y);
      }).on("end", ()=>{
        setCoords(_coords);
      }))
    })
  });

  const  colour = d3.scaleSequential(d3.interpolateRdYlBu).domain([0,10]);
  const [coords, setCoords] = useState({br:{x:46.436,y:43}, bl:{x:0,y:43}, t:{x:23.45,y:0}})
  const [points, setPoints] = useState({q1:{x:106.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}});

  /*const scenes = [-5,-4,-3,-2,-1,0,1,2,3,4,5].map((scene,i)=>{
    return <Scene position={[0, 0, scene*2]} color={new THREE.Color(colour(i))} rotation={[-90*Math.PI/180, -0*Math.PI/180, -0*Math.PI/180]}/>
  })*/

 
  return (
    <div style={{display:'flex', flexDirection:"row"}}>
      {/*<div className={styles.canvascontainer}>
        <Canvas camera={{ fov: 95, position: [0, -40, 0]}}>
          <ambientLight />
          {scenes}
        </Canvas>
  </div>*/}
      {/*<div className={styles.svgcontainer}>
        <svg ref={editshape} id="trustshape" width="100%" height="100%">
          <g transform={`translate(${SVGMARGIN},10)`}>
            <path d={`M${coords.t.x},${coords.t.y}L${coords.bl.x},${coords.bl.y}L${coords.br.x},${coords.br.y}L${coords.t.x},${coords.t.y}Z`} style={{fill:"#c7b461",stroke:"#000",strokeWidth:0.95}}/>
            <g id="controls">
              <circle id="bottomright" cx={coords.br.x} cy={coords.br.y} r={4} style={{fill:"white", stroke:"black"}}/>
              <circle id="bottomleft" cx={coords.bl.x} cy={coords.bl.y} r={4} style={{fill:"white", stroke:"black"}}/>
              <circle id="top" cx={coords.t.x} cy={coords.t.y} r={4} style={{fill:"white", stroke:"black"}}/>
            </g>
          </g>
        </svg>
</div>*/}


      <svg ref={triangle} width="100%" height="100%" viewBox="0 0 232 144" className={styles.trianglesvg}>
     
        <path d="M46.56,126.653l59.941,-111.221l66.401,111.92l-126.342,-0.699Z" className={styles.outertriangle}/>
        <path d="M46.62,126.663l59.665,-35.362" className={styles.triangleoutline}/>
        <path d="M106.526,15.954l-0.187,75.471" className={styles.triangleoutline}/>
        <path d="M173.001,127.195l-66.671,-35.849" className={styles.triangleoutline}/>
        <circle cx={106.5} cy={91.5} r={5} className={styles.zeroline}/>

        
        <path id="dimshape" d={`M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`} className={styles.innertriangle}/>
        
        <g id="controls">
          <circle id="q1" cx={points.q1.x} cy={points.q1.y} r={8} className={styles.controlpoint}/>
          <circle id="q2" cx={points.q2.x} cy={points.q2.y} r={8} className={styles.controlpoint}/> 
          <circle id="q3" cx={points.q3.x} cy={points.q3.y} r={8} className={styles.controlpoint}/>
        </g>

        
      
        
        <text x="36.424px" y="130.615px" className={styles.textvalue}>100</text>
        <text x="174.57px" y="130.045px" className={styles.textvalue}>100</text>
        <text x="101.172px" y="13.287px" className={styles.textvalue}>100</text>
    
        <text x="105px" y="93.5px" className={styles.text0value}>0</text>
        <text x="77.045px" y="5.29px" className={styles.questiontext}>What the system is</text>
        <text x="0.112px" y="141.19px" className={styles.questiontext}>Why the system works</text>
        <text x="144.567px" y="141.955px" className={styles.questiontext}>How the system works</text>
    </svg>

    </div>
  )
}
