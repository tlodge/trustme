import styles from '../styles/FourPoint.module.css'
import * as d3 from 'd3';
import { fullpath as fp3 } from '../utils/threepoint';
import { fullpath as fp4 } from '../utils/fourpoint';
import { fullpath as fp5 } from '../utils/fivepoint';

const CompositeShape = ({answers, clicked, selected}) => {
    const colours = {
        "d1":"#bb2929",
        "d2":"#e19c38",
        "d3":"#61b359"
    }
    const fn = {
        "d1": fp3,
        "d2": fp4,
        "d3": fp5
    }

    const linestyle = (dim) => {
        return {
            fill:"none",//colours[dim], 
            fillOpacity:0.1,
            strokeOpacity:0.8,
            strokeWidth:0.5,
            stroke:"white",//colours[dim]
        }
    }
    
    const SVGHEIGHT = 450;
    
    const center = {
        "d1":[109.5,90.5],
        "d2":[63,76.6],
        "d3":[75.5, 83]
    }

    const renderChaptersFor = (dim)=>{
        const p = center[dim];
        return [0,1,2,3,4,5,6,7].map((chapter,i)=>{
           return <g key={chapter} transform={`rotate(${45*i},${[p[0]]},${p[1]})`}>  
            <path d={fn[dim](answers[chapter][dim])} style={linestyle(dim)} />
          </g>
        })
        
    }
    return <svg onClick={clicked}  width={SVGHEIGHT} height={SVGHEIGHT}   viewBox="0 0 150 150"  className={styles.square}> 
                {/*<rect x={0} y={0} width={SVGHEIGHT-10} height={SVGHEIGHT-10}/>*/}
                <g transform="translate(10,5)">
                    
                    <g id="3p" transform="translate(-12,-10)">
                        {renderChaptersFor("d3")}
                    </g>
                        
                    <g id="4p" transform="translate(-46.3,-17.5)">  
                        {renderChaptersFor("d1")}
                    </g>

                    <g id="5p" transform="translate(0,-3.5)">
                        {renderChaptersFor("d2")}
                    </g>
                
                </g>
                   
            </svg>
        
}

export default CompositeShape;

/*

                        */