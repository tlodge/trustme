import styles from '../styles/FivePoint.module.css'
import * as d3 from 'd3';
const CX = 75.5, CY = 83;

const q1points = (answer)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([17,73.6]);
    return [CX, q1ToY(answer)];
}

const FivePointFeedback = ({answers, clicked, selected}) => {
    
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

        const theta = -18*(Math.PI/180);
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
        const [f4,f5,f6] = points("q2",72);
        const [f7,f8,f9] = points("q3",144);
        const [f10,f11,f12] = points("q4",216);
        const [f13,f14,f15] = points("q5",288);

        return createpath([f1,f2,f4,f5,f7,f8,f10,f11,f13,f14]);
    }


    const pathstr = (rotation, q) =>{
        if (answers[q]== -1) return null;//`M${CX},${CY}L${CX},${CY}L${CX},${CY}Z`
        const theta = -18*(Math.PI/180);
        const r = CY-qpoints(answers[q])[1];
        const p1 = rotate(qpoints(answers[q]), rotation);
        const p2 = rotate([ (CX+ Math.cos(theta)*r), CY+(Math.sin(theta)*r)], rotation); 
        const p3 = [CX, CY]
        return `M${p1[0]},${p1[1]}L${p2[0]},${p2[1]}L${p3[0]},${p3[1]}Z`
    }

 
    const SVGHEIGHT = 300;//deviceType == "mobile" ? height - (width) : height-270;

    return  <svg onClick={clicked} width={SVGHEIGHT} height={SVGHEIGHT}  viewBox="0 0 150 150" className={styles.hexagon}>
                    
                    <g transform="translate(0,2)">
                    <g id="bighexagon">
                        <path id="outerhex" d="M75.482,17.152L138.285,62.869L114.297,136.839L36.668,136.839L12.679,62.869L75.482,17.152Z" className={styles.outerhex} style={{opacity:0.1,fill:"#c8c8c8"}}/>
                        <g><text x="73.922px" y="85.036px" className={styles.zerotext}></text></g>
                        
                        {/*<path d="M75.508,83.474L75.63,17.067" className={styles.scaleline} />
                            <path d="M75.6,83.5L138.2,62.7" className={styles.scaleline}  />
                            <path d="M75.4,83.1L114.4,136.8" className={styles.scaleline} />
                            <path d="M75.3,83.3L36.6,137.0" className={styles.scaleline} />
                            <path d="M75.8,83.3L12.8,63.3" className={styles.scaleline} />*/}
                        
                    </g>            
                
                    {/*<path id="innerhex" d={pathstr(0,"q1")} className={styles.innerhexline} style={{opacity: selected ? selected=="q1" ? 0.5 : 1 : 1}}/>
                    <path id="innerhex" d={pathstr(72,"q2")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q2" ? 0.5 : 1: 1}}/>
                    <path id="innerhex" d={pathstr(144,"q3")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q3" ?0.5 : 1: 1}}/>
                    <path id="innerhex" d={pathstr(216,"q4")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q4" ? 0.5 : 1:1}}/>
                        <path id="innerhex" d={pathstr(288,"q5")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q5" ? 0.5 : 1: 1}}/>*/}

                    <path id="innerhex" d={fullpath()} className={styles.innerhexline} />
                    {/*<g>
                        <rect x={30} y={133} width={130} rx={1} ry={1} height={3} style={{fill:"white"}}></rect>
                        <circle id="dragcircle" cx={85} cy={134.5} r={6} style={{fill:"#282b55", stroke:"white"}}></circle>
                    </g>*/}
                    </g>
                </svg>
       
}


export default FivePointFeedback;