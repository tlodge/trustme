import styles from '../styles/FourPoint.module.css'
import {
    useRef,
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';
import useD3 from '../hooks/useD3';
const TOTALSHAPES =3;
const ROTATIONTIME = 1000;
const CX = 63.3, CY = 76.6;

const LIMITY = {
    q1: {
        max: 68.3,
        min: 20.1
    },
    q2: {
        max: 76,
        min: 76
    },
    q3: {
        max: 135,
        min: 85,
    },
    q4: {
        max: 76,
        min: 76
    }
}

const LIMITX = {
    q1: {
        max: 63.4,
        min: 63.4,
    },
    q2: {
        max: 123.6,
        min: 71.5
    },
    q3: {
        max: 103.9,
        min: 45.5
    },
    q4: {
        max: 54.5,
        min: 6.3
    }
}

const q1scale = d3.scaleLinear().domain([20.1, 68.3]).range([100, 0]);
const q2scale = d3.scaleLinear().domain([71.5, 123.6]).range([0, 100]);
const q3scale = d3.scaleLinear().domain([85, 135]).range([0, 100]);
const q4scale = d3.scaleLinear().domain([6.3, 54.5]).range([0, 100]);


const q1points = (answer)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([68.3,20.1]);
    return [63.4, q1ToY(answer)];
}

const q2points = (answer)=>{
    const q2ToX = d3.scaleLinear().domain([0,100]).range([71.5,123.6])
    return [q2ToX(answer), q2ypos(q2ToX(answer))];
}

const q3points = (answer)=>{
    const q3ToY = d3.scaleLinear().domain([0,100]).range([85,135])
    return [63.4, q3ypos(0,q3ToY(answer))];
}
const q4points = (answer)=>{
    const q4ToX = d3.scaleLinear().domain([0,100]).range([6.3,54.5])
    return [q4ToX(answer), q4ypos(q4ToX(answer))];
}


const pointfn = {
    "q1":q1points,
    "q2":q2points,
    "q3":q3points,
    "q4":q4points
}


const q1value = (x, y) => {
    return Math.ceil(q1scale(y));
}

const q2value = (x, y) => {
    return Math.ceil(q2scale(x));
}

const q3value = (x, y) => {
    return Math.ceil(q3scale(y));
}

const q4value = (x, y) => {
    return Math.ceil(q4scale(x));
}

const valuefn = {
    "q1" : q1value,
    "q2" : q2value,
    "q3" : q3value,
    "q4" : q4value,
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

    return {
        x: limitx(name,xcontrolfn[name](x, y)),
        y: limity(name,ycontrolfn[name](x, y))
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

    return [0, 0, CX,CY,CX,CY];
}


const rightof = (q) => {
    const positions = {
        "q1":"q2",
        "q2":"q3",
        "q3":"q4",
        "q4":"q1"
    }
    return positions[q];
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

const colorScale = d3.scaleLinear().clamp(true).domain([0, 100]).range(['#7c5a36','white']);

const FourPointFeedback = ({answers, questions, setAnswer,colour, deviceType, height, width, complete:next}) => {

    const isMobile = deviceType==="mobile";

    //const  colour = d3.scaleSequential(d3.interpolateRdYlBu).domain([0,10]);
    const [selected, setSelected] = useState("q1");
    const [answered, setAnswered] = useState([]);
    const [complete, setComplete] = useState(false);
    const [almostComplete, setAlmostComplete] = useState(false);
    const questionScale = d3.scaleLinear().clamp(true).domain([0,100]).range([0, questions.q1.length-1]);

    const currentQuestion = (value)=>{
        return questions[selected][Math.ceil(questionScale(value))];
    }

    const updateAnswer = (question,answer)=>{
        setAnswer(question,answer);
        setAnswered([...answered.filter(a=>a!=question), question]);
    }

    useEffect(()=>{
        if (answered.length >= 4){
            setComplete(true);
        }
        if (answered.length == 3){
            setAlmostComplete(true);
        }
    },[answered]);

    const square = useD3((root)=>{
    
      
        let _answer = 0;

        const controls = root.select("g#controls");
        const q1 = controls.select("g#q1");
        const q2 = controls.select("g#q2");
        const q3 = controls.select("g#q3");
        const q4 = controls.select("g#q4");
        const _square = root.select("g#bigsquare");
        const controlpoints = {q1,q2,q3,q4};
    
        const rotateIfSelected = (name)=>{
            if (name !== selected){
                const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, name);

                _square.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
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
                if (name===selected){
                    const {x,y} = controlfn(name,e.x,e.y);
                  

                    elem.attr("transform", `translate(${x},${y})`);// ${rotationFor(selected,name)}`)
                
                    _answer = valuefn[name](x,y);
                   
                    if (deviceType==="desktop"){
                        updateAnswer(name,_answer);
                    }

                
                }
            }).on("start",()=>{
                rotateIfSelected(name);
            }).on("end", ()=>{
                if (name===selected){

                    if (almostComplete){
                        updateAnswer(name, _answer);
                        return;
                    }

                    const next = rightof(name);
                    const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, next);

                    _square.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
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
            return colorScale(answers[q])
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
        return `M${q1[0]},${q1[1]}L${q2[0]},${q2[1]}L${q3[0]},${q3[1]}L${q4[0]},${q4[1]}L${q1[0]},${q1[1]}Z`
    }


    const SVGHEIGHT = deviceType == "mobile" ? height - (width) : height-(width-300)/TOTALSHAPES - 44;
    return  <div>
           <div style={{display:"flex", padding:"0px 30px 0px 30px",justifyContent:"center", alignItems:"center", height:80}}>
                <div className={styles.questiontext} style={{fontSize: isMobile? "1em":"1.5em"}}>{currentQuestion(answers[selected])}</div>
            </div>
               <svg ref={square} width="auto" height={SVGHEIGHT}  viewBox="-20 0 172 145"  className={styles.square}>
                    
                  

                    <g id="bigsquare">
                        <path d="M63.349,13.343L0.416,76.275L63.349,139.208L126.281,76.275L63.349,13.343Z" className={styles.outersquare}/>
                        
                       
                        
                        
                        <path d={pathstr()}  className={styles.innersquare}/>
                         <path d="M63.13,14.163L63.657,139.542" className={styles.scaleline}/>
                        <path d="M0.865,76.474L125.922,76.474" className={styles.scaleline}/>
                        <circle cx="63.394" cy="76.686" r={2} className={styles.center} />
                        <g id="controls">
                            <g id="q1" transform={translatestr("q1")}>
                                <circle r={selected==="q1" ? 7: 4} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q1", "q1"===selected)}}/>
                            </g>
                            <g id="q2" transform={translatestr("q2")}>
                                <circle r={selected==="q2" ? 7: 4} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q2", "q2"===selected)}}/>
                            </g>
                            <g id="q3" transform={translatestr("q3")}>
                                <circle r={selected==="q3" ? 7: 4} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q3", "q3"===selected)}}/>
                            </g>
                            <g id="q4" transform={translatestr("q4")}>
                                <circle r={selected==="q4" ? 7: 4} className={selected === "q4" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q4", "q4"===selected)}}/>
                            </g>
                        </g>

                        
                    </g>
                    {complete && <g> 
                        <circle onClick={next} cx="63" cy="76" r="7.012" style={{fill:"#c8c8c8",stroke:"#171834",strokeWidth:0.8}}/>
                        <circle onClick={next}  cx="63" cy="76" r="5.5" style={{fill:"#282b55"}}/>
                        <path onClick={next}  d="M62,74l2.343,2.153l-2.432,2.209" style={{fill:"none",stroke:"#c8c8c8",strokeWidth:0.82}}/>
                    </g>}
                </svg>
            </div>
}

export default FourPointFeedback;