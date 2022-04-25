import styles from '../styles/Home.module.scss'
import {fullpath, seppath, segpath} from '../utils/threepoint';
const SVGHEIGHT = 300;

const ThreePointFeedback = ({answers, previous, selected, clicked, width=SVGHEIGHT, height=SVGHEIGHT, chaptercomplete=false, labels=false}) => {


    const renderGhosts = ()=>{
        return Object.keys(previous||{}).map((k,i)=>{
            return <path key={i} d={fullpath(previous[k].d1)} className={styles.ghost} style={{opacity}}></path> 
        });
    }

    const renderLabels = (index)=>{
        return <g>
            <text x={140} y={78} className={styles.label} style={{opacity: index==0 ? 1.0 : 0.4}} transform="rotate(60,150,80)">what</text>
            <text x={75} y={79} className={styles.label}    style={{opacity: index==2  ? 1.0 : 0.4}}  transform="rotate(-60,65,78)">how</text>
            <text x={110} y={140} className={styles.label} style={{opacity: index==1 ? 1.0 : 0.4}}  transform="rotate(0,150,80)">why</text>
        </g>
    }

    const _sindex = selected ? selected[1]-1 : -1;
    const paths = seppath(answers);
    const opacity = selected && !chaptercomplete ? 0.3 : 1;

    //deviceType == "mobile" ? height - (width) : height-270;
    return     <svg  onClick={clicked} width={width} height={height} viewBox="0 0 150 150" className={styles.trianglesvg}>
   
                    <g transform="translate(-33,5)">
                    
                        <g id="bigtriangle">
                            <path d="M45.884,127.352L109.629,17.053L172.902,127.352L45.884,127.352Z" className={styles.outertriangle} style={{stroke: selected || chaptercomplete ? "white": "none"}}/>
                        </g> 

                       {/*selected &&*/ labels && renderLabels(_sindex)}
                       {renderGhosts()}
                        {paths.map((p,i)=>{
                            return <path key={i} d={p} className={styles.innertriangle} style={{opacity}}></path>
                        })}
                        { _sindex >= 0  && <path d={paths[_sindex||0]} className={styles.innertriangle} style={{opacity:1}}></path>}
                    </g>
                </svg>
                
}

export default ThreePointFeedback;