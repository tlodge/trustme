import styles from '../styles/FivePoint.module.css'
import { fullpath } from '../utils/fivepoint';
const FivePointFeedback = ({answers, clicked, selected}) => {
    

 
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

                    <path id="innerhex" d={fullpath(answers)} className={styles.innerhexline} />
                    {/*<g>
                        <rect x={30} y={133} width={130} rx={1} ry={1} height={3} style={{fill:"white"}}></rect>
                        <circle id="dragcircle" cx={85} cy={134.5} r={6} style={{fill:"#282b55", stroke:"white"}}></circle>
                    </g>*/}
                    </g>
                </svg>
       
}


export default FivePointFeedback;