
import {useState, useEffect} from 'react';
import Layout from  '../components/Layout'

import ThreePointFeedback from '../components/ThreePointFeedback';
import FivePointFeedback from '../components/FivePointFeedback';
import FourPointFeedback from '../components/FourPointFeedback';
import Slider from '../components/Slider';
import VideoPlayer from '../components/VideoPlayer';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'
import styles from '../styles/Home.module.scss'
import * as d3 from 'd3';

import {
  selectChapterText,
  selectQuestions,
  selectAllQuestions,
  selectAnswers,
  selectAllAnswers,
  selectPoints,
  selectChapter,
  selectDimension,
  setChapter,
  setDimension,
  setAnswer,
  selectComplete,
  selectSavedId,
  saveShape,
  selectAnsweredEveything
} from '../features/questions/questionSlice'

import CompositeShape from '../components/CompositeShape';
import PrintableShape from '../components/PrintableShape';

export default function Home(props) {

  const {deviceType} = props; 
  const [windowSize, setWindowSize] = useState({width:0,height:0})
  const [ended, setEnded] = useState(false);

  const  [view, setView] = useState("player"); //player || feedback!
  
  const dispatch = useAppDispatch()
  const points = useAppSelector(selectPoints);
  const complete = useAppSelector(selectComplete);
  const id = useAppSelector(selectSavedId);

  const chaptertext = useAppSelector(selectChapterText);
  const questions = useAppSelector(selectQuestions);
  const allquestions = useAppSelector(selectAllQuestions);
  const answers = useAppSelector(selectAnswers);
  const allanswers = useAppSelector(selectAllAnswers);
  const chapter = useAppSelector(selectChapter);
  const dimension = useAppSelector(selectDimension);
  const answeredAll = useAppSelector(selectAnsweredEveything);

  const [question, setQuestion] = useState("q1");
  const [questionText, setQuestionText] = useState(questions.q1[0]);


  const previous = Array.from(Array(chapter).keys()).reduce((acc, c)=>{
    return {
      ...acc,
      [c] : allanswers[c],
    }
  },{});

  const nextDimension = {
    d1:"d2",
    d2:"d3",
    d3:"d1",
  }
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
    if (ended){
     
       const nq = nextQuestion[dimension][question];
       setQuestion(nq)
       setQuestionText(questions[nq][0]);
       if (answeredAll){
          dispatch(setDimension(nextDimension[dimension]));
       }
    }
  },[ended])

  useEffect(() => {
    setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
  }, []);

  useEffect(()=>{
    setQuestionText(questions["q1"][0]);
   
  },[chapter]);

  const _setDimension = (dimension)=>{
    dispatch(setDimension(dimension));
  } 

  const _setChapter = (chapter)=>{
    setQuestion("q1");
    _setDimension("d1");
    dispatch(setChapter(chapter));
    setView("player");
  }

  const questionScale = d3.scaleLinear().clamp(true).domain([0,100]).range([0, questions.q1.length-1]);
  
  const _setAnswer = (answer)=>{
    setQuestionText(questions[question][Math.ceil(questionScale(answer))]);
    dispatch(setAnswer({chapter,dimension,question,answer}))
    setEnded(false);
  }

  const threeDcolours = {
    "d1":[0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F,0x69212F], 
    "d2":[0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36,0x7c5a36],
    "d3":[0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647,0x3c6647]
};

const moveToFinal = ()=>{
    dispatch(saveShape())
    setView("final")
}
const renderNavigation = ()=>{
  if (chapter >= 7){
    return <div className={styles.nextChapter} onClick={moveToFinal}>{complete ? "View your final shape" : ""}</div>
  }
  return <div className={styles.nextChapter} onClick={()=>{_setChapter(chapter+1)}}>{complete ? "Go to next chapter" : ""}</div>
}

const renderDimensions = ()=>{
  return <div style={{background: "rgba(255,255,255,0.05)", padding:20, borderRadius:8}}>
    <div className={styles.questiontext}>{questionText}</div>

      <Slider dim={dimension} question={question} answer={answers[dimension][question]} setAnswer={(answer)=>_setAnswer(answer)} end={()=>{
         setEnded(true);
      }}/>
      
      <div style={{display:"flex", flexDirection:"row"}}>
          <div className={styles.feedbackcontainer}>
            <ThreePointFeedback selected={dimension == "d1" ? question: null} answers={answers.d1} previous={previous} clicked={()=>{_setDimension("d1");setQuestion("q1")}}/>
            <div className={styles.feedbacktext} style={{opacity: dimension == "d1" ? 1.0: 0.5}}>Knowledge</div>
          </div>
          <div className={styles.feedbackcontainer}>
            <FourPointFeedback  selected={dimension == "d2" ? question: null} answers={answers.d2}  previous={previous} clicked={()=>{_setDimension("d2");setQuestion("q1")}}/>
            <div className={styles.feedbacktext} style={{opacity: dimension == "d2" ? 1.0: 0.5}}>Choice</div>
          </div>
          <div className={styles.feedbackcontainer}>
            <FivePointFeedback  selected={dimension == "d3" ? question: null} answers={answers.d3} previous={previous}  clicked={()=>{_setDimension("d3");setQuestion("q1")}}/>
            <div className={styles.feedbacktext} style={{opacity: dimension == "d3" ? 1.0: 0.5}}>Risk</div>
          </div>
      </div>
      <div>
        {renderNavigation()}
      </div>
          
  </div>
}

const renderFinal = ()=>{ 
  return   <CompositeShape answers={allanswers} questions={allquestions} onPrint={()=>setView("print")}/> 
}

const renderFeedback = ()=>{
    if (windowSize.width > 0){
      return <Layout points={points} deviceType={deviceType} answers={allanswers} dimension={dimension} colours={threeDcolours} chapter={chapter} setChapter={_setChapter} setDimension={_setDimension} chapterText={chaptertext} onComplete={()=>setView("final")}>
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

  const renderPrint = ()=>{
    return <PrintableShape answers={allanswers} questions={allquestions} id={id}/>
  }

  return <>
      {view === "feedback" && renderFeedback()}
      {view === "final" && renderFinal()}
      {view === "print" && renderPrint()}
      {view ==  "player" && renderPlayer()}
  </>

}