import TriangleShape from '../components/TriangleShape';
import styles from '../styles/Home.module.scss';

const dimensions = ["d1","d2","d3"];
const d1CX = 109, d1CY = 89; 
const d2CX = 63.3, d2CY = 76.6;
const d3CX = 75.5, d3CY = 83;

const dimcolours = {
    "d1":0xbb2929,
    "d2":0xe19c38,
    "d3":0x61b359
}

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
                     selectedColour={dimcolours[d]}
                     onClick={(e)=>{setDimension(d)}} 
                     style={{}} 
                     className={styles.gamut}
                     deviceType={deviceType}
                     paths={[...Array(chapter+1).keys()].map(ch=>genpath(d,points[ch]))}/>
    })
}

const GamutMenu = (props) => {
    const isMobile = props.deviceType==="mobile";
    return <div className={styles.gamutmenu} style={{margin: isMobile ? 0:"0px 20px 20px 20px", border: isMobile ? "none":"1px solid #c8c8c8"}}>        
        {renderFeedback(props)}
    </div>
}

export default GamutMenu;