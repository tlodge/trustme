import TriangleShape from '../components/TriangleShape';
import styles from '../styles/Home.module.css';

const dimensions = ["d1","d2","d3"];
const d1CX = 109, d1CY = 89; 
const d2CX = 63.3, d2CY = 76.6;
const d3CX = 75.5, d3CY = 83;

const genpath = (d, points)=>{

    switch (d){
        case "d1":
            return `M${points[d].q3.x-d1CX},${points[d].q3.y-d1CY}L${points[d].q1.x-d1CX},${points[d].q1.y-d1CY}L${points[d].q2.x-d1CX},${points[d].q2.y-d1CY}Z` 
        case "d2":
            return `M${points[d].q1.x-d2CX},${points[d].q1.y-d2CY}L${points[d].q2.x-d2CX},${points[d].q2.y-d2CY}L${points[d].q3.x-d2CX},${points[d].q3.y-d2CY}L${points[d].q4.x-d2CX},${points[d].q4.y-d2CY}L${points[d].q1.x-d2CX},${points[d].q1.y-d2CY}Z`
        case "d3":
            return `M${points[d].q1.x-d3CX},${points[d].q1.y-d3CY}L${points[d].q2.x-d3CX},${points[d].q2.y-d3CY}L${points[d].q3.x-d3CX},${points[d].q3.y-d3CY}L${points[d].q4.x-d3CX},${points[d].q4.y-d3CY}L${points[d].q5.x-d3CX},${points[d].q5.y-d3CY}L${points[d].q1.x-d3CX},${points[d].q1.y-d3CY}Z`
    }
    
}

const renderFeedback = ({points,dimension,chapter,colours,setDimension, deviceType})=>{

   
    return (deviceType==="mobile" ? [dimension] : dimensions).map(d=>{
        return <TriangleShape 
                     key={d} 
                     chapter={chapter}
                     colour={colours[d]}
                     onClick={(e)=>{setDimension(d)}} 
                     style={{opacity:dimension===d? 1.0:0.2}} 
                     className={styles.gamut}
                     deviceType={deviceType}
                     paths={[...Array(chapter+1).keys()].map(ch=>genpath(d,points[ch]))}/>
    })
}

const GamutMenu = (props) => {
    return <div className={styles.gamutmenu}>        
        {renderFeedback(props)}
    </div>
}

export default GamutMenu;