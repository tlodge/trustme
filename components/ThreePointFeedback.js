import styles from '../styles/Home.module.css'
import {fullpath, segpath} from '../utils/threepoint';


const ThreePointFeedback = ({answers, selected, clicked}) => {
   
   
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
<path id="dimshape" d={pathstr("q3",240)} className={styles.innertriangle} style={{ opacity: selected ? selected=="q3" ? 0.5: 1 : 1}}/> */}    
                        {<path d={segpath(answers)} className={styles.innertriangle}></path>}
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