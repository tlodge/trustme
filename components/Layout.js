import GamutMenu from '../components/GamutMenu';

const Layout = ({points,children,dimension, chapter, colours, setChapter, setDimension}) => {

    const renderChapters = ()=>{
        
       return [0,1,2,3,4].map((c)=><div key={c} style={{fontSize:"2em", paddingTop:2, margin:10,color:c===chapter ? "white":"#aaa", background:c===chapter ? "#5882B3":"white", textAlign:"center", width:50, height:50, borderRadius:25, border:`3px solid ${c===chapter?"#333":"#888"}` }} onClick={()=>setChapter(c)}>{c+1}</div>);
    }

    return  <div style={{display:'flex', height:"100vh", alignItems:"center"}}>
        <div style={{display:"flex", flexDirection:"row", background:"white"}}>
        <div style={{display:'flex', flexDirection:"column"}}>     
                {children}
                <GamutMenu points={points} chapter={chapter} colours={colours} dimension={dimension} setDimension={setDimension}/>
          </div>
          <div style={{display:"flex", alignItems:"center", flexDirection:"column", width:"300px", borderLeft:"1px solid #ddd", background:"#eee", padding:20}}>
                {renderChapters()}
          </div>
               

        </div>
    </div>
    
};
 
export default Layout;