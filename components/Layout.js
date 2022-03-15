import GamutMenu from '../components/GamutMenu';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'
import ThreePointFeedback  from './ThreePointFeedback';
import FivePointFeedback from './FivePointFeedback';
import FourPointFeedback from './FourPointFeedback';
import {
  selectQuestions
} from '../features/questions/questionSlice'



const Layout = ({points,children,dimension, chapter, colours, answers, setChapter, setDimension, deviceType, onComplete}) => {

    const isMobile = deviceType === "mobile";

    const chapters = ()=>{
        
        return [0,1,2,3,4,5,6,7,8].map((c)=>{
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
            const fstyle = {
                fontFamily: "'Nunito', sans-serif",
                fontSize:isMobile ? "0.8em" : "1.5em", 
                paddingTop: isMobile ? 7 : 9, 
                margin:isMobile ? 4 : 10,
                color:"#171834", 
                opacity:0.5, 
                textAlign:"center", 
                height: isMobile ? 30 : 50, 
            }
            return c <= 7 ? <div style={{display: "flex", flexDirection:"row", padding:8}}>
                    <div key={c} style={chstyle} onClick={()=>setChapter(c)}>{c+1}</div>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <ThreePointFeedback selected={false} answers={answers[c].d1} clicked={()=>{}} width={50} height={50}/>
                        <FourPointFeedback selected={false} answers={answers[c].d2} clicked={()=>{}} width={50} height={50}/>
                        <FivePointFeedback selected={false} answers={answers[c].d3} clicked={()=>{}} width={50} height={50}/>
                    </div>
            </div>
            : <div key={c} style={fstyle} onClick={()=>onComplete()}>see final</div>
        });
    }

    const renderChapters = ()=>{
        const cstyle = {
            display:"flex", 
            alignItems:"center", 
            justifyContent: isMobile ? "center" : "flex-start",
            flexDirection: isMobile ? "row" : "column", 
            width: isMobile ? "auto" : "250px", 
            alignItems:"center",
            border: !isMobile ? "1px solid #c8c8c8" : "none",
            marginLeft: !isMobile ? 20 : 0,
            background: "#2b2b55",
            padding: isMobile ? 15: 0,
        }

        return <div style={cstyle}>
                {!isMobile && <div style={{fontFamily: "'Nunito', sans-serif", margin:20,fontWeight:300,fontSize:"1.5em",color:"#c8c8c8"}}>Chapter</div>}
                {chapters()}
           
        </div>
    }
    return  <div style={{display:'flex', height:"100vh", width:"100vw", alignItems:"center", background:"black", justifyContent:"center"}}>
                <div style={{display:"flex", flexDirection: isMobile ? "column":"row", height:"100vh", flex: "1 1 auto", background:"#171834"}}>
                    
                    <div style={{display:'flex', flex: "1 1 auto", flexDirection:"column"}}>     
                        <div style={{ display:"flex", flexDirection: isMobile ? "column":"row", margin: !isMobile ? "20px": "0px"}}>
                            {isMobile && renderChapters()}
                            <div style={{border: isMobile?"none":"1px solid #c8c8c8", background:"#2b2b55", display:"flex", alignItems:"center",justifyContent:"center",flex: "1 1 auto"}}>
                                {children}
                            </div>
                            {!isMobile && renderChapters()}
                        </div>
                        {/*<GamutMenu points={points} deviceType={deviceType} chapter={chapter} colours={colours} dimension={dimension} setDimension={setDimension}/>*/}
                    </div>
                   
                </div>
            </div>
    
};
 
export default Layout;