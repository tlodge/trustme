import styles from '../styles/Home.module.scss'
import {fullpath, seppath, segpath} from '../utils/threepoint';
const SVGHEIGHT = 300;

const ThreePointFeedback = ({answers, selected, clicked, width=SVGHEIGHT, height=SVGHEIGHT}) => {
   

    const _sindex = selected ? selected[1]-1 : -1;
    const paths = seppath(answers);
    const opacity = selected ? 0.3 : 1;

    //deviceType == "mobile" ? height - (width) : height-270;
    return <svg  onClick={clicked} width={width} height={height} viewBox="0 0 150 150" className={styles.trianglesvg}>
   
                    <g transform="translate(-33,5)">
                    
                        <g id="bigtriangle">
                            <path d="M45.884,127.352L109.629,17.053L172.902,127.352L45.884,127.352Z" className={styles.outertriangle}/>
                        </g> 

                      
                        {paths.map((p,i)=>{
                            return <path key={i} d={p} className={styles.innertriangle} style={{opacity}}></path>
                        })}
                        {_sindex >= 0 && <path d={paths[_sindex||0]} className={styles.innertriangle} style={{opacity:1}}></path>}
                    </g>
                    {/*<g>
                        <rect x={30} y={120} width={130} rx={1} ry={1} height={3} style={{fill:"white"}}></rect>
                        <circle id="dragcircle" cx={85} cy={121.5} r={6} style={{fill:"#282b55", stroke:"white"}}></circle>
                    </g>*/}
                </svg>
          
}

export default ThreePointFeedback;