
import styles from '../styles/Layout.module.scss'
import ThreePointFeedback  from './ThreePointFeedback';
import FivePointFeedback from './FivePointFeedback';
import FourPointFeedback from './FourPointFeedback';



const Layout = ({children, chapter, colours, answers, setChapter, setDimension, deviceType, onComplete}) => {

    const isMobile = deviceType === "mobile";

    const chapters = ()=>{
        
        return [0,1,2,3,4,5,6,7].map((c)=>{
            const chstyle = {
                fontFamily: "'Nunito', sans-serif",
                fontSize:isMobile ? "0.8em" : "1.5em", 
                paddingTop: isMobile ? 7 : 6, 
                margin:isMobile ? 4 : "10px 20px 15px 0px",
                color:"#171834", 
                background:"#c8c8c8", 
                opacity:c===chapter ? 1.0:0.5, 
                textAlign:"center", 
                width: isMobile ? 30 : 40, 
                height: isMobile ? 30 : 40, 
                borderRadius: isMobile ? 15 : 20, 
            }
           
            /*return c <= 7 ? <div key={c} style={{display: "flex", flexDirection:"row", padding:8}}>
                    {<div  style={chstyle} onClick={()=>setChapter(c)}>{c+1}</div>}
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <ThreePointFeedback selected={false} answers={answers[c].d1} clicked={()=>{}} width={50} height={50}/>
                        <FourPointFeedback selected={false} answers={answers[c].d2} clicked={()=>{}} width={50} height={50}/>
                        <FivePointFeedback selected={false} answers={answers[c].d3} clicked={()=>{}} width={50} height={50}/>
                    </div>
            </div>
            : <div key={c} className={styles.chaptersidebar} onClick={()=>onComplete()}>see final</div>*/
            return <div key={c} onClick={()=>setChapter(c)} style={{display:"flex", flexDirection:"row", paddingTop:10, paddingBottom:10}}>
                        <ThreePointFeedback selected={false} answers={answers[c].d1} clicked={()=>{}} width={50} height={50}/>
                        <FourPointFeedback selected={false} answers={answers[c].d2} clicked={()=>{}} width={50} height={50}/>
                        <FivePointFeedback selected={false} answers={answers[c].d3} clicked={()=>{}} width={50} height={50}/>
                    </div>
        

        });
    }

   

    const renderChapters = ()=>{
        const cstyle = {
           
            alignItems:"center", 
            justifyContent: isMobile ? "center" : "flex-start",
            flexDirection: isMobile ? "row" : "column", 
            width: isMobile ? "auto" : "250px", 
            alignItems:"center",
            border: !isMobile ? "1px solid #c8c8c8" : "none",
            marginLeft: !isMobile ? 20 : 0,
            
            padding: isMobile ? 15: 20,
        }

        return <div  style={cstyle} className={styles.chaptercontainer}>
                {/* !isMobile && <div style={{fontFamily: "Headline-Light", letterSpacing: "2px", margin:20,fontWeight:300,fontSize:"1.5em",color:"#c8c8c8"}}>Chapter</div>*/}
                {chapters()}
        </div>
    }
    return  <div className={styles.screen}>
                <div className={styles.outercontainer} style={{ flexDirection: isMobile ? "column":"row", alignItems:"center"}}>
                    <div style={{display:'flex', flex: "1 1 auto", flexDirection:"column"}}>     
                        <div style={{ display:"flex", flexDirection: isMobile ? "column":"row", margin: !isMobile ? "20px": "0px"}}>
                            {isMobile && renderChapters()}
                            <div className={styles.innercontainer} style={{border: isMobile?"none":"1px solid #c8c8c8"}}>
                                {children}
                            </div>
                            {!isMobile && renderChapters()}
                        </div>
                    </div>
                   
                </div>
            </div>
    
};
 
export default Layout;