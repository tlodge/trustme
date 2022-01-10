
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

  const q1scale = d3.scaleLinear().domain([16.6, 85.7]).range([100,0]);
  const q2scale = d3.scaleLinear().domain([93, 127.16]).range([0,100]);
  const q3scale = d3.scaleLinear().domain([93, 127.16]).range([0,100]);
  const q1value = (x, y)=>{
    return Math.ceil(q1scale(y));
  }
  
  const q2value = (x, y)=>{
    return Math.ceil(q2scale(y));
  }

  const q3value = (x, y)=>{
    return Math.ceil(q3scale(y));
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


  const rightof = (q)=>{
    if (q=="q1"){
      return "q2"
    }
    if (q == "q2"){
      return "q3"
    }
    return "q1"
  }

  const leftof = (q)=>{
    if (q=="q3"){
      return "q2"
    }
    if (q == "q2"){
      return "q1"
    }
    return "q3"
  }

  const rotationFor = (current, selected)=>{
    if (selected == "q2"){
      if (current=="q2"){
        return 'rotate (120,0,0)'
      }    
    }

    if (selected == "q3"){
      if (current=="q3"){
        return 'rotate (-120,0,0)'
      }
    }
    return 'rotate (0,0,0)'
  }

  const triangle = useD3((root)=>{
    
    let _points = points;

    const controls = root.select("g#controls");
    const q1 = controls.select("g#q1");
    const q2 = controls.select("g#q2");
    const q3 = controls.select("g#q3");

    const rleft =  root.select("path#rotleft");
    const rright =  root.select("path#rotright");

    const dimshape = root.select("path#dimshape");
    const triangle = root.select("g#bigtriangle");

    /*q2.on("click", function(){
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
    });*/

    rleft.on("click", function(){
      //if ("q1" === selected){
      //  return;
      //}
      const q = leftof(selected);
      const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, q);
      
      triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
        const from = `rotate(${_from}, ${cx1}, ${cy1})`
        return d3.interpolate(from, to);
      })
      setSelected(q);
    });


    rright.on("click", function(){
      //if ("q3" === selected){
      //  return;
      //}
      const q = rightof(selected);
      
      const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, q);

      
      triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
        const from = `rotate(${_from}, ${cx1}, ${cy1})`
        return d3.interpolate(from, to);
      })
      setSelected(q);
    });

    const controlpoints = {q1,q2,q3};

    const linefn = (points)=>{
      return `M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`;
    }

    Object.keys(controlpoints).map((name)=>{
      const elem = controlpoints[name];
 
      elem.call(d3.drag().on("drag", (e)=>{
        //if (name===selected){
          const {x,y} = controlfn(name,e.x,e.y);
          _points = {..._points, [name] : {x, y}}
          elem.attr("transform", `translate(${x},${y}) ${rotationFor(selected,name)}`)
          //elem.attr("cx",x).attr("cy",y);
          dimshape.attr("d", linefn(_points));
        //}
      }).on("end", ()=>{
        //if (name===selected){
          setPoints(_points);
       // }
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
            <g id="q1" transform={`translate(${points.q1.x},${points.q1.y}) ${rotationFor(selected,"q1")}`}>
              <circle id="q1"  r={8} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint}/>
              <text y={2.5} className={styles.value}>{q1value(points.q1.x,points.q1.y)}</text>
            </g>
            <g id="q2" transform={`translate(${points.q2.x},${points.q2.y}) ${rotationFor(selected,"q2")}`}>
              <circle id="q2"  r={8} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint}/>
              <text y={2.5} className={styles.value}>{q2value(points.q2.x,points.q2.y)}</text>
            </g>
            <g id="q3" transform={`translate(${points.q3.x},${points.q3.y}) ${rotationFor(selected,"q3")}`}>
              <circle id="q3"  r={8} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint}/>
              <text y={2.5} className={styles.value}>{q3value(points.q3.x,points.q3.y)}</text>
            </g>
          </g>
        </g>
        {/*text x="44px" y="132px" className={styles.textvalue}>100</text>
        <text x="174px" y="132px" className={styles.textvalue}>100</text>*/}  
        <text x="109.5px" y="14px" className={styles.textvalue}>100</text>
    
        <text x="108px" y="92px" className={styles.text0value}>0</text>
        <text x="109.5px" y="7.29px" className={styles.questiontext}>{questionfor(selected)}</text>

        <path id="rotright" className={styles.rotation} d="M174,139c1.67,1.437 3.989,2.05 6.261,1.437c3.326,-0.897 5.416,-4.117 5.023,-7.469l-1.357,0.343l1.379,-3.093l2.757,2.049l-1.33,0.335c0.576,4.218 -2.013,8.298 -6.173,9.42c-2.775,0.749 -5.609,0.008 -7.669,-1.737l1.109,-1.285Z" />

        <path id="rotleft"  className={styles.rotation} d="M46,139c-1.67,1.437 -3.989,2.05 -6.261,1.437c-3.326,-0.897 -5.417,-4.117 -5.023,-7.469l1.357,0.343l-1.379,-3.093l-2.757,2.049l1.329,0.335c-0.575,4.218 2.014,8.298 6.174,9.42c2.775,0.749 5.608,0.008 7.669,-1.737l-1.109,-1.285Z" /> 
    
    </svg>
    <TriangleShape path={`M${points.q3.x-CX},${points.q3.y-CY}L${points.q1.x-CX},${points.q1.y-CY}L${points.q2.x-CX},${points.q2.y-CY}Z`}/>
    </div>
  )
}
