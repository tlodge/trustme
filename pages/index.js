
import {useState, useEffect} from 'react';
import Layout from  '../components/Layout'

import ThreePointFeedback from '../components/ThreePointFeedback';
import FivePointFeedback from '../components/FivePointFeedback';
import FourPointFeedback from '../components/FourPointFeedback';
import VideoPlayer from '../components/VideoPlayer';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'

import {
  setShapes,
  selectShapes,
} from '../features/shapes/shapeSlice'

export default function Home(props) {
 
  const {deviceType} = props;

  const [dimension, setDimension] = useState("d1");
  const [chapter, setChapter] = useState(0);
  const [windowSize, setWindowSize] = useState({width:0,height:0})
  const  [view, setView] = useState("player"); //player || feedback!
  
  const dispatch = useAppDispatch()
  
  const {shapes:points} = useAppSelector(selectShapes)

  useEffect(() => {
    setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
  }, []);

  const setPoints = (points)=>{
    dispatch(setShapes(points));
  }

  const _setPoints = (_points)=>{
      setPoints({
                  ...points, 
                  [chapter]:{ 
                    ...points[chapter], 
                    [dimension]: _points
                  }
                });
  }

  const colours = {"d1":["#E16E6E","#ba2727"], "d2":["#FFF1D4","#EEDBB6"], "d3":["#C8DED2","#E4E9DB"]};
  
  const threeDcolours = {
            "d1":[0xB71C1C,0xC62828,0xD32F2F,0xE53935,0xF44336,0xEF5350,0xE57373,0xEF9A9A,0xFFCDD2], 
            "d2":[0xFF8F00,0xFFA000,0xFFB300,0xFFC107,0xFFCA28,0xFFD54F,0xFFE082,0xFFECB3,0xFFF8E1],
            "d3":[0x004D40,0x00695C,0x00796B,0x00897B,0x009688,0x26A69A,0x4DB6AC,0x80CBC4,0xB2DFDB]
  };
  

  const renderDimension = ()=>{
   
    switch (dimension){
      
      case "d1":
        return <ThreePointFeedback 
                points={points[chapter][dimension]} 
                deviceType={deviceType} 
                colour={colours[dimension]} 
                setPoints={_setPoints}
                width={windowSize.width}
                height={windowSize.height}
                complete={()=>{setDimension("d2")}}
              />
      case "d2":
        return <FourPointFeedback 
                  points={points[chapter][dimension]} 
                  deviceType={deviceType} 
                  colour={colours[dimension]} 
                  setPoints={_setPoints}
                  width={windowSize.width}
                  height={windowSize.height}
                  complete={()=>{setDimension("d3")}}
                />
      case "d3":
        return <FivePointFeedback 
                  points={points[chapter][dimension]} 
                  setPoints={_setPoints} 
                  colour={colours[dimension]} 
                  deviceType={deviceType}
                  width={windowSize.width}
                  height={windowSize.height}
                  complete={()=>{
                    setDimension("d1");
                    setView("player");
                    setChapter((++chapter)%Object.keys(points).length);
                  }}
                />
    }
  }


  const renderFeedback = ()=>{
    if (windowSize.width > 0){

      return <div>
        <Layout points={points} dimension={dimension} colours={threeDcolours} chapter={chapter} setChapter={setChapter} setDimension={setDimension}>
        {renderDimension()}
      </Layout>
      </div> 
    }
  }

  const renderPlayer = ()=>{
    return <div style={{display: view === "feedback" ? "none" :"block"}}>
      <VideoPlayer chapter={chapter+1} amFinished={()=>{
        setView("feedback");
      }}/>
    </div>
  }

  return <>
  {renderFeedback()}
        {/*view=="feedback" && renderFeedback()*/}
        {/*view=="player" && renderPlayer()*/}
  </>

}

export async function getServerSideProps(context) {
  const UA = context.req.headers['user-agent'];
  const isMobile = Boolean(UA.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  ))
  
  return {
    props: {
      deviceType: isMobile ? 'mobile' : 'desktop'
    }
  }
}
