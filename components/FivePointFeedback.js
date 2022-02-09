import styles from '../styles/FivePoint.module.css'
import {
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';
import useD3 from '../hooks/useD3';
const TOTALSHAPES =3;
const ROTATIONTIME = 1000;
const CX = 75.5, CY = 83;

const LIMITY = {
    q1: {
        max: 73.6,
        min: 23.97
    },
    q2: {
        max: 80.75,
        min: 65.1
    },
    q3: {
        max: 130.97,
        min: 90.56
    },
    q4: {
        max: 131.25,
        min: 90.6
    },
    q5: {
        max: 80.44,
        min: 65.38
    },
}

const LIMITX = {
    q1: {
        max: 75.6,
        min: 75.6
    },
    q2: {
        max: 131.67,
        min: 84.36
    },
    q3: {
        max: 109.92,
        min: 80.6
    },
    q4: {
        max: 69.9,
        min: 40.47
    },
    q5: {
        max: 66.11,
        min: 19.18
    },
}

const q1scale = d3.scaleLinear().domain([73.6, 23.97]).range([100, 0]);
const q2scale = d3.scaleLinear().domain([131.67, 84.36]).range([0, 100]);
const q3scale = d3.scaleLinear().domain([109.92, 80.6]).range([0, 100]);
const q4scale = d3.scaleLinear().domain([69.9, 40.7]).range([0, 100]);
const q5scale = d3.scaleLinear().domain([66.11, 19.8]).range([0, 100]);

const q1value = (x, y) => {
    return Math.ceil(q1scale(y));
}

const q2value = (x, y) => {
    return Math.ceil(q2scale(x));
}

const q3value = (x, y) => {
    return Math.ceil(q3scale(x));
}

const q4value = (x, y) => {
    return Math.ceil(q4scale(x));
}

const q5value = (x, y) => {
    return Math.ceil(q5scale(x));
}


const valuefn = {
    "q1" : q1value,
    "q2" : q2value,
    "q3" : q3value,
    "q4" : q4value,
    "q5" : q5value,
}


const q1points = (answer)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([23.97,73.6]);
    return [75.6, q1ToY(answer)];
}

const q2points = (answer)=>{
    const q2ToX = d3.scaleLinear().domain([0,100]).range([131.67,84.36])
    return [q2ToX(answer), q2ypos(q2ToX(answer))];
}

const q3points = (answer)=>{
    const q3ToX = d3.scaleLinear().domain([0,100]).range([109.92,80.6])
    return [q3ToX(answer), q3ypos(q3ToX(answer))];
}
const q4points = (answer)=>{
    const q4ToX = d3.scaleLinear().domain([0,100]).range([69.9, 40.7])
    return [q4ToX(answer), q4ypos(q4ToX(answer))];
}

const q5points = (answer)=>{
    const q5ToX = d3.scaleLinear().domain([0,100]).range([66.11,19.8])
    return [q5ToX(answer), q5ypos(q5ToX(answer))];
}


const pointfn = {
    "q1":q1points,
    "q2":q2points,
    "q3":q3points,
    "q4":q4points,
    "q5":q5points
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
    return {
        x: limitx(name, xcontrolfn[name](x, y)),
        y: limity(name, ycontrolfn[name](x, y))
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


const colorScale = d3.scaleLinear().clamp(true).domain([0, 100]).range(['#3c6647', 'white']);

const FivePointFeedback = ({answers, setAnswer, questions, colour, deviceType, width, height, complete:next}) => {
    const isMobile = deviceType==="mobile";
    const [selected, setSelected] = useState("q1");
    const [almostComplete, setAlmostComplete] = useState(false);
    const [complete, setComplete] = useState(false);
    const [answered, setAnswered] = useState([]);
    const questionScale = d3.scaleLinear().clamp(true).domain([0,100]).range([0, questions.q1.length-1]);

    const currentQuestion = (value)=>{
        return questions[selected][Math.ceil(questionScale(value))];
    }

    const updateAnswer = (question,answer)=>{
        setAnswer(question,answer);
        setAnswered([...answered.filter(a=>a!=question), question]);
    }

    useEffect(()=>{
        if (answered.length >= 5){
            setComplete(true);
        }
        if (answered.length === 4){
            setAlmostComplete(true);
        }
    },[answered]);

    const hexagon = useD3((root)=>{
    
       
        let _answer = 50;
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
    
        const rotateIfSelected = (name)=>{
            if (name !== selected){
                const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, name);

                hexagon.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
                    const to =  `rotate(${_to}, ${cx2}, ${cy2})`
                    const from = `rotate(${_from}, ${cx1}, ${cy1})`
                    return d3.interpolate(from, to);
                })
                setSelected(name);
            }
        }

        Object.keys(controlpoints).map((name)=>{
            const elem = controlpoints[name];
                
            elem.on("click", ()=>{
                if (complete){
                    rotateIfSelected(name);
                }
            });

            elem.call(d3.drag().on("drag", (e)=>{
                e.sourceEvent.stopPropagation(); 
                if (name===selected){
                    const {x,y} = controlfn(name,e.x,e.y);
                    
                    elem.attr("transform", `translate(${x},${y})`);// ${rotationFor(selected,name)}`)
                    _answer = valuefn[name](x,y);
                   
                    if (deviceType==="desktop"){
                        updateAnswer(name,_answer);
                    }
                }
            }).on("start", ()=>{
                rotateIfSelected(name);
            })
            .on("end", ()=>{
                if (name===selected){
                    if (almostComplete){
                        updateAnswer(name, _answer);
                        return;
                    }

                   
                    const next = rightof(name);
                    const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, next);
        
                    hexagon.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
                        const to =  `rotate(${_to}, ${cx2}, ${cy2})`
                        const from = `rotate(${_from}, ${cx1}, ${cy1})`
                        return d3.interpolate(from, to);
                    })
                    updateAnswer(name, _answer);
                    setSelected(next);
                }
            }))
          
          
        })
    });

    const colourFor = (q, selected)=>{
        if (selected || answered.indexOf(q) != -1){
            return ["q1","q2","q3"].indexOf(q) !== -1 ? colorScale(100-answers[q]) : colorScale(answers[q])
        }
        return "white"
    }

    const translatestr = (q)=>{
        const answer = answers[q];
        const pnts = pointfn[q](answer);
        return `translate(${pnts[0]},${pnts[1]})`;
    }
                    
    const pathstr = () =>{
        const q1 = pointfn["q1"](answers["q1"]);
        const q2 = pointfn["q2"](answers["q2"]);
        const q3 = pointfn["q3"](answers["q3"]);
        const q4 = pointfn["q4"](answers["q4"]);
        const q5 = pointfn["q5"](answers["q5"]);
        return `M${q1[0]},${q1[1]}L${q2[0]},${q2[1]}L${q3[0]},${q3[1]}L${q4[0]},${q4[1]}L${q5[0]},${q5[1]}L${q1[0]},${q1[1]}Z`
    }
  
    const SVGHEIGHT = deviceType == "mobile" ? height - (width) : height-270;

    return  <div style={{display:"flex", justifyContent:"center", flexDirection:"row"}}>
                 <div style={{display:"flex", padding:"0px 0px 0px 0px",justifyContent:"center", alignItems:"center", width: 400, marginLeft:100}}>
                    <div className={styles.questiontext} style={{color:colourFor(selected,true), fontSize: isMobile? "1em":"1.5em",}}>{currentQuestion(answers[selected])}</div>
                </div>
                <svg ref={hexagon} width="auto" height={SVGHEIGHT}  viewBox="0 0 151 144" className={styles.hexagon}>
                    
                    <g transform="translate(0,-11) rotate(-90, 75.5, 83)">
                    <g id="bighexagon">
                        <path id="outerhex" d="M75.482,17.152L138.285,62.869L114.297,136.839L36.668,136.839L12.679,62.869L75.482,17.152Z" className={styles.outerhex}/>
                    
                        <g><text x="73.922px" y="85.036px" className={styles.zerotext}></text></g>

                        <path id="innerhex" d={pathstr()} className={styles.innerhexline}/>
                        <path d="M75.508,83.474L75.63,17.067" className={styles.scaleline} />
                        <path d="M75.6,83.5L138.2,62.7" className={styles.scaleline}  />
                        <path d="M75.4,83.1L114.4,136.8" className={styles.scaleline} />
                        <path d="M75.3,83.3L36.6,137.0" className={styles.scaleline} />
                        <path d="M75.8,83.3L12.8,63.3" className={styles.scaleline} />
                        <circle cx={75.5} cy={83} r={2} className={styles.center}/>
                        <g id="controls">
                        
                            <g id="q1" transform={translatestr("q1")}>
                                <circle id="q1" r={selected==="q1" ? 7: 4} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q1",selected==="q1")}}/>    
                            </g>
                            <g id="q2" transform={translatestr("q2")}>
                                <circle id="q2" r={selected==="q2" ? 7: 4} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q2",selected==="q2")}}/>    
                            </g>
                            <g id="q3" transform={translatestr("q3")}>
                                <circle id="q3" r={selected==="q3" ? 7: 4}className={selected === "q3" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q3",selected==="q3")}}/>    
                            </g>
                            <g id="q4" transform={translatestr("q4")}>
                                <circle id="q4" r={selected==="q4" ? 7: 4}className={selected === "q4" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q4",selected==="q4")}}/>    
                            </g>
                            <g id="q5" transform={translatestr("q5")}>
                                <circle id="q5" r={selected==="q5" ? 7: 4} className={selected === "q5" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q5",selected==="q5")}}/>    
                            </g>
                        </g>
                    </g>
                    {complete && <g transform="rotate(90, 75.5,83)"> 
                        <circle onClick={next} cx="75.5" cy="83" r="7.012" style={{fill:"#c8c8c8",stroke:"#171834",strokeWidth:0.8}}/>
                        <circle onClick={next}  cx="75.5" cy="83" r="5.5" style={{fill:"#282b55"}}/>
                        <path onClick={next}  d="M74.5,81l2.343,2.153l-2.432,2.209" style={{fill:"none",stroke:"#c8c8c8",strokeWidth:0.82}}/>
                    </g>}
                    </g>
                </svg>
            </div>
}


export default FivePointFeedback;