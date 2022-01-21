import GamutMenu from '../components/GamutMenu';

const Layout = ({points,children,dimension, chapter, colours, setChapter, setDimension, deviceType}) => {

    const isMobile = deviceType === "mobile";

    const chapters = ()=>{
        
        return [0,1,2,3,4,5,6,7].map((c)=>{
            const chstyle = {
                fontSize:isMobile ? "1em" : "2em", 
                paddingTop:2, 
                margin:isMobile ? 4 : 10,
                color:c===chapter ? "white":"#aaa", 
                background:c===chapter ? "#5882B3":"white", 
                textAlign:"center", 
                width: isMobile ? 30 : 50, 
                height: isMobile ? 30 : 50, 
                borderRadius: isMobile ? 15 : 25, 
                border:`3px solid ${c===chapter?"#333":"#888"}` 
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
            width: isMobile ? "100vw" : "300px", 
            borderLeft:"1px solid #ddd", 
            background:"#eee", 
            padding: 20
        }

        return <div style={cstyle}>
            {chapters()}
        </div>
    }
    return  <div style={{display:'flex', height:"100vh", width:"100vw", alignItems:"center", background:"black", justifyContent:"center"}}>
                <div style={{display:"flex", flexDirection: isMobile ? "column":"row", height:"100vh", paddingTop:20, flex: "1 1 auto", background:"white"}}>
                    <div style={{display:'flex', flex: "1 1 auto", flexDirection:"column"}}>     
                            {children}
                            <GamutMenu points={points} deviceType={deviceType} chapter={chapter} colours={colours} dimension={dimension} setDimension={setDimension}/>
                    </div>
                    {renderChapters()}
                </div>
            </div>
    
};
 
export default Layout;