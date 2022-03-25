import styles from '../styles/FourPoint.module.scss'
import { fullpath, seppath, segpath } from '../utils/fourpoint';
const SVGHEIGHT = 300;

const FourPointFeedback = ({answers, clicked, selected, width=SVGHEIGHT, height=SVGHEIGHT}) => {

    
   
    const _sindex = selected ? selected[1]-1 : -1;
    const paths = seppath(answers);
    const opacity = selected ? 0.3 : 1;
    return <svg onClick={clicked}  width={width} height={height}   viewBox="0 0 150 150"  className={styles.square}> 
                    <g transform="translate(10,5)">
                    <g id="bigsquare">
                        <path d="M63.349,13.343L0.416,76.275L63.349,139.208L126.281,76.275L63.349,13.343Z" className={styles.outersquare}/>
                        {/*<path d={segpath(answers)} className={styles.innersquare} />*/}
                        {paths.map((p,i)=>{
                            return <path key={i} d={p} className={styles.innersquare} style={{opacity}}></path>
                        })}
                        {_sindex >= 0 && <path d={paths[_sindex||0]} className={styles.innersquare} style={{opacity: 1}}></path>}
                        {/*<path d="M63.13,14.163L63.657,139.542" className={styles.scaleline}/>
                        <path d="M0.865,76.474L125.922,76.474" className={styles.scaleline}/>
                        <circle cx="63.394" cy="76.686" r={2} className={styles.center} />*/}
                    </g>
                    </g>
                </svg>
        
}

export default FourPointFeedback;