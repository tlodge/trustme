import styles from '../styles/FivePoint.module.css'
import {
    useRef,
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';

const TOTALSHAPES =3;
const ROTATIONTIME = 1000;
const CX = 75.5, CY = 83;

const questionfor = (q) => {
    switch (q) {
        case "q1":
            return "I KNOW what the system is"

        case "q2":
            return "I KNOW what the system does"

        case "q3":
            return "I KNOW how the system works"

        case "q4":
            return "I KNOW how the system works"
        
        case "q5":
            return "This is something else!"
    }
}

const LIMITY = {
    q1: {
        max: 85.7,
        min: 16.6
    },
    q2: {
        max: 127.16,
        min: 93
    },
    q3: {
        max: 127,
        min: 93
    },
    q4: {
        max: 127,
        min: 93
    },
    q5: {
        max: 127,
        min: 93
    },
}

const LIMITX = {
    q1: {
        max: 109.5,
        min: 109.5
    },
    q2: {
        max: 172.5,
        min: 113.8
    },
    q3: {
        max: 103.9,
        min: 45.5
    },
    q4: {
        max: 172.5,
        min: 113.8
    },
    q5: {
        max: 103.9,
        min: 45.5
    },
}

const q1scale = d3.scaleLinear().domain([16.6, 85.7]).range([100, 0]);
const q2scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);
const q3scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);
const q4scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);
const q5scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);

const q1value = (x, y) => {
    return Math.ceil(q1scale(y));
}

const q2value = (x, y) => {
    return Math.ceil(q2scale(y));
}

const q3value = (x, y) => {
    return Math.ceil(q3scale(y));
}

const q4value = (x, y) => {
    return Math.ceil(q3scale(y));
}

const q5value = (x, y) => {
    return Math.ceil(q3scale(y));
}

const q1ypos = (x, y) => y;
const q2ypos = (x)=>(-0.33*x) + 108.6;
const q3ypos = (x)=>(1.38*x) -20.72;
const q4ypos = (x)=>(-1.39*x) + 187.79;
const q5ypos = (x)=>(0.32*x) + 59.24;

const ycontrolfn = {
    q1: q1ypos,
    q2: q2ypos,
    q3: q3ypos,
    q4: q4ypos,
    q5: q5ypos,
}

const xcontrolfn = {
    q1: (x) => 75.6,
    q2: (x) => x,
    q3: (x) => x,
    q4: (x) => x,
    q5: (x) => x,
}

const limitx = (name, x) => {
    return Math.min(LIMITX[name].max, Math.max(x, LIMITX[name].min));
}

const limity = (name, y) => {
    return Math.min(LIMITY[name].max, Math.max(y, LIMITY[name].min));
}


const controlfn = (name, x, y) => {
    //console.log(xcontrolfn[name](x,y), ycontrolfn[name](x,y));
    return {
        x: xcontrolfn[name](x, y), //limitx(name, xcontrolfn[name](x, y)),
        y: ycontrolfn[name](x, y), //limity(name, ycontrolfn[name](x, y))
    }
}

const fromto = (from, to) => {
    if (from == "q1") {
        if (to === "q2") {
            return [0, -72, CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [0, -144, CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [0, -216, CX,CY,CX,CY];
        }
        if (to === "q5") {
            return [0, -288,CX,CY,CX,CY];
        }
        return [0, 0];
    }

    if (from == "q2") {
        if (to === "q1") {
            return [-72, 0,CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [-72, -144, CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [-72, -216, CX,CY,CX,CY];
        }
        if (to === "q5") {
            return [-72, -288, CX,CY,CX,CY];
        }
    }

    if (from === "q3") {
        if (to === "q1") {
            return [-144, 0, CX,CY,CX,CY];
        }
        if (to === "q2") {
            return [-144, -72, CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [-144, -216, CX,CY,CX,CY];
        }
        if (to === "q5") {
            return [-144, -288, CX,CY,CX,CY];
        }
    }

    if (from === "q4") {
        if (to === "q1") {
            return [-216, 0,  CX,CY,CX,CY];
        }
        if (to === "q2") {
            return [-216, -72,  CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [-216, -144, CX,CY,CX,CY];
        }
        if (to === "q5") {
            return [-216, -288,  CX,CY,CX,CY];
        }
    }

    if (from === "q5") {
        if (to === "q1") {
            return [-288, 0,  CX,CY,CX,CY];
        }
        if (to === "q2") {
            return [-288, -72,  CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [-288, -144,  CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [-288, -216,  CX,CY,CX,CY];
        }
    }

    return [0,0, CX,CY,CX,CY];
}


const rightof = (q) => {
    const positions = {
        "q1":"q2",
        "q2":"q3",
        "q3":"q4",
        "q4":"q5",
        "q5":"q1",
    }
    return positions[q];
}

const leftof = (q) => {
    const positions = {
        "q1":"q5",
        "q5":"q4",
        "q4":"q3",
        "q3":"q2",
        "q2":"q1",
    }
    return positions[q]
}

const FivePointFeedback = ({points, setPoints, colour, deviceType, width, height}) => {

    //const  colour = d3.scaleSequential(d3.interpolateRdYlBu).domain([0,10]);
    const [selected, setSelected] = useState("q1");
   
    const useD3 = (d3Fn, dependencies) => {
        const ref = useRef();
        useEffect(() => {
            d3Fn(d3.select(ref.current));
            return () => {};
        }, dependencies);
        return ref;
    }

    const zeroRotation = (q)=>{
        switch(q){
            case "q1":
                return "rotate(0, 109.5, 90.5)"
            case "q2":
                return "rotate(120,109.5, 90.5)"
            case "q3":
                return "rotate(-120,109.5, 90.5)"
        }
    }
    const hexagon = useD3((root)=>{
    
        let _points = points;
    
        const controls = root.select("g#controls");
        const q1 = controls.select("g#q1");
        const q2 = controls.select("g#q2");
        const q3 = controls.select("g#q3");
        const q4 = controls.select("g#q4");
        const q5 = controls.select("g#q5");


        const rleft =  root.select("g#rotleft");
        const rright =  root.select("g#rotright");

        const hexagon = root.select("g#bighexagon");
    
        rleft.on("click", function(){
          const q = leftof(selected);
          const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, q);
          
          hexagon.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
            const to =  `rotate(${_to}, ${cx2}, ${cy2})`
            const from = `rotate(${_from}, ${cx1}, ${cy1})`
            return d3.interpolate(from, to);
          })
          setSelected(q);
        });
    
    
        rright.on("click", function(){
          const q = rightof(selected);
          
          const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, q);
    
          
          hexagon.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
            const to =  `rotate(${_to}, ${cx2}, ${cy2})`
            const from = `rotate(${_from}, ${cx1}, ${cy1})`
            return d3.interpolate(from, to);
          })
          setSelected(q);
        });
    
        const controlpoints = {q1,q2,q3,q4,q5};
    
        const linefn = (points)=>{
          return `M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`;
        }
    
        Object.keys(controlpoints).map((name)=>{
            const elem = controlpoints[name];
                
            elem.on("click", ()=>{
            
                if (name !== selected){
                    const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, name);
      
                    hexagon.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
                        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
                        const from = `rotate(${_from}, ${cx1}, ${cy1})`
                        return d3.interpolate(from, to);
                    })
                    setSelected(name);
                }
            });

        elem.call(d3.drag().on("drag", (e)=>{
                if (name===selected){
                    const {x,y} = controlfn(name,e.x,e.y);
                    _points = {..._points, [name] : {x, y}}
                    elem.attr("transform", `translate(${x},${y})`);// ${rotationFor(selected,name)}`)
                
                    if (deviceType==="desktop"){
                        setPoints(_points);
                    }
                }
            }).on("end", ()=>{
                if (deviceType!=="desktop"){
                    setPoints(_points);
                }
            }))
          
          
        })
    });

 

    return  <div style={{padding:20}}>
                <svg ref={hexagon} width="100%" height={height-(width-300)/TOTALSHAPES - 44}  viewBox="0 0 151 144" className={styles.hexagon}>
                    <g>
                        <text x="78px" y="7.29px" className={styles.questiontext}>Personal experience</text>
                    </g>
                    <g id="bighexagon">
                        <path id="outerhex" d="M75.482,17.152L138.285,62.869L114.297,136.839L36.668,136.839L12.679,62.869L75.482,17.152Z" className={styles.outerhex}/>
                        

                        <path d="M75.508,83.474L75.63,17.067" className={styles.scaleline} />
                        <path d="M75.6,83.5L138.2,62.7" className={styles.scaleline}  />
                        <path d="M75.4,83.1L114.4,136.8" className={styles.scaleline} />
                        <path d="M75.3,83.3L36.6,137.0" className={styles.scaleline} />
                        <path d="M75.8,83.3L12.8,63.3" className={styles.scaleline} />
                    
                        <circle cx={75.5} cy={83} r={2} className={styles.center}/>

                        <g><text x="73.922px" y="85.036px" className={styles.zerotext}></text></g>

                        <path id="innerhex" d={`M${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}L${points.q3.x},${points.q3.y}L${points.q4.x},${points.q4.y}L${points.q5.x},${points.q5.y}L${points.q1.x},${points.q1.y}Z`} className={styles.innerhexline}/>
                        
                        <g id="controls">
                        
                            <g id="q1" transform={`translate(${points.q1.x},${points.q1.y})`}>
                                <circle id="q1" r={7} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q1" ? "white":colour[1]}}/>    
                            </g>
                            <g id="q2" transform={`translate(${points.q2.x},${points.q2.y})`}>
                                <circle id="q2" r={7} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q2" ? "white":colour[1]}}/>    
                            </g>
                            <g id="q3" transform={`translate(${points.q3.x},${points.q3.y})`}>
                                <circle id="q3" r={7} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q3" ? "white":colour[1]}}/>    
                            </g>
                            <g id="q4" transform={`translate(${points.q4.x},${points.q4.y})`}>
                                <circle id="q4" r={7} className={selected === "q4" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q4" ? "white":colour[1]}}/>    
                            </g>
                            <g id="q5" transform={`translate(${points.q5.x},${points.q5.y})`}>
                                <circle id="q5" r={7} className={selected === "q5" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q5" ? "white":colour[1]}}/>    
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
}

export default FivePointFeedback;