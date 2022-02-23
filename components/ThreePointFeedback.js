import styles from '../styles/Home.module.css'
import * as d3 from 'd3';
const CX = 109.5, CY=90.5;

const q1points = (answer)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([16.6,85.7]);
    return [109.5, q1ToY(answer)];
}

const ThreePointFeedback = ({answers, selected, clicked}) => {
   console.log("selected", selected);

    const torad = deg => deg * (Math.PI/180);

    const rotate = ([x, y], deg)=>{
      
        const theta = torad(deg);
        const s = Math.sin(theta);
        const c = Math.cos(theta);
        const  xn = c * (x - CX) - s * (y-CY) + CX;
        const  yn = s * (x - CX) + c * (y-CY) + CY;
        return [xn,yn];
    }

    const points = (q, deg)=>{  
        if (answers[q] == -1){
            return [[CX,CY],[CX,CY],[CX,CY]];
        }

        const theta = 30*(Math.PI/180);
        const r = CY-q1points(answers[q])[1];
        const p1 = rotate(q1points(answers[q]),deg);
        const p2 = rotate([CX+ (Math.cos(theta)*r), CY+(Math.sin(theta)*r)],deg);
        const p3 = [CX, CY]  
        return [p1,p2,p3];
    }


    const createpath = (points)=>{
        const [start, ...rest] = points
        const path = rest.reduce((acc,point)=>{
           
            return `${acc}L${point[0]},${point[1]}`
        },"");
        return `M${start[0]},${start[1]}${path}Z`;
    }

    const fullpath = ()=>{
        const [f1,f2,f3] = points("q1",0);
        const [f4,f5,f6] = points("q2",120);
        const [f7,f8,f9] = points("q3",240);
        
        return createpath([f1,f2,f4,f5,f7,f8]);
    }

    const pathstr = (q, deg) =>{
        if (answers[q]== -1) 
            return null;//`M${CX},${CY}L${CX},${CY}L${CX},${CY}Z`
        const [p1,p2,p3]=points(q,deg);
        return `M${p1[0]},${p1[1]}L${p2[0]},${p2[1]}L${p3[0]},${p3[1]}Z`
    }

    const SVGHEIGHT = 300;//deviceType == "mobile" ? height - (width) : height-270;
    return <svg  onClick={clicked} width={SVGHEIGHT} height={SVGHEIGHT}   viewBox="0 0 150 150" className={styles.trianglesvg}>
                    <g transform="translate(-33,5)">
                        
                        <g id="bigtriangle">
                            <path d="M45.884,127.352L109.629,17.053L172.902,127.352L45.884,127.352Z" className={styles.outertriangle} style={{opacity:0.1,fill:"#c8c8c8"}}/>
                        </g> 

                        {/*<path id="dimshape" d={pathstr("q1",0)} className={styles.innertriangle} style={{ opacity: selected ? selected=="q1" ? 0.5: 1 : 1}}/>
                        <path id="dimshape" d={pathstr("q2",120)} className={styles.innertriangle} style={{opacity: selected ? selected=="q2" ? 0.5: 1 : 1}}/>
<path id="dimshape" d={pathstr("q3",240)} className={styles.innertriangle} style={{ opacity: selected ? selected=="q3" ? 0.5: 1 : 1}}/>*/}
                        <path d={fullpath()} className={styles.innertriangle}></path>
                        {/*<path d="M109.708,17.272L109.527,90.317" className={styles.triangleoutline}/>
                        <path d="M46.236,126.829L109.495,90.306" className={styles.triangleoutline}/>
                        <path d="M172.705,127.087L109.616,90.352" className={styles.triangleoutline}/>*/}
                    </g>
                    {/*<g>
                        <rect x={30} y={120} width={130} rx={1} ry={1} height={3} style={{fill:"white"}}></rect>
                        <circle id="dragcircle" cx={85} cy={121.5} r={6} style={{fill:"#282b55", stroke:"white"}}></circle>
                    </g>*/}
                </svg>
          
}

export default ThreePointFeedback;