
import {useState, useEffect} from 'react';
import Layout  from '../components/Layout';

import ThreePointFeedback from '../components/ThreePointFeedback';
import FivePointFeedback from '../components/FivePointFeedback';
import FourPointFeedback from '../components/FourPointFeedback';

export default function Home({deviceType}) {
 
  const d1q2ypos = (x) => (18 / 31 * x) + 27;
  const d1q3ypos = (x) => (-13.5 / 23 * x) + 154;
  
  const d3q2ypos = (x)=>(-0.33*x) + 108.6
  const d3q3ypos = (x)=>(1.38*x) -20.72
  const d3q4ypos = (x)=>(-1.39*x) + 187.79
  const d3q5ypos = (x)=>(0.32*x) + 59.24

  const [dimension, setDimension] = useState("d1");
  const [chapter, setChapter] = useState(0);
  

  const [windowSize, setWindowSize] = useState({width:500,height:500})

  useEffect(() => {
    setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
  }, []);


  const [points, setPoints] = useState({
    0:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76}, q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    },
    1:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    },
    2:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    },
    3:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    },
    4:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    },
    5:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    }, 
    6:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    },
    7:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:d1q2ypos(140.5)},q3:{x:83, y:d1q3ypos(83)}},
      d2:{q1:{x:63.4,y:45}, q2:{x:99, y:76},q3:{x:63.3, y:106.8}, q4:{x:27.5,y:76.6}},
      d3:{q1:{x:75.6, y:41.2},q2:{x:113.5, y:d3q2ypos(113.5)}, q3:{x:92,y:d3q3ypos(92)}, q4:{x:50.2,y:d3q4ypos(50.2)},q5:{x:27.3,y:d3q5ypos(27.3)}}
    }
  });


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
              />
      case "d2":
        return <FourPointFeedback 
                  points={points[chapter][dimension]} 
                  deviceType={deviceType} 
                  colour={colours[dimension]} 
                  setPoints={_setPoints}
                  width={windowSize.width}
                  height={windowSize.height}
                />
      case "d3":
        return <FivePointFeedback 
                  points={points[chapter][dimension]} 
                  setPoints={_setPoints} 
                  colour={colours[dimension]} 
                  deviceType={deviceType}
                  width={windowSize.width}
                  height={windowSize.height}
                />
    }
  }

  return (
    <Layout points={points[chapter]} dimension={dimension} colours={threeDcolours} chapter={chapter} setChapter={setChapter} setDimension={setDimension}>
      {renderDimension()}
    </Layout>
  )
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
