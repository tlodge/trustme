import GamutMenu from '../components/GamutMenu';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'

import {
  selectQuestions
} from '../features/questions/questionSlice'



const Layout = ({points,children,dimension, chapter, colours, setChapter, setDimension, deviceType}) => {

    const isMobile = deviceType === "mobile";

    const chapters = ()=>{
        
        return [0,1,2,3,4,5,6,7].map((c)=>{
            const chstyle = {
                fontFamily: "'Nunito', sans-serif",
                fontSize:isMobile ? "0.8em" : "1.5em", 
                paddingTop: isMobile ? 7 : 9, 
                margin:isMobile ? 4 : 10,
                color:"#171834", 
                background:"#c8c8c8", 
                opacity:c===chapter ? 1.0:0.5, 
                textAlign:"center", 
                width: isMobile ? 30 : 50, 
                height: isMobile ? 30 : 50, 
                borderRadius: isMobile ? 15 : 25, 
            }
            return <div key={c} style={chstyle} onClick={()=>setChapter(c)}>{c+1}</div>
        });
    }

    const renderChapters = ()=>{
        const cstyle = {
            display:"flex", 
            alignItems:"center", 
            justifyContent: isMobile ? "center" : "flex-start",
            flexDirection: isMobile ? "row" : "column", 
            width: isMobile ? "auto" : "200px", 
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
                            <div style={{border: isMobile?"none":"1px solid #c8c8c8", background:"#2b2b55", display:"flex", justifyContent:"center",flex: "1 1 auto"}}>
                                {children}
                            </div>
                            {!isMobile && renderChapters()}
                        </div>
                        <GamutMenu points={points} deviceType={deviceType} chapter={chapter} colours={colours} dimension={dimension} setDimension={setDimension}/>
                    </div>
                   
                </div>
            </div>
    
};
 
export default Layout;