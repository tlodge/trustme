import styles from '../styles/Home.module.css'
import {
    useRef,
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';

const TOTALSHAPES = 3;
const ROTATIONTIME = 1000;
const CX = 109, CY = 89;

const questionfor = (q) => {
    switch (q) {
        case "q1":
            return "I KNOW what the system is"

        case "q2":
            return "I KNOW what the system does"

        case "q3":
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
}

const q1scale = d3.scaleLinear().domain([16.6, 85.7]).range([100, 0]);
const q2scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);
const q3scale = d3.scaleLinear().domain([93, 127.16]).range([0, 100]);

const q1value = (x, y) => {
    return Math.ceil(q1scale(y));
}

const q2value = (x, y) => {
    return Math.ceil(q2scale(y));
}

const q3value = (x, y) => {
    return Math.ceil(q3scale(y));
}

const q2ypos = (x) => {
    return (18 / 31 * x) + 27
}

const q3ypos = (x) => {
    return (-13.5 / 23 * x) + 154
}

const q1ypos = (x, y) => {
    return y;
}

const ycontrolfn = {
    q1: q1ypos,
    q2: q2ypos,
    q3: q3ypos,
}

const xcontrolfn = {
    q1: (x) => 109.5,
    q2: (x) => x,
    q3: (x) => x
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
        x: limitx(name, xcontrolfn[name](x, y)),
        y: limity(name, ycontrolfn[name](x, y))
    }
}

const fromto = (from, to) => {
    if (from == "q1") {
        if (to === "q2") {
            return [0, -120, CX, CY, CX + 1, CY + 2];
        }
        if (to === "q3") {
            return [0, -240, CX, CY, CX + 0.8, CY + 1.2];
        }
        return [0, 0];
    }

    if (from == "q2") {
        if (to === "q1") {
            return [-120, 0, CX + 1, CY + 2, CX, CY];
        }
        if (to === "q3") {
            return [-120, -240, CX + 1, CY + 2, CX + 0.8, CY + 1.2];
        }
        return [0, 0];
    }

    if (from === "q3") {
        if (to === "q1") {
            return [-240, 0, CX + 0.8, CY + 1.2, CX, CY]
        }
        if (to === "q2") {
            return [-240, -120, CX + 0.8, CY + 1.2, CX + 1, CY + 2]
        }
        return [0, 0];
    }
}

const rightof = (q) => {
    if (q == "q1") {
        return "q2"
    }
    if (q == "q2") {
        return "q3"
    }
    return "q1"
}

const leftof = (q) => {
    if (q == "q3") {
        return "q2"
    }
    if (q == "q2") {
        return "q1"
    }
    return "q3"
}

const rotationFor = (current, selected) => {
    
    if (current == "q2") {
        if (selected == "q2") {
            return 'rotate (120,0,0)'
        }
        return 'rotate (-240,0,0)'
    }

    if (current == "q3") {
        return 'rotate (-120,0,0)'
    }
    
    return 'rotate (0,0,0)';
}

const ThreePointFeedback = ({points, setPoints, colour, deviceType, width, height}) => {

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
    const triangle = useD3((root)=>{
    
        let _points = points;
    
        const controls = root.select("g#controls");
        const q1 = controls.select("g#q1");
        const q2 = controls.select("g#q2");
        const q3 = controls.select("g#q3");
    
        const rleft =  root.select("g#rotleft");
        const rright =  root.select("g#rotright");
        const triangle = root.select("g#bigtriangle");
    
        /*rleft.on("click", function(){
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
          const q = rightof(selected);
          
          const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, q);
    
          
          triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
            const to =  `rotate(${_to}, ${cx2}, ${cy2})`
            const from = `rotate(${_from}, ${cx1}, ${cy1})`
            return d3.interpolate(from, to);
          })
          setSelected(q);
        });*/
    
        const controlpoints = {q1,q2,q3};
    
        Object.keys(controlpoints).map((name)=>{
            const elem = controlpoints[name];
          
     
            
          
            elem.on("click", ()=>{
            
                if (name !== selected){
                    const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, name);
      
                    triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
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
                    elem.attr("transform", `translate(${x},${y}) ${rotationFor(selected,name)}`)
                
                   
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

//viewBox="0 0 232 144" 
    return  <div style={{padding:20}}>
                <svg ref={triangle} width="100%" height={height-(width-300)/TOTALSHAPES - 44}  viewBox="30 0 151 144" className={styles.trianglesvg}>

                {/*<g id="rotright">
                    <circle cx={182} cy={139} r={10} style={{fill:"white"}}/>
                    <path className={styles.rotation} d="M174,139c1.67,1.437 3.989,2.05 6.261,1.437c3.326,-0.897 5.416,-4.117 5.023,-7.469l-1.357,0.343l1.379,-3.093l2.757,2.049l-1.33,0.335c0.576,4.218 -2.013,8.298 -6.173,9.42c-2.775,0.749 -5.609,0.008 -7.669,-1.737l1.109,-1.285Z" />
                </g>
                <g id="rotleft">
                <circle cx={38} cy={139} r={10} style={{fill:"white"}}/>
                    <path  className={styles.rotation} d="M46,139c-1.67,1.437 -3.989,2.05 -6.261,1.437c-3.326,-0.897 -5.417,-4.117 -5.023,-7.469l1.357,0.343l-1.379,-3.093l-2.757,2.049l1.329,0.335c-0.575,4.218 2.014,8.298 6.174,9.42c2.775,0.749 5.608,0.008 7.669,-1.737l-1.109,-1.285Z" /> 
                </g>*/}

                {/*<text x="44px" y="132px" className={styles.textvalue}>100</text>
                    <text x="174px" y="132px" className={styles.textvalue}>100</text>
            <text x="109.5px" y="14px" className={styles.textvalue}>100</text>*/}
                   
                    <g id="bigtriangle">
                        <path d="M45.884,127.352L109.629,17.053L172.902,127.352L45.884,127.352Z" className={styles.outertriangle} style={{fill:colour[0]}}/>
                        <path d="M109.708,17.272L109.527,90.317" className={styles.triangleoutline}/>
                        <path d="M46.236,126.829L109.495,90.306" className={styles.triangleoutline}/>
                        <path d="M172.705,127.087L109.616,90.352" className={styles.triangleoutline}/>
                        <circle cx={109.5} cy={90.5} r={2} className={styles.zeroline} style={{fill:colour[0]}}/>
                        <path id="dimshape" d={`M${points.q3.x},${points.q3.y}L${points.q1.x},${points.q1.y}L${points.q2.x},${points.q2.y}Z`} className={styles.innertriangle} style={{fill:colour[1]}}/>
                        
                        {/*<text x="108px" y="92px" className={styles.text0value} transform={`${zeroRotation(selected)}`}>0</text>*/}
                        <g id="controls">
                            <g id="q1" transform={`translate(${points.q1.x},${points.q1.y}) ${rotationFor(selected,"q1")}`}>
                            <circle id="q1"  r={7} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q1" ? "white":colour[1]}}/>
                            <text y={2.5} className={styles.value}>{q1value(points.q1.x,points.q1.y)}</text>
                            </g>
                            <g id="q2" transform={`translate(${points.q2.x},${points.q2.y}) ${rotationFor(selected,"q2")}`}>
                            <circle id="q2"  r={7} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q2" ? "white":colour[1]}}/>
                            <text y={2.5} className={styles.value}>{q2value(points.q2.x,points.q2.y)}</text>
                            </g>
                            <g id="q3" transform={`translate(${points.q3.x},${points.q3.y}) ${rotationFor(selected,"q3")}`}>
                            <circle id="q3"  r={7} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint} style={{fill: selected=="q3" ? "white":colour[1]}}/>
                            <text y={2.5} className={styles.value}>{q3value(points.q3.x,points.q3.y)}</text>
                            </g>
                        </g>
                    </g>
                    
                    
                    <text x="109.5px" y="7.29px" className={styles.questiontext}>{questionfor(selected)}</text>
                    
                    
                   
                </svg>
            </div>
}

export default ThreePointFeedback;