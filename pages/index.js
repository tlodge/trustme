
import {useState} from 'react';
import Layout  from '../components/Layout';

import ThreePointFeedback from '../components/ThreePointFeedback';

export default function Home() {

  const q2ypos = (x) => (18 / 31 * x) + 27;
  const q3ypos = (x) => (-13.5 / 23 * x) + 154;
  
  const [dimension, setDimension] = useState("d1");
  const [chapter, setChapter] = useState(0);

  const [points, setPoints] = useState({
    0:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d2:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d3:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d4:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d5:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
    },
    1:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d2:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d3:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d4:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d5:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
    },
    2:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d2:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d3:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d4:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d5:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
    },
    3:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d2:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d3:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d4:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d5:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
    },
    4:{
      d1:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d2:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d3:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d4:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
      d5:{q1:{x:109.5,y:52.5}, q2:{x:140.5, y:q2ypos(140.5)},q3:{x:83, y:q3ypos(83)}},
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

  const colours = {"d1":["#E16E6E","#ba2727"], "d2":["#FFF1D4","#EEDBB6"], "d3":["#C8DED2","#E4E9DB"], "d4":["#5882B3","#85ADDB"], "d5":["#9158B3","#AE78D0"]};

  return (
    <Layout points={points[chapter]} dimension={dimension} colours={colours} chapter={chapter} setChapter={setChapter} setDimension={setDimension}>
        <ThreePointFeedback points={points[chapter][dimension]} colour={colours[dimension]} setPoints={_setPoints}/>
    </Layout>
  )
}