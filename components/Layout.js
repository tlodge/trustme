
import styles from '../styles/Layout.module.scss'
import ThreePointFeedback  from './ThreePointFeedback';
import FivePointFeedback from './FivePointFeedback';
import FourPointFeedback from './FourPointFeedback';



const Layout = ({children, chapter, colours, answers, setChapter, setDimension, deviceType, onComplete, chapterText}) => {

    const isMobile = deviceType === "mobile";

    const chapters = ()=>{
        
        return [0,1,2,3,4,5].map((c)=>{
           
            return <div key={c} onClick={()=>setChapter(c)} style={{display:"flex", flexDirection:"row", paddingTop:10, paddingBottom:10}}>
                        <div style={{padding:7}}><ThreePointFeedback selected={false} answers={answers[c].d1} clicked={()=>{}} width={50} height={50}/></div>
                        <div style={{padding:7}}><FourPointFeedback selected={false} answers={answers[c].d2} clicked={()=>{}} width={50} height={50}/></div>
                        <div style={{padding:7}}><FivePointFeedback selected={false} answers={answers[c].d3} clicked={()=>{}} width={50} height={50}/></div>
                    </div>
        

        });
    }

   

    const renderChapters = ()=>{
        const cstyle = {
           
            alignItems:"center", 
            justifyContent: isMobile ? "center" : "center",
            flexDirection: isMobile ? "row" : "column", 
            width: isMobile ? "auto" : "250px", 
            alignItems:"center",
            border: !isMobile ? "1px solid #c8c8c8" : "none",
            borderRadius: 8,
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
              
                    <div style={{display:'flex', flex: "1 1 auto",  flexDirection:"column"}}>     
                       {/* <div style={{width:902, fontSize:"1.1em", marginLeft:20, color:"white", textAlign:"center"}}>
                            {chapterText}
</div>*/}
                        <div style={{ display:"flex", flexDirection: isMobile ? "column":"row", margin: !isMobile ? "20px": "0px"}}>
                            {isMobile && renderChapters()}
                            <div className={styles.innercontainer} style={{border: isMobile?"none":"1px solid #c8c8c8", borderRadius:8}}>
                                <div className={styles.chaptertext}>{chapterText}</div>
                                {children}
                            </div>
                            {!isMobile && renderChapters()}
                        </div>
                    </div>
                   
                </div>
            </div>
    
};
 
export default Layout;