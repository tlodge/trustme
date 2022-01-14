import styles from '../styles/FourPoint.module.css'
import {
    useRef,
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';

const TOTALSHAPES =3;
const ROTATIONTIME = 1000;
const CX = 63.3, CY = 76.6;

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
    }
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
    }
}

const q1scale = d3.scaleLinear().domain([16.6, 85.7]).range([100, 0]);
const q2scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);
const q3scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);
const q4scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);


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

const q1ypos = (x, y)=> y;
const q2ypos = (x, y)=>76;
const q3ypos = (x, y)=>y;
const q4ypos = (x, y)=>76;


const ycontrolfn = {
    q1: q1ypos,
    q2: q2ypos,
    q3: q3ypos,
    q4: q4ypos,
}

const xcontrolfn = {
    q1: (x) => 63.4,
    q2: (x) => x,
    q3: (x) => 63.4,
    q4: (x) => x,
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
            return [0, -90, CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [0, -180, CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [0, -270, CX,CY,CX,CY];
        }
    }

    if (from == "q2") {
        if (to === "q1") {
            return [-90, 0,CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [-90, -180, CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [-90, -270, CX,CY,CX,CY];
        }
    }

    if (from === "q3") {
        if (to === "q1") {
            return [-180, 0, CX,CY,CX,CY];
        }
        if (to === "q2") {
            return [-180, -90, CX,CY,CX,CY];
        }
        if (to === "q4") {
            return [-180, -270, CX,CY,CX,CY];
        }
    }

    if (from === "q4") {
        if (to === "q1") {
            return [-270, 0,  CX,CY,CX,CY];
        }
        if (to === "q2") {
            return [-270, -90,  CX,CY,CX,CY];
        }
        if (to === "q3") {
            return [-270, -180, CX,CY,CX,CY];
        }
    }
}


const rightof = (q) => {
    const positions = {
        "q1":"q2",
        "q2":"q3",
        "q3":"q4",
        "q4":"q5"
    }
    return positions[q];
}

const leftof = (q) => {
    const positions = {
        "q1":"q5",
        "q5":"q4",
        "q4":"q3",
        "q3":"q2"
    }
    return positions[q]
}

const rotationFor = (current, selected) => {
    
    if (current == "q2") {
        if (selected == "q2") {
            return 'rotate (90,0,0)'
        }
        return 'rotate (-180,0,0)'
    }

    if (current == "q3") {
        return 'rotate (-180,0,0)'
    }
    
    return 'rotate (0,0,0)';
}

const FourPointFeedback = ({points, setPoints, colour, deviceType, height, width}) => {

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

    const square = useD3((root)=>{
    
        let _points = points;
    
        const controls = root.select("g#controls");
        const q1 = controls.select("g#q1");
        const q2 = controls.select("g#q2");
        const q3 = controls.select("g#q3");
        const q4 = controls.select("g#q4");
        const _square = root.select("g#bigsquare");
        const controlpoints = {q1,q2,q3,q4};
    
        Object.keys(controlpoints).map((name)=>{
            const elem = controlpoints[name];
                
            elem.on("click", ()=>{
            
                if (name !== selected){
                    const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, name);
      
                    _square.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
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
               <svg ref={square} width="100%" height={height-(width-300)/TOTALSHAPES - 44}  viewBox="-12 0 151 144"  className={styles.square}>
                    
                    <g>
                        <text x="65" y="7.29px" className={styles.questiontext}>That I need to use this system</text>
                    </g>

                    <g id="bigsquare">
                        <path d="M63.349,13.343L0.416,76.275L63.349,139.208L126.281,76.275L63.349,13.343Z" className={styles.outersquare}/>
                        
                        <path d="M63.13,14.163L63.657,139.542" className={styles.scaleline}/>
                        <path d="M0.865,76.474L125.922,76.474" className={styles.scaleline}/>
                        <circle cx="63.394" cy="76.686" r={3} className={styles.center} />
                        
                        <path d={`M${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}L${points.q3.x},${points.q3.y}L${points.q4.x},${points.q4.y}L${points.q1.x},${points.q1.y}Z`}  className={styles.innersquare}/>
                        
                        <g id="controls">
                            <g id="q1" transform={`translate(${points.q1.x},${points.q1.y})`}>
                                <circle r={7} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q1" ? "white":colour[1]}}/>
                            </g>
                            <g id="q2" transform={`translate(${points.q2.x},${points.q2.y})`}>
                                <circle r={7}  className={selected === "q2" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q2" ? "white":colour[1]}}/>
                            </g>
                            <g id="q3" transform={`translate(${points.q3.x},${points.q3.y})`}>
                                <circle r={7} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q3" ? "white":colour[1]}}/>
                            </g>
                            <g id="q4" transform={`translate(${points.q4.x},${points.q4.y})`}>
                                <circle r={7} className={selected === "q4" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q4" ? "white":colour[1]}}/>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
}

export default FourPointFeedback;