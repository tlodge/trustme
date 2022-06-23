import CompositeShape from '../../components/CompositeShape'
import {useState} from 'react';
import PrintableShape from '../../components/PrintableShape';

const QUESTIONS = {
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
                "q3":["I understand <em>how</em> the automatic speed control works"]
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
        2:{
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
        3:{
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
        4:{
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
        5:{
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
    
};

const Shape = ({answers, averages, id}) => {

  const [view, setView] = useState("shape");

  if (view === "shape"){
    return <CompositeShape answers={answers} averages={averages} questions={QUESTIONS} onPrint={()=>setView("print")}></CompositeShape>
  }
  return <PrintableShape answers={answers} id={id}/>
}

export default Shape

export async function getServerSideProps(context) {

    const {sid} = context.query;
    const protocol = context.req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = context.req ? `${protocol}://${context.req.headers.host}` : ''
    const res = await fetch(baseUrl + `/api/shape?sid=${sid}`)
    const data = await res.json()
    const {answers, averages} = data;
    return {
      props: {...answers, averages, id: `${baseUrl}/shape/${sid}`}, // will be passed to the page component as props
    }
  }