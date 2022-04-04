import styles from '../styles/FourPoint.module.scss'
import { fullpath, seppath, segpath } from '../utils/fourpoint';
const SVGHEIGHT = 300;

const FourPointFeedback = ({answers, previous, clicked, selected, width=SVGHEIGHT, height=SVGHEIGHT}) => {
    const renderGhosts = ()=>{
        return Object.keys(previous||{}).map((k,i)=>{
            return <path key={i} d={fullpath(previous[k].d2)} className={styles.ghost} style={{opacity}}></path> 
        });
    }
    const renderLabels = (index)=>{
        return <g>
                <text x={100} y={40} className={styles.label} style={{opacity: index==0 ? 1.0 : 0.4}} transform="rotate(45,100,40)">option</text>
                <text x={100} y={118} className={styles.label} style={{opacity: index==1 ? 1.0 : 0.4}}transform="rotate(-45,100,115)">utility</text>
                <text x={20} y={113} className={styles.label} style={{opacity: index==2 ? 1.0 : 0.4}}transform="rotate(45,18,118)">prefer</text>
                <text x={25} y={45} className={styles.label} style={{opacity: index==3 ? 1.0 : 0.4}} transform="rotate(-45,20,40)">recommend</text>
            </g>
    }
    
    const _sindex = selected ? selected[1]-1 : -1;
    const paths = seppath(answers);
    const opacity = selected ? 0.3 : 1;
    return <svg onClick={clicked}  width={width} height={height}   viewBox="0 0 150 150"  className={styles.square}> 
                    <g transform="translate(10,5)">
                    <g id="bigsquare">
                        <path d="M63.349,13.343L0.416,76.275L63.349,139.208L126.281,76.275L63.349,13.343Z" className={styles.outersquare} style={{stroke: selected ? "white": "none"}}/>
                        {/*<path d={segpath(answers)} className={styles.innersquare} />*/}
                        {renderGhosts()}
                        {paths.map((p,i)=>{
                            return <path key={i} d={p} className={styles.innersquare} style={{opacity}}></path>
                        })}
                        {_sindex >= 0 && <path d={paths[_sindex||0]} className={styles.innersquare} style={{opacity: 1}}></path>}
                        {selected && renderLabels(_sindex)}
                    </g>
                    </g>
                </svg>
        
}

export default FourPointFeedback;