import styles from '../styles/FourPoint.module.css'
import { fullpath, segpath } from '../utils/fourpoint';
const FourPointFeedback = ({answers, clicked, selected}) => {

    
    const SVGHEIGHT = 300;

    return <svg onClick={clicked}  width={SVGHEIGHT} height={SVGHEIGHT}   viewBox="0 0 150 150"  className={styles.square}> 
                    <g transform="translate(10,5)">
                    <g id="bigsquare">
                        <path d="M63.349,13.343L0.416,76.275L63.349,139.208L126.281,76.275L63.349,13.343Z" className={styles.outersquare} style={{opacity:0.1,fill:"#c8c8c8"}}/>
                        <path d={segpath(answers)} className={styles.innersquare} />

                        {/*<path d="M63.13,14.163L63.657,139.542" className={styles.scaleline}/>
                        <path d="M0.865,76.474L125.922,76.474" className={styles.scaleline}/>
                        <circle cx="63.394" cy="76.686" r={2} className={styles.center} />*/}
                    </g>
                    </g>
                </svg>
        
}

export default FourPointFeedback;