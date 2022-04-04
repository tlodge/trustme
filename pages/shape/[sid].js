import CompositeShape from '../../components/CompositeShape'
import {useState} from 'react';
import PrintableShape from '../../components/PrintableShape';

const QUESTIONS = {
  0 : {
      "d1":{
          "q1":["I understand what an AV is"],
          "q2":["I understand why Ubler use AVs"],
          "q3":["I know how AVs work"]
      },
      "d2":{
          "q1":["I have a choice about using this AV"],
          "q2":["I think the AV is useful to me"],
          "q3":["I would prefer an AV to a non-autonomous vehicle"],
          "q4":["I would recommend an AV to others"]
      },
      "d3":{
          "q1":["The AV will get me to the shops"],
          "q2":["I will be safe in this AV"],
          "q3":["Others will be safe from the operation of this AV"],
          "q4":["I think this AV will be safer than a taxi driven by a human"],
          "q5":["I think if anything goes wrong during the AV experience, I won't be held responsible"]
      }
  },
  1: {
      "d1":{
          "q1":["I understand what AI speed control is"],
          "q2":["I understand why this AV has AI speed control"],
          "q3":["I understand how AI speed control works"]
      },
      "d2":{
          "q1":["I have a choice about using this AI speed control"],
          "q2":["I think the AI speed control is useful"],
          "q3":["I would prefer an AV to use AI speed control"],
          "q4":["I would recommend AI speed control to others"]
      },
      "d3":{
          "q1":["I think AI speed control will travel at a safe speed"],
          "q2":["I think I will be safe at when the AI speed control changes speed"],
          "q3":["I think others will be safe when the AI speed control changes speed"],
          "q4":["I this AI speed control will be safer than a taxi driven by a human"],
          "q5":["I think if anything goes wrong with the AI speed control, I will not be held responsible"]
      }
  },
  2: {
      "d1":{
          "q1":["I understand what the AV navigation is"],
          "q2":["I understand why this AV uses AI navigation"],
          "q3":["I know how AI navigation control works"]
      },
      "d2":{
          "q1":["I have a choice about this AV using AI navigation"],
          "q2":["I think the AI nabigation in an AV is useful"],
          "q3":["I would prefer an AV to use AI navigation"],
          "q4":["I would recommend AI navigation to others"]
      },
      "d3":{
          "q1":["I think the AI navigation will function as I expect"],
          "q2":["I think I won't get lost with the use of AI navigation"],
          "q3":["I think others will be safe due to the AV using AI navigation"],
          "q4":["I think this AI navigation would do a better job than a taxi ride operated by a human"],
          "q5":["I think if anything goes wrong with the AI navigation (i.e. get lost), I will not be held responsible"]
      }
  },
  3:{
      "d1":{
          "q1":["I understand what an autonomous ecosystem is"],
          "q2":["I understand why there is an automomous ecosystem"],
          "q3":["I know how automomous ecosystems work"]
      },
      "d2":{
          "q1":["I have a choice about whether I use an autonomous ecosystem"],
          "q2":["I think that networks of systems are useful"],
          "q3":["I would prefer for AV to be part of a network"],
          "q4":["I would recommend others to use network-connected AVs"]
      },
      "d3":{
          "q1":["I think an autonomous ecosystem will function in a way that will avoid colliding into other vehicles on the road"],
          "q2":["I think I will be safe as a user of an autonomous ecosystem"],
          "q3":["I think the autonomous ecosystem will safely respond and avoid impact with other vehicles, if another vehicle loses control"],
          "q4":["I think that AVs part of an autonomous ecosystem will be safer than a taxi ride operated by a human"],
          "q5":["I think that if anything goes wrong within an autonomous ecosystem, I will not be held responsible"]
      }
  },
  4:{
      "d1":{
          "q1":["I understand what system override is"],
          "q2":["I understand why there would be an option of system override"],
          "q3":["I know how system override works"]
      },
      "d2":{
          "q1":["I have a choice about whether to use system override"],
          "q2":["I think that system override is useful in an AV"],
          "q3":["I would prefer to have the option of system override in my AV"],
          "q4":["I would recommend others to use AVs which has a system override function"],
         
      },
      "d3":{
          "q1":["I think that system override will stop things from going wrong"],
          "q2":["I think that system override could prevent injury to me"],
          "q3":["I think that system override could prevent injury to others"],
          "q4":["I think I would make better decision then an AV and system override is vital"],
          "q5":["I  think if anything goes wrong because system override was not available, I will not be held responsible"]
      }
  },
  5:{
      "d1":{
          "q1":["I am confident about what Machine Learning is"],
          "q2":["I am confident I know why AVs would use Machine Learning"],
          "q3":["I am confident I know how Machine Learning works"],
      },
      "d2":{
          "q1":["I have a choice about whether the AV uses Machine Learning"],
          "q2":["I think that Machine Learning is useful in an AV"],
          "q3":["I would prefer to have Machine Learning used by my AV"],
          "q4":["I would recommend others to use AVs which uses Machine Learning"],
       
      },
      "d3":{
          "q1":["I think that Machine Learning will enable the AV to avoid hazards"],
          "q2":["I think that my safety will not be compromised due to the use of Machine Learning by the AV"],
          "q3":["I think that others safety will not be compromised due to the use of Machine Learning by the AV"],
          "q4":["I think that AVs using Machine Learning will be safer than a taxi ride operated by a human"],
          "q5":["I think that if anything goes wrong because of the AV’s use of Machine Learning, I will not be held responsible"]
      }
  },
  6:{
      "d1":{
          "q1":["I understand what sensors are"],
          "q2":["I understand why AVs would use sensors"],
          "q3":["I know how sensors works"]
      },
      "d2":{
          "q1":["I have a choice about whether the AV uses sensors"],
          "q2":["I think that sensors useful in an AV"],
          "q3":["I  would prefer to have sensors used by my AV"],
          "q4":["I would recommend others to use Avs which uses sensors"],
      },
      "d3":{
          "q1":["I think that sensors will enable the AV to operate effectively in bad weather"],
          "q2":["I think that my safety will not be compromised due to the use of Machine Learning by the AV"],
          "q3":["I  think that others will be safe due to the use of sensors"],
          "q4":["I  think that AVs using sensors will be safer than a taxi ride operated by a human in bad weather"],
          "q5":["I think that if anything goes wrong because of the AV's use of sensors, I will not be held responsible"]
      }
  },
  7:{
      "d1":{
          "q1":["I understand what an AR is"],
          "q2":["I understand why we would use ARs"],
          "q3":["I know how an AR could work"],
      },
      "d2":{
          "q1":["I have a choice about whether or not to use ARs"],
          "q2":["I think that AR are useful"],
          "q3":["I think that ARs are desirable"],
          "q4":["I would recommend others to use ARs"],
      },
      "d3":{
          "q1":["I think that AR will not 'normally' malfunction"],
          "q2":["I think that my safety will not be compromised due to the use of an AR"],
          "q3":["I think that others will be safe due to the use of ARs"],
          "q4":["I think that ARs is better than a human doing the same job"],
          "q5":["I  think that if anything goes wrong because of a malfunctioning AR, I will not be held responsible"]
      }
  }
};

const Shape = ({answers, id}) => {

  const [view, setView] = useState("shape");

  if (view === "shape"){
    return <CompositeShape answers={answers} questions={QUESTIONS} onPrint={()=>setView("print")}></CompositeShape>
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
    return {
      props: {...data, id: `${baseUrl}/shape/${sid}`}, // will be passed to the page component as props
    }
  }