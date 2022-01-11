import TriangleShape from '../components/TriangleShape';
import styles from '../styles/Home.module.css';
const CX = 109, CY = 89; 
const dimensions = ["d1","d2","d3","d4","d5"];

const renderFeedback = ({points,dimension,chapter,colours,setDimension})=>{
    return dimensions.map(d=>{
        return <TriangleShape 
                     key={d} 
                     chapter={chapter}
                     colour={colours[d][0]}
                     onClick={(e)=>{setDimension(d)}} 
                     style={{opacity:dimension===d? 1.0:0.2}} 
                     className={styles.gamut} 
                     path={`M${points[d].q3.x-CX},${points[d].q3.y-CY}L${points[d].q1.x-CX},${points[d].q1.y-CY}L${points[d].q2.x-CX},${points[d].q2.y-CY}Z`}/>
    })
}

const GamutMenu = (props) => {
    return <div className={styles.gamutmenu}>        
        {renderFeedback(props)}
    </div>
}

export default GamutMenu;