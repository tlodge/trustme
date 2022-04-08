import styles from '../styles/FivePoint.module.scss'
import { fullpath, segpath, seppath, shapes } from '../utils/fivepoint';
import React from 'react';
const SVGHEIGHT = 300;
const FivePointFeedback = ({answers, previous, clicked, selected, width=SVGHEIGHT, height=SVGHEIGHT,  chaptercomplete=false, labels=false}) => {
   

    const API_ENDPOINT = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';
    const SVG_ENDPOINT = 'https://storage.googleapis.com/artlab-public.appspot.com/stencils/selman/'
//deviceType == "mobile" ? height - (width) : height-270;
    const fivepoint = React.createRef();
    const mypath = React.createRef();
    const canvasRef = React.useRef(null)
    const [image, setImage] = React.useState("");

    const getResults =(data)=>{
        var regex = /SCORESINKS: (.*) Service_Recognize:/
        try{
            return JSON.parse(data[1][0][3].debug_info.match(regex)[1])
        }catch(err){
            console.log(err);
        }
    }

    /*React.useEffect(() => {
        const path = mypath.current;
        const length = path.getTotalLength();
        let n = 1000;
        let step = length/n;
        const x = [], y=[], z=[];
        for(let i= 1; i<=n; i++){
            let point = path.getPointAtLength(i*step);
            x.push(point.x);
            y.push(point.y);
            z.push(i*10);
        }

        const ink = [x,y];
        
        const payload = {
            input_type:0,
            requests:[
                {
                     language:"autodraw",
                     writing_guide:{
                        width:300,
                        height:300,
                     },
                     ink:[ink]
                 }
             ]
         }
        
         post(API_ENDPOINT,payload).then(async (data)=>{

            if (data[0] !== 'SUCCESS') {
              throw new Error(data)
            }
  
            var results = getResults(data);
 
            const bestguess = results.reduce((acc,item)=>{
                const [picture, score] = item;
                const [_,max] = acc;
                if (score < max){
                    return [picture, score];
                }
                return acc;
            },["",10]);
           
            const  escapedName = bestguess[0].replace(/ /g, '-');
            try{
                const svg1 = await get(SVG_ENDPOINT + escapedName + '-01.svg');
                const buff = new Buffer(svg1.value);
                const base64data = buff.toString('base64');
                setImage(`data:image/svg+xml;base64,${base64data}`)
            }catch(err){
                console.log(err);
            }
            
          })
      }, [selected])*/
    
    const _sindex = selected ? selected[1]-1 : -1;
    const paths = seppath(answers);
    const opacity = selected ? 0.3 : 1;

    const renderGhosts = ()=>{
        return Object.keys(previous||{}).map((k,i)=>{
            return <path key={i} d={fullpath(previous[k].d3)} className={styles.ghost} style={{opacity}}></path> 
        });
    }

    const renderLabels = (index)=>{
    

        return <g>
                <text x={112} y={32} className={styles.label}  style={{opacity: index==0 ? 1.0 : 0.4}}  transform="rotate(36,105,30)">reliability</text>
                <text x={130} y={114} className={styles.label}  style={{opacity: index==1 ? 1.0 : 0.4}}transform="rotate(-72,125,105)">my safety</text>
                <text x={75} y={146.2}className={styles.label} style={{opacity: index==2 ? 1.0 : 0.4}} transform="rotate(0,75,146)">{`others' safety`}</text>
                <text x={30} y={102} className={styles.label}  style={{opacity: index==3 ? 1.0 : 0.4}}transform="rotate(-108,25,105)">better</text>
                <text x={40} y={40} className={styles.label}  style={{opacity: index==4 ? 1.0 : 0.4}}transform="rotate(-36,35,40)">liability</text>
            </g>
    }

    return  <>
                
                {/*<Image alt="google interpretation" width={100} height={100} src={image || "/"}/>*/}
                <svg ref={fivepoint} onClick={clicked} width={width} height={height}  viewBox="0 0 150 150" className={styles.hexagon}>
                    
                    <g transform="translate(0,2)">
                    <g id="bighexagon">
                        <path id="outerhex" d="M75.482,17.152L138.285,62.869L114.297,136.839L36.668,136.839L12.679,62.869L75.482,17.152Z" className={styles.outerhex} style={{stroke: selected || chaptercomplete ? "white": "none"}}/>
                        <g><text x="73.922px" y="85.036px" className={styles.zerotext}></text></g>
                    </g>         
                
                    {/*selected &&*/ labels && renderLabels(_sindex)}
                    {renderGhosts()}
                    {paths.map((p,i)=>{
                            return <path key={i} d={p} className={styles.innerhexline} style={{opacity}}></path>
                        })}
                        { _sindex >= 0  && <path d={paths[_sindex||0]} className={styles.innerhexline} style={{opacity: 1.0}}></path>}

                   
                    </g>
                </svg>
            </>
       
}


export default FivePointFeedback;