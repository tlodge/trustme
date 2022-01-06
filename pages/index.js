
import styles from '../styles/Home.module.css'

import {useRef, useState, useEffect} from 'react';

import * as d3 from 'd3';
import TriangleShape from '../components/TriangleShape';


const ROTATIONTIME = 1000;
const CX = 109, CY = 89; 






export default function Home() {
  

const useD3 = (d3Fn, dependencies) => {
  const ref = useRef();
  useEffect(() => {
      d3Fn(d3.select(ref.current));
      return () => {};
    }, dependencies);
  return ref;
}

const questionfor = (q)=>{
  switch(q){
    case "q1":
      return "What the system is"
    
    case "q2":
      return "What the system does"

    case "q3":
      return "How the system works"
  }
}
  const LIMITY = {
    q1: {max:85.7, min:16.6},
    q2: {max:127.16, min:93},
    q3: {max:127, min:93},
  }

  const LIMITX = {
    q1: {max:109.5, min:109.5},
    q2: {max:172.5, min:113.8},
    q3: {max:103.9, min:45.5},
  }

  const q2ypos = (x)=>{
    return (18/31 * x) + 27
  }

  const q3ypos = (x)=>{
    return (-13.5/23 * x) + 154
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
    q1: (x)=>109.5,
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
    //console.log(xcontrolfn[name](x,y), ycontrolfn[name](x,y));
    return {x:limitx(name,xcontrolfn[name](x,y)), y:limity(name,ycontrolfn[name](x,y))}
  }

  const genLine = (_coords)=>{
    const {bl,br,t} = _coords;
    return `M${t.x},${t.y}L${bl.x},${bl.y}L${br.x},${br.y}L${t.x},${t.y}Z`
  }

  const fromto = (from, to)=>{
    if (from == "q1"){
      if (to === "q2"){
        return [0,-120, CX, CY, CX+1, CY+2];
      }
      if (to === "q3"){
        return [0,-240, CX, CY, CX+0.8, CY+1.2];
      }
      return [0,0];
    }
    
    if (from == "q2"){
      if (to === "q1"){
        return [-120, 0, CX+1, CY+2, CX, CY];
      }
      if (to === "q3"){
        return [-120,-240, CX+1, CY+2, CX+0.8, CY+1.2];
      }
      return [0,0];
    }

    if (from === "q3"){
      if (to === "q1"){
        return [-240,0, CX+0.8, CY+1.2, CX, CY]
      }
      if (to === "q2"){
        return [-240,-120, CX+0.8, CY+1.2, CX+1, CY+2]
      }
      return [0,0];
    }
  }

  const triangle = useD3((root)=>{
    
    let _points = points;

    const controls = root.select("g#controls");
    const q1 = controls.select("circle#q1");
    const q2 = controls.select("circle#q2");
    const q3 = controls.select("circle#q3");
    const dimshape = root.select("path#dimshape");
    const triangle = root.select("g#bigtriangle");

    q2.on("click", function(){
      if ("q2" === selected){
        return;
      }
      const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, "q2");
    
      triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
        const from = `rotate(${_from}, ${cx1}, ${cy1})`
        return d3.interpolate(from, to);
      });
      setSelected("q2");
    });

    q1.on("click", function(){
      if ("q1" === selected){
        return;
      }
      const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, "q1");
      
      triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
        const from = `rotate(${_from}, ${cx1}, ${cy1})`
        return d3.interpolate(from, to);
      })
      setSelected("q1");
    });


    q3.on("click", function(){
      if ("q3" === selected){
        return;
      }
      const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, "q3");
      triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
        const from = `rotate(${_from}, ${cx1}, ${cy1})`
        return d3.interpolate(from, to);
      })
      setSelected("q3");
    });

    const controlpoints = {q1,q2,q3};

    const linefn = (points)=>{
      return `M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`;
    }

    Object.keys(controlpoints).map((name)=>{
      const elem = controlpoints[name];
 
      elem.call(d3.drag().on("drag", (e)=>{
        if (name===selected){
          const {x,y} = controlfn(name,e.x,e.y);
          _points = {..._points, [name] : {x, y}}
      
          elem.attr("cx",x).attr("cy",y);
          dimshape.attr("d", linefn(_points));
        }
      }).on("end", ()=>{
        if (name===selected){
          setPoints(_points);
        }
      }))
      
    })
  });

  

  const  colour = d3.scaleSequential(d3.interpolateRdYlBu).domain([0,10]);
 
  const [points, setPoints] = useState({q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}});
  const [selected, setSelected] = useState("q1");
  
 
  return (
    <div style={{display:'flex', flexDirection:"column"}}>
    
      <svg ref={triangle} width="100%" height="50vh" viewBox="0 0 232 144" className={styles.trianglesvg}>
        <g id="bigtriangle">
          <path d="M45.884,127.352L109.629,17.053L172.902,127.352L45.884,127.352Z" className={styles.outertriangle}/>
         
          <path d="M109.708,17.272L109.527,90.317" className={styles.triangleoutline}/>
          <path d="M46.236,126.829L109.495,90.306" className={styles.triangleoutline}/>
          <path d="M172.705,127.087L109.616,90.352" className={styles.triangleoutline}/>
          
          <circle cx={109.5} cy={90.5} r={5} className={styles.zeroline}/>
          
          <path id="dimshape" d={`M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`} className={styles.innertriangle}/>
          
          <g id="controls">
            <circle id="q1" cx={points.q1.x} cy={points.q1.y} r={8} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint}/>
            <circle id="q2" cx={points.q2.x} cy={points.q2.y} r={8} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint}/>
            <circle id="q3" cx={points.q3.x} cy={points.q3.y} r={8} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint}/>
          </g>
        </g>
        <text x="44px" y="132px" className={styles.textvalue}>100</text>
        <text x="174px" y="132px" className={styles.textvalue}>100</text>
        <text x="109.5px" y="14px" className={styles.textvalue}>100</text>
    
        <text x="108px" y="92px" className={styles.text0value}>0</text>
        <text x="109.5px" y="7.29px" className={styles.questiontext}>{questionfor(selected)}</text>
    </svg>
    <TriangleShape path={`M${points.q3.x-CX},${points.q3.y-CY}L${points.q1.x-CX},${points.q1.y-CY}L${points.q2.x-CX},${points.q2.y-CY}Z`}/>
    </div>
  )
}
