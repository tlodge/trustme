import styles from '../styles/FivePoint.module.css'
import { fullpath, segpath, seppath, shapes } from '../utils/fivepoint';
import React from 'react';
const SVGHEIGHT = 300;
const FivePointFeedback = ({answers, clicked, selected, width=SVGHEIGHT, height=SVGHEIGHT}) => {
    

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
    return  <>
                
                {/*<Image alt="google interpretation" width={100} height={100} src={image || "/"}/>*/}
                <svg ref={fivepoint} onClick={clicked} width={width} height={height}  viewBox="0 0 150 150" className={styles.hexagon}>
                    
                    <g transform="translate(0,2)">
                    <g id="bighexagon">
                        <path id="outerhex" d="M75.482,17.152L138.285,62.869L114.297,136.839L36.668,136.839L12.679,62.869L75.482,17.152Z" className={styles.outerhex} style={{opacity:0.1,fill:"#c8c8c8"}}/>
                        <g><text x="73.922px" y="85.036px" className={styles.zerotext}></text></g>
                        
                        {/*<path d="M75.508,83.474L75.63,17.067" className={styles.scaleline} />
                            <path d="M75.6,83.5L138.2,62.7" className={styles.scaleline}  />
                            <path d="M75.4,83.1L114.4,136.8" className={styles.scaleline} />
                            <path d="M75.3,83.3L36.6,137.0" className={styles.scaleline} />
                            <path d="M75.8,83.3L12.8,63.3" className={styles.scaleline} />*/}
                        
                    </g>            
                
                    {/*<path id="innerhex" d={pathstr(0,"q1")} className={styles.innerhexline} style={{opacity: selected ? selected=="q1" ? 0.5 : 1 : 1}}/>
                    <path id="innerhex" d={pathstr(72,"q2")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q2" ? 0.5 : 1: 1}}/>
                    <path id="innerhex" d={pathstr(144,"q3")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q3" ?0.5 : 1: 1}}/>
                    <path id="innerhex" d={pathstr(216,"q4")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q4" ? 0.5 : 1:1}}/>
                        <path id="innerhex" d={pathstr(288,"q5")} className={styles.innerhexline} style={{ opacity: selected ? selected=="q5" ? 0.5 : 1: 1}}/>*/}

                    {/*<path id="innerhex" ref={mypath} d={segpath(answers)} className={styles.innerhexline} />*/}
                    {paths.map((p,i)=>{
                            return <path key={i} d={p} className={styles.innerhexline} style={{opacity}}></path>
                        })}
                        {_sindex >= 0 && <path d={paths[_sindex||0]} className={styles.innerhexline} style={{opacity: 1.0}}></path>}

                    {/*<g>
                        <rect x={30} y={133} width={130} rx={1} ry={1} height={3} style={{fill:"white"}}></rect>
                        <circle id="dragcircle" cx={85} cy={134.5} r={6} style={{fill:"#282b55", stroke:"white"}}></circle>
                    </g>*/}
                    </g>
                </svg>
            </>
       
}


export default FivePointFeedback;