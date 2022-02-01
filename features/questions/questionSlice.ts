import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'

export interface QuestionState {
    questions: Object,
    chapter: any,
    dimension:string,
    answers: Object,
}

const initialState: QuestionState = {
    questions: {
        0 : {
            "d1":{
                "q1":["I don't understand what an AV is","I think I understand what an AV is","I reasonably understand what an AV is","I understand what an AV is"],
                "q2":["I don't understand why Ubler use AVs", "I think I understand why Ubler use AVs", "I reasonably understand why Ubler use AVs", "I know why Ubler use AVs"],
                "q3":["I don't know how AVs work", "I think I know how AVs work", "I reasonably know how AVs work", "I know how AVs work"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about using this AV", "I am loosely confident that I have a choice about using this AV", "I am moderately confident that I have a choice about using this AV", "I am confident that I have a choice about using this AV "],
                "q2":["I am not confident that the AV is useful", "I am loosely confident that the AV is useful", "I am moderately confident that the AV is useful", "I am confident that the AV is useful"],
                "q3":["I am not confident that I prefer the AV to a non-autonomous vehicle", "I am loosely confident that I prefer the AV to a non-autonomous vehicle", "I am moderately confident that I prefer the AV to a non-autonomous vehicle", "I am confident that I prefer the AV to a non-autonomous vehicle"],
                "q4":["I am not confident that I would recommend an AV to others", "I am loosely confident that I would recommend an AV to others", "I am moderately confident that I would recommend an AV to others", "I am confident that I would recommend an AV to others"],
            },
            "d3":{
                "q1":["I am not confident I believe the AV will get me to the shops", "I am loosely confident I believe the AV will get me to the shops", "I am moderately confident I believe the AV will get me to the shops", "I am confident I believe the AV will get me to the shops"],
                "q2":["I am not confident that I will be safe in this AV", "I am loosely confident that I will be safe in this AV", "I am moderately confident that I will be safe in this AV", "I am confident that I will be safe in this AV"],
                "q3":["I am not confident others will be safe from the operation of this AV", "I am loosely confident others will be safe from the operation of this AV", "I am moderately confident others will be safe from the operation of this AV", "I am confident others will be safe from the operation of this AV"],
                "q4":["I am not confident this AV will be safer", "I am loosely confident this AV will be safer", "I am moderately confident this AV will be safer", "I am confident this AV will be safer"],
                "q5":["I am not confident if anything goes wrong during the AV experience, I will not be held responsible", "I am loosely confident if anything goes wrong during the AV experience, I will not be held responsible", "I am moderately confident if anything goes wrong during the AV experience, I will not be held responsible", "I am confident if anything goes wrong during the AV experience, I will not be held responsible"]
            }
        },
        1: {
            "d1":{
                "q1":["I don't know what AI speed control is","I think I understand what AI speed control is","I reasonably understand what AI speed control is","I understand what AI speed control is"],
                "q2":["I don't understand why this AV has AI speed control", "I think I understand why this AV has AI speed control", "I reasonably understand why this AV has AI speed control", "I know why this AV has AI speed control"],
                "q3":["I don't understand how AI speed control works", "I think I understand how AI speed control works", "I reasonably understand how AI speed control works", "I understand how AI speed control works"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about using this AI speed control ", "I am loosely confident that I have a choice about using this AI speed control ", "I am moderately confident that I have a choice about using this AI speed control ", "I am confident that I have a choice about using this AI speed control "],
                "q2":["I am not confident that the AI speed control is useful", "I am loosely confident that the AI speed control is useful", "I am moderately confident that the AI speed control is useful", "I am confident that the AI speed control is useful"],
                "q3":["I am not confident that I prefer the AI speed control to a non-autonomous vehicle", "I am loosely confident that I prefer the AI speed control to a non-autonomous vehicle", "I am moderately confident that I prefer the AI speed control to a non-autonomous vehicle", "I am confident that I prefer the AI speed control to a non-autonomous vehicle"],
                "q4":["I am not confident that I would recommend AI speed control to others", "I am loosely confident that I would recommend AI speed control to others", "I am moderately confident that I would recommend AI speed control to others", "I am confident that I would recommend AI speed control to others"],
            },
            "d3":{
                "q1":["I am not confident the AV will go at a safe speed", "I am loosely confident the AV will go at a safe speed", "I am moderately confident the AV will go at a safe speed", "I am confident the AV will go at a safe speed"],
                "q2":["I am not confident I will be safe at when the Av changes speeds", "I am loosely confident I will be safe at when the Av changes speeds", "I am moderately confident I will be safe at when the Av changes speeds", "I am confident I will be safe at when the Av changes speeds"],
                "q3":["I am not confident others will be safe with the speed the AV will go", "I am loosely confident others will be safe with the speed the AV will go", "I am moderately confident others will be safe with the speed the AV will go", "I am confident others will be safe with the speed the AV will go"],
                "q4":["I am not confident this AV will drive at an appropriate speed compared to a human counterpart", "I am loosely confident this AV will drive at an appropriate speed compared to a human counterpart", "I am moderately confident this AV will drive at an appropriate speed compared to a human counterpart", "I am confident this AV will drive at an appropriate speed compared to a human counterpart"],
                "q5":["I am not confident if the AI speed control breaks the speed limit, it won't be my fault", "I am loosely confident if the AI speed control breaks the speed limit, it won't be my fault", "I am moderately confident if the AI speed control breaks the speed limit, it won't be my fault", "I am confident if the AI speed control breaks the speed limit, it won't be my fault"]
            }
        },
        2: {
            "d1":{
                "q1":["I don't know what the AVs navigation system does","I think I understand what the AVs navigation system does","I reasonably understand the AVs navigation system does","I understand what the AVs navigation system does"],
                "q2":["I don't understand why AV uses a navigation system", "I think I understand why AV uses a navigation system", "I reasonably understand why AV uses a navigation system", "I know why AV uses a navigation system"],
                "q3":["I don't understand how AV navigation systems work", "I think I understand how AV navigation systems work", "I reasonably understand how AV navigation systems work", "I understand how AV navigation systems work"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about using this AV navigation", "I am loosely confident that I have a choice about using this AV navigation", "I am moderately confident that I have a choice about using this AV navigation", "I am confident that I have a choice about using this AV navigation"],
                "q2":["I am not confident that the AV navigation is useful", "I am loosely confident that the AV navigation is useful", "I am moderately confident that the AV navigation is useful", "I am confident that the AV navigation is useful"],
                "q3":["I am not confident that I prefer the AV navigation to not having it", "I am loosely confident that I prefer the AV navigation to not having it", "I am moderately confident that I prefer the AV navigation to not having it", "I am confident that I prefer the AV navigation to not having it"],
                "q4":["I am not confident that I would recommend AV navigation to others ", "I am loosely confident that I would recommend AV navigation to others ", "I am moderately confident that I would recommend AV navigation to others ", "I am confident that I would recommend AV navigation to others "],
            },
            "d3":{
                "q1":["I am not confident the AV navigation will function as I expect it", "I am loosely confident the AV navigation will function as I expect it", "I am moderately confident the AV navigation will function as I expect it", "I am confident the AV navigation will function as I expect it"],
                "q2":["I am not confident I won't get lost due to the AV's navigation", "I am loosely confident I won't get lost due to the AV's navigation", "I am moderately confident I won't get lost due to the AV's navigation", "I am confident I won't get lost due to the AV's navigation"],
                "q3":["I am not confident others will be safe with the AV navigation", "I am loosely confident others will be safe with the AV navigation", "I am moderately confident others will be safe with the AV navigation", "I am confident others will be safe with the AV navigation"],
                "q4":["I am not confident this AV will do a better job than a human", "I am loosely confident this AV will do a better job than a human", "I am moderately confident this AV will do a better job than a human", "I am confident this AV will do a better job than a human"],
                "q5":["I am not confident if the AV goes the wrong way I won't be blamed", "I am loosely confident if the AV goes the wrong way I won't be blamed", "I am moderately confident if the AV goes the wrong way I won't be blamed", "I am confident if the AV goes the wrong way I won't be blamed"]
            }
        },
        3:{
            "d1":{
                "q1":["I don't know what an autonomous ecosystem is","I think I know what an autonomous ecosystem is","I reasonably know what an autonomous ecosystem is","I know what an autonomous ecosystem is"],
                "q2":["I don't know why an automomous ecosystem exists", "I think I know why an automomous ecosystem exists", "I reasonably know why an automomous ecosystem exists", "I know why an automomous ecosystem exists"],
                "q3":["I don't understand how automomous ecosystems work", "I think I understand how automomous ecosystems work", "I reasonably understand how automomous ecosystems work", "I understand how automomous ecosystems work"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about whether I use an autonomous ecosystem", "I am loosely confident that I have a choice about whether I use an autonomous ecosystem", "I am moderately confident that I have a choice about whether I use an autonomous ecosystem", "I am confident that I have a choice about whether I use an autonomous ecosystem"],
                "q2":["I am not confident that networks of systems are useful", "I am loosely confident that networks of systems are useful", "I am moderately confident that networks of systems are useful", "I am confident that networks of systems are useful"],
                "q3":["I am not confident that I prefer my AV to be part of an ecosystem", "I am loosely confident that I prefer my AV to be part of an ecosystem", "I am moderately confident that I prefer my AV to be part of an ecosystem ", "I am confident that I prefer my AV to be part of an ecosystem "],
                "q4":["I am not confident that I would recommend others to use network-connected AVs", "I am loosely confident that I would recommend others to use network-connected AVs", "I am moderately confident that I would recommend others to use network-connected AVs", "I am confident that I would recommend others to use network-connected AVs"],
            },
            "d3":{
                "q1":["I am not confident nothing will go wrong in an autonomous ecosystem ", "I am loosely confident nothing will go wrong in an autonomous ecosystem ", "I am moderately confident nothing will go wrong in an autonomous ecosystem ", "I am confident nothing will go wrong in an autonomous ecosystem "],
                "q2":["I am not confident I will be safe as a user of the autonomous ecosystem", "I am loosely confident I will be safe as a user of the autonomous ecosystem", "I am moderately confident I will be safe as a user of the autonomous ecosystem", "I am confident I will be safe as a user of the autonomous ecosystem "],
                "q3":["I am not confident the autonomous eco system will safely respond and avoid impact with other vehicles if another vehicle loses control", "I am loosely confident the autonomous eco system will safely respond and avoid impact with other vehicles if another vehicle loses control", "I am moderately confident the autonomous eco system will safely respond and avoid impact with other vehicles if another vehicle loses control", "I am confident the autonomous eco system will safely respond and avoid impact with other vehicles if another vehicle loses control"],
                "q4":["I am not confident the autonomous ecosystem together has a better chance of avoiding an accident than a group of human drivers", "I am loosely confident the autonomous ecosystem together has a better chance of avoiding an accident than a group of human drivers", "I am moderately confident the autonomous ecosystem together has a better chance of avoiding an accident than a group of human drivers", "I am confident the autonomous ecosystem together has a better chance of avoiding an accident than a group of human drivers"],
                "q5":["I am not confident I won't be responsible if anything goes wrong within an autonomous ecosystem.", "I am loosely confident I won't be responsible if anything goes wrong within an autonomous ecosystem.", "I am moderately confident I won't be responsible if anything goes wrong within an autonomous ecosystem.", "I am confident I won't be responsible if anything goes wrong within an autonomous ecosystem."]
            }
        },
        4:{
            "d1":{
                "q1":["I don't know what a system override is","I think I know what a system override is","I reasonably know what a system override is","I know what a system override is"],
                "q2":["I don't know why a system override exists", "I think I know why a system override exists", "I reasonably know why a system override exists", "I know why a system override exists"],
                "q3":["I don't understand how a system override works", "I think I understand how a system override works", "I reasonably understand how a system override works", "I understand how a system override works"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about whether the AV overrides my decision", "I am loosely confident that I have a choice about whether the AV overrides my decision", "I am moderately confident that I have a choice about whether the AV overrides my decision", "I am confident that I have a choice about whether the AV overrides my decision"],
                "q2":["I am not confident that system override is useful", "I am loosely confident that system override is useful", "I am moderately confident that system override is useful", "I am confident that system override is useful"],
                "q3":["I am not confident that I want system override functionality", "I am loosely confident that I want system override functionality", "I am moderately confident that I want system override functionality", "I am confident that I want system override functionality"],
                "q4":["I am not confident that I would recommend others to use AVs which override their decisions", "I am loosely confident that I would recommend others to use AVs which override their decisions", "I am moderately confident that I would recommend others to use AVs which override their decisions", "I am confident that I would recommend others to use AVs which override their decisions"],
               
            },
            "d3":{
                "q1":["I am not confident the system override will stop things from going wrong", "I am loosely confident the system override will stop things from going wrong", "I am moderately confident the system override will stop things from going wrong", "I am confident the system override will stop things from going wrong"],
                "q2":["I am not confident the AV system override will prevent injury to me", "I am loosely confident the AV system override will prevent injury to me", "I am moderately confident the AV system override will prevent injury to me", "I am confident the AV system override will prevent injury to me"],
                "q3":["I am not confident the AV system override will protect injury to others", "I am loosely confident the AV system override will protect injury to others", "I am moderately confident the AV system override will protect injury to others", "I am confident the AV system override will protect injury to others"],
                "q4":["I am not confident the AV system override will make better decisions than a human", "I am loosely confident the AV system override will make better decisions than a human", "I am moderately confident the AV system override will make better decisions than a human", "I am confident the AV system override will make better decisions than a human"],
                "q5":["I am not confident I will not be held accountable in the event of injury to myself or another due to the fault of system override", "I am loosely confident I will not be held accountable in the event of injury to myself or another due to the fault of system override", "I am moderately confident I will not be held accountable in the event of injury to myself or another due to the fault of system override", "I am confident I will not be held accountable in the event of injury to myself or another due to the fault of system override"]
            }
        },
        5:{
            "d1":{
                "q1":["I don't know what ML is","I think I know what ML is","I reasonably know what ML is","I know what ML is"],
                "q2":["I don't understand why we use ML", "I think I understand why we use ML", "I reasonably understand why we use ML", "I understand why we use ML"],
                "q3":["I don't understand how ML works", "I think I understand how ML works", "I reasonably understand how ML works", "I understand how ML works"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about whether the AV uses ML", "I am loosely confident that I have a choice about whether the AV uses ML", "I am moderately confident that I have a choice about whether the AV uses ML", "I am confident that I have a choice about whether the AV uses ML"],
                "q2":["I am not confident that ML is useful", "I am loosely confident that ML is useful", "I am moderately confident that ML is useful", "I am confident that ML is useful"],
                "q3":["I am not confident that I want ML functionality", "I am loosely confident that I want ML functionality", "I am moderately confident that I want ML functionality", "I am confident that I want ML functionality"],
                "q4":["I am not confident that I would recommend others to use AVs which use ML", "I am loosely confident that I would recommend others to use AVs which use ML", "I am moderately confident that I would recommend others to use AVs which use ML", "I am confident that I would recommend others to use AVs which use ML"],
             
            },
            "d3":{
                "q1":["I am not confident ML will enable the AV to avoid Hazards", "I am loosely confident ML will enable the AV to avoid Hazards", "I am moderately confident ML will enable the AV to avoid Hazards", "I am confident ML will enable the AV to avoid Hazards"],
                "q2":["I am not confident my safety will not be compromised due to the use of ML", "I am loosely confident my safety will not be compromised due to the use of ML", "I am moderately confident my safety will not be compromised due to the use of ML", "I am confident my safety will not be compromised due to the use of ML"],
                "q3":["I am not confident others' safety will not be compromised due to the use of ML", "I am loosely confident others' safety will not be compromised due to the use of ML", "I am moderately confident others' safety will not be compromised due to the use of ML", "I am confident others' safety will not be compromised due to the use of ML"],
                "q4":["I am not confident ML will do a better job than a human in getting me where I need to be", "I am loosely confident ML will do a better job than a human in getting me where I need to be", "I am moderately confident ML will do a better job than a human in getting me where I need to be", "I am confident ML will do a better job than a human in getting me where I need to be"],
                "q5":["I am not confident if there is an accident, it won't be my fault", "I am loosely confident if there is an accident, it won't be my fault", "I am moderately confident if there is an accident, it won't be my fault", "I am confident if there is an accident, it won't be my fault"]
            }
        },
        6:{
            "d1":{
                "q1":["I don't understand what sensors are", "I think I understand what sensors are","I reasonably understand what sensors are","I understand what sensors are"],
                "q2":["I don't understand why we use sensors", "I think I understand why we use sensors", "I reasonably understand why we use sensors", "I understand why we use sensors"],
                "q3":["I don't understand how sensors work", "I think I understand how sensors work", "I reasonably understand how sensors work", "I understand how sensors work"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about whether the AV uses sensors", "I am loosely confident that I have a choice about whether the AV uses sensors", "I am moderately confident that I have a choice about whether the AV uses sensors", "I am confident that I have a choice about whether the AV uses sensors"],
                "q2":["I am not confident that sensors are useful", "I am loosely confident that sensors are useful", "I am moderately confident that sensors are useful", "I am confident that sensors are useful"],
                "q3":["I am not confident that I prefer to have sensors", "I am loosely confident that I prefer to have sensors", "I am moderately confident that I prefer to have sensors", "I am confident that I prefer to have sensors"],
                "q4":["I am not confident that I would recommend others to use AVs which use sensors", "I am loosely confident that I would recommend others to use AVs which use sensors", "I am moderately confident that I would recommend others to use AVs which use sensors", "I am confident that I would recommend others to use AVs which use sensors"],
            },
            "d3":{
                "q1":["I am not confident the sensors will help the AV work in bad weather", "I am loosely confident the sensors will help the AV work in bad weather", "I am moderately confident the sensors will help the AV work in bad weather", "I am confident the sensors will help the AV work in bad weather"],
                "q2":["I am not confident the sensors will make it a safe journey", "I am loosely confident the sensors will make it a safe journey", "I am moderately confident the sensors will make it a safe journey", "I am confident the sensors will make it a safe journey"],
                "q3":["I am not confident sensors will make others safe", "I am loosely confident sensors will make others safe", "I am moderately confident sensors will make others safe", "I am confident sensors will make others safe"],
                "q4":["I am not confident the sensors will work better than a human would in bad weather", "I am loosely confident the sensors will work better than a human would in bad weather", "I am moderately confident the sensors will work better than a human would in bad weather", "I am confident the sensors will work better than a human would in bad weather"],
                "q5":["I am not confident if there is an accident, it won't be my fault", "I am loosely confident if there is an accident, it won't be my fault", "I am moderately confident if there is an accident, it won't be my fault", "I am confident if there is an accident, it won't be my fault"]
            }
        },
        7:{
            "d1":{
                "q1":["I don't know what an AR is", "I think I know what an AR is","I reasonably know what an AR is","I know what an AR is"],
                "q2":["I don't understand why we use AR", "I think I understand why we use AR", "I reasonably understand why we use AR", "I understand why we use AR"],
                "q3":["I don't understand how AR works", "I think I understand how AR works", "I reasonably understand how AR works", "I understand how AR works"],
            },
            "d2":{
                "q1":["I am not confident that I have a choice about using ARs", "I am loosely confident that I have a choice about using ARs", "I am moderately confident that I have a choice about using ARs", "I am confident that I have a choice about using ARs"],
                "q2":["I am not confident that ARs are likely to be useful", "I am loosely confident that ARs are likely to be useful", "I am moderately confident that ARs are likely to be useful", "I am confident that ARs are likely to be useful"],
                "q3":["I am not confident that I prefer to have ARs", "I am loosely confident that I prefer to have ARs", "I am moderately confident that I prefer to have ARs", "I am confident that I prefer to have ARs"],
                "q4":["I am not confident that I would recommend others to use ARs", "I am loosely confident that I would recommend others to use ARs", "I am moderately confident that I would recommend others to use ARs", "I am confident that I would recommend others to use ARs"],
            },
            "d3":{
                "q1":["I am not confident the AR will not malfunction", "I am loosely confident the AR will not malfunction", "I am moderately confident the AR will not malfunction", "I am confident the AR will not malfunction"],
                "q2":["I am not confident a malfunctioning AR will not pose a safety risk to me", "I am loosely confident a malfunctioning AR will not pose a safety risk to me", "I am moderately confident a malfunctioning AR will not pose a safety risk to me", "I am confident a malfunctioning AR will not pose a safety risk to me"],
                "q3":["I am not confident a malfunctioning AR will not pose a safety risk to others", "I am loosely confident a malfunctioning AR will not pose a safety risk to others", "I am moderately confident a malfunctioning AR will not pose a safety risk to others", "I am confident a malfunctioning AR will not pose a safety risk to others"],
                "q4":["I am not confident a malfunctioning AR is still better than a human doing the same job", "I am loosely confident a malfunctioning AR is still better than a human doing the same job   ", "I am moderately confident a malfunctioning AR is still better than a human doing the same job", "I am confident a malfunctioning AR is still better than a human doing the same job"],
                "q5":["I am not confident if an AS malfunctions, it is not my fault", "I am loosely confident if an AS malfunctions, it is not my fault", "I am moderately confident if an AS malfunctions, it is not my fault", "I am confident if an AS malfunctions, it is not my fault"]
            }
        }
    }, 
    answers: {
        0:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        1:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        2:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        3:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        4:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        5:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        6:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
        7:{
            "d1":{
                "q1":50,
                "q2":50,
                "q3":50,
            },
            "d2":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
            },
            "d3":{
                "q1":50,
                "q2":50,
                "q3":50,
                "q4":50,
                "q5":50,
            }
        },
    },
    chapter: 0,
    dimension: "d1",
}

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
    setQuestion: (state, action:PayloadAction<Object>)=>{
        state.questions = action.payload;
    },
    setChapter: (state, action:PayloadAction<Number>)=>{
        state.chapter = action.payload;
    },
    setDimension: (state, action:PayloadAction<string>)=>{
        state.dimension = action.payload;
    },
    setAnswer: (state, action:PayloadAction<Object>)=>{
        state.answers = {
            ...state.answers,
            [action.payload['chapter']]: {
                ...(state.answers[action.payload['chapter']] || {}),
                [action.payload['dimension']] : {
                    ...((state.answers[action.payload['chapter']] || {})[action.payload['dimension']] || {}),
                    [action.payload['question']] : action.payload['answer']
                }
            }
        }
    },

  }
})

export const { setChapter, setDimension, setQuestion, setAnswer } = questionSlice.actions


export const selectQuestions = (state: AppState) => state.questions.questions[state.questions.chapter][state.questions.dimension]
export const selectAnswers = (state: AppState) => state.questions.answers[state.questions.chapter][state.questions.dimension]
export const selectChapter = (state: AppState) => state.questions.chapter
export const selectDimension = (state: AppState) => state.questions.dimension

export default questionSlice.reducer