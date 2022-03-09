import styles from '../styles/Home.module.css'
import * as d3 from 'd3';
import useD3 from '../hooks/useD3';
const qscale = d3.scaleLinear().clamp(true).domain([100, 685]).range([0,100]);
const ascale = d3.scaleLinear().clamp(true).domain([0,100]).range([100,685]);

const Slider = ({end, setAnswer, answer}) => {
   

    const updateAnswer = (answer)=>{
        setAnswer(answer)
    }

    const slider = useD3((root)=>{
     
        const controller = root.select("circle#dragcircle");
        controller.attr("cx", ascale(answer == -1 ? 50: answer));

        controller.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation();
            updateAnswer(qscale(e.x))
        }).on("end", ()=>{
            end();
        }));
    });
   
    const SVGHEIGHT = 60;

    return  <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"row"}}>
                <svg ref={slider} width={800} height={SVGHEIGHT} className={styles.trianglesvg}>
                    <text x={40} y={30} style={{fill:"white", textAnchor:"middle"}}>Not at all</text>
                    <g>
                        <rect x={100} y={20} width={585} rx={5} ry={5} height={10} style={{opacity:0.3,fill:"white"}}></rect>
                        <circle id="dragcircle" cx={ascale(answer)} cy={25} r={20} style={{fill:"#282b55", strokeWidth:2, stroke:"white"}}></circle>
                    </g>
                    <text x={755} y={30} style={{fill:"white", textAnchor:"middle"}}>Completely</text>
                </svg>
            </div>
}

export default Slider;