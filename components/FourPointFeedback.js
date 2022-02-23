import styles from '../styles/FourPoint.module.css'
import * as d3 from 'd3';

const CX = 63, CY = 76.6;

const q1points = (answer)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([14,68.3]);
    return [63.4, q1ToY(answer)];
}

const FourPointFeedback = ({answers, clicked, selected}) => {

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

        const theta = (Math.PI/180);
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
        const [f4,f5,f6] = points("q2",90);
        const [f7,f8,f9] = points("q3",180);
        const [f10,f11,f12] = points("q3",270);

        return createpath([f1,f2,f4,f5,f7,f8,f10,f11]);
    }


    const SVGHEIGHT = 300;

    return <svg onClick={clicked}  width={SVGHEIGHT} height={SVGHEIGHT}   viewBox="0 0 150 150"  className={styles.square}> 
                    <g transform="translate(10,5)">
                    <g id="bigsquare">
                        <path d="M63.349,13.343L0.416,76.275L63.349,139.208L126.281,76.275L63.349,13.343Z" className={styles.outersquare} style={{opacity:0.1,fill:"#c8c8c8"}}/>
                        <path d={fullpath()} className={styles.innersquare} />

                        {/*<path d="M63.13,14.163L63.657,139.542" className={styles.scaleline}/>
                        <path d="M0.865,76.474L125.922,76.474" className={styles.scaleline}/>
                        <circle cx="63.394" cy="76.686" r={2} className={styles.center} />*/}
                    </g>
                    </g>
                </svg>
        
}

export default FourPointFeedback;