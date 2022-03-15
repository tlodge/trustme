
import {useState, useEffect} from 'react';
import Layout from  '../components/Layout'

import ThreePointFeedback from '../components/ThreePointFeedback';
import FivePointFeedback from '../components/FivePointFeedback';
import FourPointFeedback from '../components/FourPointFeedback';
import Slider from '../components/Slider';
import VideoPlayer from '../components/VideoPlayer';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'
import styles from '../styles/Home.module.css'
import * as d3 from 'd3';

import {
  selectQuestions,
  selectAnswers,
  selectAllAnswers,
  selectPoints,
  selectChapter,
  selectDimension,
  setChapter,
  setDimension,
  setAnswer,
} from '../features/questions/questionSlice'

import CompositeShape from '../components/CompositeShape';

export default function Home(props) {
 
  const {deviceType} = props; 
  const [windowSize, setWindowSize] = useState({width:0,height:0})
  const [lastUpdate, setLastUpdate] = useState(0);

  const  [view, setView] = useState("feedback"); //player || feedback!
  
  const dispatch = useAppDispatch()
  const points = useAppSelector(selectPoints);

  //const {shapes:points} = useAppSelector(selectShapes)
  const questions = useAppSelector(selectQuestions);
  const answers = useAppSelector(selectAnswers);
  const allanswers = useAppSelector(selectAllAnswers);
  const chapter = useAppSelector(selectChapter);
  const dimension = useAppSelector(selectDimension);

  const [question, setQuestion] = useState("q1");
  const [questionText, setQuestionText] = useState(questions.q1[0]);
  const [latestAnswers, setLatestAnswers] = useState(answers);

  const nextQuestion = {
    "d1":{
      "q1": "q2",
      "q2": "q3",
      "q3": "q1",
      "q4": "q1",
      "q5": "q1"
    },
    "d2":{
      "q1":"q2",
      "q2":"q3",
      "q3":"q4",
      "q4":"q1",
      "q5":"q1"
    },
    "d3":{
      "q1":"q2",
      "q2":"q3",
      "q3":"q4",
      "q4":"q5",
      "q5":"q1"
    }
  }

  useEffect(()=>{
    setLatestAnswers(allanswers);
  },[lastUpdate])

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
    setView("feedback");
    dispatch(setChapter(chapter));
  }

  const currentQuestion = (value)=>{
    return questions[selected][Math.ceil(questionScale(value))];
  }

  const questionScale = d3.scaleLinear().clamp(true).domain([0,100]).range([0, questions.q1.length-1]);
  
  const _setAnswer = (answer)=>{
    setQuestionText(questions[question][Math.ceil(questionScale(answer))]);
    dispatch(setAnswer({chapter,dimension,question,answer}))
  }

  const threeDcolours = {
    "d1":[0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F], 
    "d2":[0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36],
    "d3":[0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647]
};


const renderDimensions = ()=>{
  return <div>
    <div className={styles.questiontext}>{questionText}</div>

      <Slider question={question} answer={answers[dimension][question]} setAnswer={(answer)=>_setAnswer(answer)} end={()=>{
          setLastUpdate(Date.now());
          const nq = nextQuestion[dimension][question];
          setQuestion(nq)
          setQuestionText(questions[nq][0]);
        }
      }/>
      
      <div style={{display:"flex", flexDirection:"row"}}>
          <ThreePointFeedback selected={dimension == "d1" ? question: null} answers={answers.d1} clicked={()=>{_setDimension("d1");setQuestion("q1")}}/>
          <FourPointFeedback  selected={dimension == "d2" ? question: null} answers={answers.d2}  clicked={()=>{_setDimension("d2");setQuestion("q1")}}/>
          <FivePointFeedback  selected={dimension == "d3" ? question: null} answers={answers.d3}  clicked={()=>{_setDimension("d3");setQuestion("q1")}}/>
      </div>

     
  </div>
}

const renderFinal = ()=>{ 
  return  <Layout points={points} deviceType={deviceType} answers={allanswers} dimension={dimension} colours={threeDcolours} chapter={chapter} setChapter={_setChapter} setDimension={_setDimension} onComplete={()=>setView("final")}>
            <CompositeShape answers={latestAnswers}/>
          </Layout>
}

const renderFeedback = ()=>{
    if (windowSize.width > 0){
      return <Layout points={points} deviceType={deviceType} answers={allanswers} dimension={dimension} colours={threeDcolours} chapter={chapter} setChapter={_setChapter} setDimension={_setDimension} onComplete={()=>setView("final")}>
        {renderDimensions()}
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
      {view === "feedback" && renderFeedback()}
      {view === "final" && renderFinal()}
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
