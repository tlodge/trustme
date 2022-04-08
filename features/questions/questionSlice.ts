import { compose, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as d3 from 'd3';
import { post } from '../../utils/net';
import type { AppState, AppThunk } from '../../app/store'
import { setOptions } from '../shapes/shapeSlice';

export interface QuestionState {
    questions: Object,
    chapter: any,
    dimension:string,
    answers: Object,
    savedId: Number,
}

const _chaptertext = {
    0: "After each chapter we are going to ask your some questions. We will use your answers to build your Shape of Trust. Please use the slider the answer the questions.",
    1: "You're on your way in the self-driving taxi! How do you feel about the taxi's ability to control its speed? Please use the slider to answer the questions below.",
    2: "The taxi starts taking a different route to the one you usually take. How do you feel about the automatic navigation system? Use the sliders to answer the questions below.",
    3: "An old, person-driven motorbike comes past breaking the speed limit. Because self-driving cars are all connected to each other they all slow down to let the biker pass safely—but how do you feel about being part of an extended network ecosystem?",
    4: "In some circumstances self-driving cars may override what you want. In this example the car won't let you outside, even though the traffic isn't moving. How does the car's ability to override you make you feel?",
    5: "The taxi manages to avoid hitting a child because the relevant Machine Learning model recognised the danger. Use the sliders to answer the questions about Machine Learning.",
    6: "Self-driving cars rely on a wide range of different sensing technologies to operate effectively. Please use the sliders to answer questions about the car's sensors.",
    7: "Autonomous systems like the self-driving taxi, are actually all around us. Lifts, check-outs, credit checking systems. It's important we figure out whether to trust them and why. Here is the Shape of Your Trust."
};

const initialState: QuestionState = {
   
    questions: {
        0 : {
            "d1":{
                "q1":["I understand <em>what</em> self-driving vehicles are"],
                "q2":["I am aware <em>why</em> Ublar (the taxi company) use self-driving vehicles"],
                "q3":["I know <em>how</em> self-driving vehicles work"]
            },
            "d2":{
                "q1":["I have the <em>option</em> <u>not</u> to use the self-driving taxi"],
                "q2":["I see the <em>usefulness</em> of self-driving vehicles"],
                "q3":["I <em>prefer</em> self-driving taxis to person-driven taxis"],
                "q4":["I would <em>recommend</em> self-driving taxis to others"]
            },
            "d3":{
                "q1":["This self-driving taxi is more <em>reliable</em> than a person-driven one"],
                "q2":["The self-driving taxi will keep <em><u>me</u> safe</em>"],
                "q3":["The self-driving taxi will keep <em><u>others</u> safe</em>"],
                "q4":["On balance the self-driving taxi is <em>less risky</em> than person-driven taxi"],
                "q5":["If harm is caused because of the self-driving taxi then I will know who to <em>blame</em>"]
            }
        },
        1: {
            "d1":{
                "q1":["I know <em>what</em> the automatic speed control does"],
                "q2":["I am aware <em>why</em> automatic speed control is neccessary"],
                "q3":["I a understand <em>how</em> the automatic speed control works"]
            },
            "d2":{
                "q1":["I have the <em>option</em> to <u>disable</u> automatic speed control in the taxi"],
                "q2":["I think automatic speed control is <em>useful</em> for the taxi"],
                "q3":["I <em>prefer</em> self-driving vehicles that can control their speed automatically"],
                "q4":["I would <em>recommend</em> that other self-driving vehicles have automatic speed control"]
            },
            "d3":{
                "q1":["The automatic speed control is likely to work <em>reliably</em>"],
                "q2":["Automatic speed control will keep <em>me safe</em> during my journey"],
                "q3":["Automatic speed control will <em>be safe</em> for others while I'm travelling"],
                "q4":["The automatic speed control will be <em>less risky</em> than a person controlling the speed"],
                "q5":["If the speed control malfunctions, I know whose <em>fault</em> it will be"]
            }
        },
        2: {
            "d1":{
                "q1":["I am aware that the taxi can navigate on its own"],
                "q2":["I appreciate <em>why</em> being able to navigate is important"],
                "q3":["I understand <em>how</em> the automatic navigation system works"]
            },
            "d2":{
                "q1":["I have the <em>option</em> to override the taxi's automatic navigation"],
                "q2":["The automatic navigation is a <em>useful</em> thing to have in this taxi"],
                "q3":["I <em>prefer</em> automatic navigation to a human taxi driver navigating"],
                "q4":["I would <em>recommend</em> automatic navigation to others"]
            },
            "d3":{
                "q1":["I think the AI navigation will <em>reliably</em> get me to my destination"],
                "q2":["Automatic navigation will <em>not put my safety</em> at risk"],
                "q3":["Automatic navigation does <em>not pose any safety concerns</em> for others"],
                "q4":["Compared to a human driver, automatic navigation is generally better"],
                "q5":["If something goes wrong with navigation, I will know whose responsibility it was"]
            }
        },
        3:{
            "d1":{
                "q1":["I know <em>what</em> it means for multiple cars to be networked with <u>each other</u>, with <u>companies</u>, the <u>highways agency</u>, <u>and beyond</u>!"],
                "q2":["I understand <em>why</em> it is necessary to be part of a network 'ecosystem'"],
                "q3":["I am aware <em>how</em> network ecosystems and data economies work"]
            },
            "d2":{
                "q1":["I have the <em>option</em> to decide <u>not</u> to take part in this network ecosystem"],
                "q2":["I think that network ecosystems are <em>useful</em>"],
                "q3":["It is <em>better</em> to be part of a network ecosystem than not"],
                "q4":["I would <em>recommend</em> others participate in network ecosystems too"]
            },
            "d3":{
                "q1":["I can <em>rely</em> on all aspects of the network ecosystem"],
                "q2":["The network ecosystem will enhance <em>my safety</em>"],
                "q3":["The network ecosystem will help keep <em>others safe</em>"],
                "q4":["Cars which are part of the network ecosystem are better than those that are not"],
                "q5":["If something goes wrong because of the network ecosystem, it is easy to figure out who is liable"]
            }
        },
        4:{
            "d1":{
                "q1":["I know that sometimes self-driving cars will override my instructions"],
                "q2":["I understand <em>why</em> self-driving cars need to override my instructions"],
                "q3":["I am aware <em>how</em> self-driving cars know when they should or should not override my instructions"]
            },
            "d2":{
                "q1":["I have the <em>option</em> turn off the cars' ability to override me"],
                "q2":["It is <em>useful</em> that self-driving cars can override my instructions"],
                "q3":["On balance I <em>prefer</em> that self-driving cars can override instructions"],
                "q4":["I would tell others that overriding instructions is a good thing, for a self-driving car"]

            },
            "d3":{
                "q1":["Overriding my instructions the self-driving car more <em>reliable</em>"],
                "q2":["Overriding my instructions will keep me safe"],
                "q3":["Overriding my instructions will keep others safe"],
                "q4":["Compared to my own decisions, the car's decisions will generally be <em>better</em>"],
                "q5":["If the car makes a bad decision, it will be clear whose <em>responsible</em> for that decision"]
            }
        },
        5:{
            "d1":{
                "q1":["I know <em>what</em> Machine Learning is"],
                "q2":["I appreciate <em>why</em> Machine learning is used in self-driving cars"],
                "q3":["I understand <em>how</em> Machine Learning works"]
            },
            "d2":{
                "q1":["Whilst riding in this taxi I have the <em>option</em> not to use Machine Learning"],
                "q2":["For the purposes of my taxi ride, Machine Learning is <em>useful</em>"],
                "q3":["On balance I <em>prefer</em> that Machine Learning is used in this taxi"],
                "q4":["I would <em>recommend</em> Machine Learning to others riding in self-driving taxis"]

            },
            "d3":{
                "q1":["Machine Learning is a <em>reliable</em>"],
                "q2":["Machine Learning will <em>keep me safe</em>"],
                "q3":["Machine Learning will <em>keep others safe</em>"],
                "q4":["The decisions made based on Machine Learning will be <em>better</em> than decisions made by a human driver"],
                "q5":["If something goes wrong with the Machine Learning, I will know who to hold <em>responsible</em>"]
            }
        },
        6:{
            "d1":{
                "q1":["I know <em>what</em> sensors the taxi uses"],
                "q2":["I am aware <em>why</em> the taxi needs sensors"],
                "q3":["I appreciate <em>how</em> the taxi's sensors work"]
            },
            "d2":{
                "q1":["I could <em>optionally</em> choose that the taxi does not use its sensors"],
                "q2":["The sensors are <em>useful</em> for the taxi's operation"],
                "q3":["On balance I think it is <em>preferable</em> that the taxi uses sensors"],
                "q4":["I would tell others to use self-driving vehicles that are enabled with sensing technology"]
            },
            "d3":{
                "q1":["The sensors are <em>reliable</em> <u>even</u> in bad weather"],
                "q2":["The sensors will <em>keep me safe</em>"],
                "q3":["The sensors will <em>keep others safe</em>"],
                "q4":["The decisions made using the sensor data will be <em>better</em> than those made by a human"],
                "q5":["If anything goes wrong with the sensors, I will know who to <em>blame</em>"]
            }
        },
        7:{
            "d1":{
                "q1":["I understand <em>what</em> autonomous systems are"],
                "q2":["I know <em>why</em> we use autonomous systems"],
                "q3":["I am aware <em>how</em> autonomous systems work"]
            },
            "d2":{
                "q1":["I have a <em>choice</em> about whether or not to use autonomous systems"],
                "q2":["I think that autonomous systems are <em>useful</em>"],
                "q3":["I think that autonomous systems are <em>desirable</em>"],
                "q4":["I would <em>recommend</em> others use autonomous systems"]
            },
            "d3":{
                "q1":["I think autonomous systems are <em>reliable</em>"],
                "q2":["I think autonomous systems are generally <em>safe for me</em> to use"],
                "q3":["I think autonomous systems are generally <em>safe for others</em> to use"],
                "q4":["I think autonomous systems are generally <em>better</em> than humans at their jobs"],
                "q5":["If someting goes wrong with an autonomous system, I know who will be <em>liable</em> for any harm caused"]
            }
        }
    }, 
    answers: {
        0:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        1:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        2:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        3:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        4:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        5:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        6:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
        7:{
            "d1":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
            },
            "d2":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
            },
            "d3":{
                "q1":-1,
                "q2":-1,
                "q3":-1,
                "q4":-1,
                "q5":-1,
            }
        },
    },
    chapter: 0,
    dimension: "d1",
    savedId:0,
}

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
    //setQuestion: (state, action:PayloadAction<Object>)=>{
     //   state.questions = action.payload;
    //},
    saved : (state, action:PayloadAction<Number>)=>{
        state.savedId = action.payload;
    },
    setChapter: (state, action:PayloadAction<Number>)=>{
        state.chapter = action.payload;
    },
    setDimension: (state, action:PayloadAction<string>)=>{
        state.dimension = action.payload;
    },
    _setAnswer: (state, action:PayloadAction<Object>)=>{
        state.answers = {
            ...state.answers,
            [action.payload['chapter']]: {
                ...(state.answers[action.payload['chapter']] || {}),
                [action.payload['dimension']] : {
                    ...((state.answers[action.payload['chapter']] || {})[action.payload['dimension']] || {}),
                    [action.payload['question']] : action.payload['answer'].toFixed(1)
                }
            }
        }
    },

  }
})

export const { setChapter, setDimension, _setAnswer, saved } = questionSlice.actions

const answeredEverything = (answers) : boolean=>{
    return Object.keys(answers).reduce((acc,key,i)=>{
        return acc && answers[key] != -1;
    },true);
}


export const selectChapterText = (state: AppState) => _chaptertext[state.questions.chapter];
export const selectSavedId = (state: AppState) => state.questions.savedId;
export const selectQuestions = (state: AppState) => state.questions.questions[state.questions.chapter][state.questions.dimension]
export const selectAllQuestions = (state: AppState) => state.questions.questions;
export const selectAnswers = (state: AppState) => state.questions.answers[state.questions.chapter]
export const selectAllAnswers = (state: AppState) => state.questions.answers;
export const selectChapter = (state: AppState) => state.questions.chapter
export const selectDimension = (state: AppState) => state.questions.dimension

export const selectComplete = (state: AppState)=> Object.keys(state.questions.answers[state.questions.chapter]).reduce((acc:boolean, key:string)=>{
    return acc && answeredEverything(state.questions.answers[state.questions.chapter][key]);
}, true);


export const selectAnsweredEveything = (state: AppState) => {
    const _state = state.questions; 
    return answeredEverything(_state.answers[_state.chapter][_state.dimension]);
}

const converttopoints = (dimension, question, answer)=>{
    
    const pointfn = {
        "d1":{
            "q1":(answer)=>{
                const q1ToY = d3.scaleLinear().domain([0,100]).range([85.7,16.6]);
                return {x:109.5, y:q1ToY(answer)};
            },
            "q2":(answer)=>{
                const q2ypos = (x) => (18 / 31 * x) + 27;
                const q2ToX = d3.scaleLinear().domain([0,100]).range([113.8,172.5])
                return {x:q2ToX(answer), y:q2ypos(q2ToX(answer))};
            },
            "q3":(answer)=>{
                const q3ypos = (x) => (-13.5 / 23 * x) + 154;
                const q3ToX = d3.scaleLinear().domain([0,100]).range([103.9,45.5])
                return {x:q3ToX(answer), y:q3ypos(q3ToX(answer))};
            }
        },
        "d2":{
            "q1":(answer)=>{
                const q1ToY = d3.scaleLinear().domain([0,100]).range([68.3,20.1]);
                return {x:63.4, y:q1ToY(answer)};
            },
            "q2":(answer)=>{
                const q2ToX = d3.scaleLinear().domain([0,100]).range([71.5,123.6])
                return {x:q2ToX(answer),y:76};
            },
            "q3":(answer)=>{
                const q3ypos = (x, y)=>y;
                const q3ToY = d3.scaleLinear().domain([0,100]).range([85,135])
                return {x:63.4, y:q3ypos(0,q3ToY(answer))};
            },
            "q4":(answer)=>{
                const q4ToX = d3.scaleLinear().domain([0,100]).range([6.3,54.5])
                return {x:q4ToX(answer), y:76};
            }
        },
        "d3":{
            "q1":(answer)=>{
                const q1ToY = d3.scaleLinear().domain([0,100]).range([23.97,73.6]);
                return {x:75.6, y:q1ToY(answer)};
            },
            "q2":(answer)=>{
                const q2ypos = (x)=>(-0.33*x) + 108.6;
                const q2ToX = d3.scaleLinear().domain([0,100]).range([131.67,84.36])
                return {x:q2ToX(answer), y:q2ypos(q2ToX(answer))};
            },
            "q3":(answer)=>{
                const q3ypos = (x)=>(1.38*x) -20.72;
                const q3ToX = d3.scaleLinear().domain([0,100]).range([109.92,80.6])
                return {x:q3ToX(answer), y:q3ypos(q3ToX(answer))};
            },
            "q4":(answer)=>{
                const q4ypos = (x)=>(-1.39*x) + 187.79;
                const q4ToX = d3.scaleLinear().domain([0,100]).range([69.9, 40.7])
                return {x:q4ToX(answer), y:q4ypos(q4ToX(answer))};
            },
            "q5":(answer)=>{
                const q5ypos = (x)=>(0.32*x) + 59.24;
                const q5ToX = d3.scaleLinear().domain([0,100]).range([66.11,19.8])
                return {x:q5ToX(answer), y:q5ypos(q5ToX(answer))};
            }
        }
    }
    return pointfn[dimension] ? pointfn[dimension][question] ? pointfn[dimension][question](answer) : -1 : -1;
}


export const setAnswer = (payload): AppThunk => async (dispatch, getState) => {  
    await dispatch(_setAnswer(payload));
    const _state = getState().questions;

   // const chaptercomplete = Object.keys(_state.answers[_state.chapter]).reduce((acc:boolean, key:string)=>{
   //     return acc && answeredEverything(_state.answers[_state.chapter][key]);
   // }, true);

   // const dimensioncomplete = answeredEverything(_state.answers[_state.chapter][_state.dimension]);

    //if (chaptercomplete){
  //      return;
  //  }

 //  if (dimensioncomplete){
       
        if (_state.dimension === "d1"){
           // await dispatch(setDimension("d2"));
           
        }
        if (_state.dimension === "d2"){
           // await dispatch(setDimension("d3"));
        }
        if (_state.dimension === "d3"){
           // await dispatch(setDimension("d1"));
           
        }
  //  }
}

export const saveShape = (): AppThunk => async (dispatch, getState) => {  
    console.log("SVING SHAPE!!");
    const answers = getState().questions.answers;
    const result = await post("/api/save", answers);
    const {id} = result;
    dispatch(saved(id));
} 
  
export const selectPoints = (state: AppState)=>{
    return Object.keys(state.questions.answers).reduce((acc,k1)=>{
        return {
            ...acc,
            [k1] : Object.keys(state.questions.answers[k1]).reduce((acc, k2)=>{
                return {
                    ...acc,
                    [k2]: Object.keys(state.questions.answers[k1][k2]).reduce((acc, k3)=>{
                        return{
                            ...acc,
                            [k3] : converttopoints(k2,k3,state.questions.answers[k1][k2][k3])
                        }
                    },{})
                }
            },{})
        }
    },{})
}

export default questionSlice.reducer