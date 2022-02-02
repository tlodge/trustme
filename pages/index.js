
import {useState, useEffect} from 'react';
import Layout from  '../components/Layout'

import ThreePointFeedback from '../components/ThreePointFeedback';
import FivePointFeedback from '../components/FivePointFeedback';
import FourPointFeedback from '../components/FourPointFeedback';
import VideoPlayer from '../components/VideoPlayer';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'

import {
  selectShapes,
} from '../features/shapes/shapeSlice'

import {
  selectQuestions,
  selectAnswers,
  selectPoints,
  selectChapter,
  selectDimension,
  setChapter,
  setDimension,
  setAnswer,
} from '../features/questions/questionSlice'

export default function Home(props) {
 
  const {deviceType} = props; 
  const [windowSize, setWindowSize] = useState({width:0,height:0})
  const  [view, setView] = useState("player"); //player || feedback!
  
  const dispatch = useAppDispatch()
  const points = useAppSelector(selectPoints);

  //const {shapes:points} = useAppSelector(selectShapes)
  const questions = useAppSelector(selectQuestions);
  const answers = useAppSelector(selectAnswers);
  const chapter = useAppSelector(selectChapter);
  const dimension = useAppSelector(selectDimension);


  useEffect(() => {
    setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
  }, []);

  const _setDimension = (dimension)=>{
    dispatch(setDimension(dimension));
  } 

  const _setChapter = (chapter)=>{
    dispatch(setChapter(chapter));
  }

  const _setAnswer = (question, answer)=>{
    dispatch(setAnswer({chapter,dimension,question,answer}))
  }

  const colours = {"d1":["#E16E6E","#ba2727"], "d2":["#FFF1D4","#EEDBB6"], "d3":["#C8DED2","#E4E9DB"]};
  
  /*const threeDcolours = {
            "d1":[0xB71C1C,0xC62828,0xD32F2F,0xE53935,0xF44336,0xEF5350,0xE57373,0xEF9A9A,0xFFCDD2], 
            "d2":[0xFF8F00,0xFFA000,0xFFB300,0xFFC107,0xFFCA28,0xFFD54F,0xFFE082,0xFFECB3,0xFFF8E1],
            "d3":[0x004D40,0x00695C,0x00796B,0x00897B,0x009688,0x26A69A,0x4DB6AC,0x80CBC4,0xB2DFDB]
  };*/
  
  const threeDcolours = {
    "d1":[0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F], 
    "d2":[0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36],
    "d3":[0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647]
};

  const renderDimension = ()=>{
   
    switch (dimension){
      
      case "d1":
        return <ThreePointFeedback 
                answers={answers}
                deviceType={deviceType} 
                colour={colours[dimension]}
                width={windowSize.width}
                height={windowSize.height}
                questions={questions}
                setAnswer={(q, a)=>_setAnswer(q,a)}
                complete={()=>{_setDimension("d2")}}
              />
      case "d2":
        return <FourPointFeedback 
                  answers={answers}
                  questions={questions}
                  deviceType={deviceType} 
                  colour={colours[dimension]} 
                  width={windowSize.width}
                  height={windowSize.height}
                  setAnswer={(q, a)=>_setAnswer(q,a)}
                  complete={()=>{_setDimension("d3")}}
                />
      case "d3":
        return <FivePointFeedback 
                  colour={colours[dimension]} 
                  deviceType={deviceType}
                  width={windowSize.width}
                  height={windowSize.height}
                  questions={questions}
                  answers={answers}
                  setAnswer={(q, a)=>_setAnswer(q,a)}
                  complete={()=>{
                    _setDimension("d1");
                    setView("player");
                    _setChapter((++chapter)%Object.keys(points).length);
                  }}
                />
    }
  }


  const renderFeedback = ()=>{
    if (windowSize.width > 0){
      return <Layout points={points} deviceType={deviceType} dimension={dimension} colours={threeDcolours} chapter={chapter} setChapter={_setChapter} setDimension={_setDimension}>
        {renderDimension()}
      </Layout>
   
    }
  }

  const renderPlayer = ()=>{
  
    return <div>
      <VideoPlayer chapter={chapter+1} width={windowSize.width} amFinished={()=>{
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
