import styles from '../styles/Home.module.css'
import {
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';
import useD3 from '../hooks/useD3';

const ROTATIONTIME = 1000;
const CX = 109, CY = 89;

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

const valuefn = {
    "q1" : q1value,
    "q2" : q2value,
    "q3" : q3value,
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
    }

    if (from == "q2") {
        if (to === "q1") {
            return [-120, 0, CX + 1, CY + 2, CX, CY];
        }
        if (to === "q3") {
            return [-120, -240, CX + 1, CY + 2, CX + 0.8, CY + 1.2];
        }
    }

    if (from === "q3") {
        if (to === "q1") {
            return [-240, 0, CX + 0.8, CY + 1.2, CX, CY]
        }
        if (to === "q2") {
            return [-240, -120, CX + 0.8, CY + 1.2, CX + 1, CY + 2]
        }
    }
    return [0, 0, CX,CY,CX,CY];
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

const colorScale = d3.scaleLinear().clamp(true).domain([0, 100]).range(['#bb2929', 'white']);


const q1points = (answer)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([85.7,16.6]);
    return [109.5, q1ToY(answer)];
}

const q2points = (answer)=>{
    const q2ToX = d3.scaleLinear().domain([0,100]).range([113.8,172.5])
    return [q2ToX(answer), q2ypos(q2ToX(answer))];
}

const q3points = (answer)=>{
    const q3ToX = d3.scaleLinear().domain([0,100]).range([103.9,45.5])
    return [q3ToX(answer), q3ypos(q3ToX(answer))];
}

const pointfn = {
    "q1":q1points,
    "q2":q2points,
    "q3":q3points,
}
const ThreePointFeedback = ({colour, deviceType, width, height,complete:next, questions, setAnswer, answers}) => {

    const [selected, setSelected] = useState("q1");
    const [answered, setAnswered] = useState([]);
    const [complete, setComplete] = useState(false);
    const [almostComplete, setAlmostComplete] = useState(false);
    const questionScale = d3.scaleLinear().clamp(true).domain([0,100]).range([0, questions.q1.length-1]);

    useEffect(()=>{
        if (answered.length >= 3){
            setComplete(true);
        }
        if (answered.length ==2){
            setAlmostComplete(true);
        }
    },[answered]);
  

    const currentQuestion = (value)=>{
        return questions[selected][Math.ceil(questionScale(value))];
    }

    const updateAnswer = (question,answer)=>{
        setAnswer(question,answer);
        setAnswered([...answered.filter(a=>a!=question), question]);
    }

    const triangle = useD3((root)=>{
      //let _points = points;
        let _answer =50;

        const controls = root.select("g#controls");
        const q1 = controls.select("g#q1");
        const q2 = controls.select("g#q2");
        const q3 = controls.select("g#q3");
        const triangle = root.select("g#bigtriangle");
        const controlpoints = {q1,q2,q3};
    
        const rotateIfSelected = (name)=>{
            if (name !== selected){
                const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, name);

                triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
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
                   // _points = {..._points, [name] : {x, y}}
                    _answer = valuefn[name](x,y);

                    elem.attr("transform", `translate(${x},${y}) ${rotationFor(selected,name)}`)
            
                    if (deviceType==="desktop"){
                        //setPoints(_points);
                        updateAnswer(name,_answer);
                    }
                }
            }).on("start", ()=>{
                rotateIfSelected(name);
            }).on("end", ()=>{
                if (name===selected){
                    if (deviceType!=="desktop"){
                        //setPoints(_points);
                        updateAnswer(name, _answer);
                    }
                    if (almostComplete){
                        updateAnswer(name, _answer);
                        return;
                    }
                    
                    const next = rightof(name);
                    const [_from, _to, cx1, cy1, cx2, cy2] = fromto(selected, next);
                    
                    triangle.transition().duration(ROTATIONTIME).attrTween("transform", (d)=>{
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

    const TOTALSHAPES = 3;

    const SVGHEIGHT = deviceType == "mobile" ? height - (width) : height-(width-300)/TOTALSHAPES - 44;

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
        return `M${q3[0]},${q3[1]}L${q1[0]},${q1[1]}L${q2[0]},${q2[1]}Z`
    }

    return  <div style={{display:"flex", justifyContent:"center"}}>
                <div>
                <svg ref={triangle} width="100%" height={SVGHEIGHT}  viewBox="30 0 151 144" className={styles.trianglesvg}>
                    <g id="bigtriangle">
                        <path d="M45.884,127.352L109.629,17.053L172.902,127.352L45.884,127.352Z" className={styles.outertriangle} style={{fill:"#69212f"}}/>
                        <path d="M109.708,17.272L109.527,90.317" className={styles.triangleoutline}/>
                        <path d="M46.236,126.829L109.495,90.306" className={styles.triangleoutline}/>
                        <path d="M172.705,127.087L109.616,90.352" className={styles.triangleoutline}/>
                        <circle cx={109.5} cy={90.5} r={2} className={styles.zeroline} style={{fill:colour[0]}}/>
                        <path id="dimshape" d={pathstr()} className={styles.innertriangle} style={{fill:"#bb2929"}}/>


                        {/*<text x="108px" y="92px" className={styles.text0value} transform={`${zeroRotation(selected)}`}>0</text>*/}
                        <g id="controls">
                            <g id="q1" transform={`${translatestr("q1")} ${rotationFor(selected,"q1")}`}>
                            <circle id="q1"  r={selected==="q1" ? 7: 4} className={selected === "q1" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q1",selected=="q1")}}/>
                            {/*<text y={2.5} className={styles.value}>{q1value(points.q1.x,points.q1.y)}</text>*/}
                            </g>
                            <g id="q2" transform={`${translatestr("q2")} ${rotationFor(selected,"q2")}`}>
                            <circle id="q2"  r={selected==="q2" ? 7: 4} className={selected === "q2" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q2",selected=="q2")}}/>
                            {/*<text y={2.5} className={styles.value}>{q2value(points.q2.x,points.q2.y)}</text>*/}
                            </g>
                            <g id="q3" transform={`${translatestr("q3")}, ${rotationFor(selected,"q3")}`}>
                            <circle id="q3"  r={selected==="q3" ? 7: 4} className={selected === "q3" ? styles.controlpoint : styles.rotatepoint} style={{fill: colourFor("q3",selected=="q3")}}/>
                            {/*<text y={2.5} className={styles.value}>{q3value(points.q3.x,points.q3.y)}</text>*/}
                            </g>
                        </g>
                    </g>
                   
                    {complete && <g> 
                        <circle onClick={next} cx="109.5" cy="92" r="7.012" style={{fill:"#c8c8c8",stroke:"#171834",strokeWidth:0.8}}/>
                        <circle onClick={next}  cx="109.5" cy="92" r="5.5" style={{fill:"#282b55"}}/>
                        <path onClick={next}  d="M108.5,90l2.343,2.153l-2.432,2.209" style={{fill:"none",stroke:"#c8c8c8",strokeWidth:0.82}}/>
                    </g>}
                    
                    <text x="109.5px" y="7.29px" className={styles.questiontext}>{currentQuestion(answers[selected])}</text>
                    
                    
                   
                </svg>
                </div>
            </div>
}

export default ThreePointFeedback;