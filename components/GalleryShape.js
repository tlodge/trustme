import { segpath as fp3 } from '../utils/threepoint';
import { segpath as fp4 } from '../utils/fourpoint';
import { segpath as fp5 } from '../utils/fivepoint';
import useD3 from '../hooks/useD3';
import useInterval from '../hooks/useInterval';
import React from 'react';
import styles from '../styles/Gallery.module.scss';


const colours = {
    "d1":"#e5efc1",
    "d2":"#a2d5ab",
    "d3":"#39aea9"
}

const _options = {
    d1:true,
    d2:false,
    d3:false, 
    grid: false,
    autodraw:false,
    fill:true,
    rotate:false,
    opacity:1,
    fillopacity:0.9, 
    strokeopacity:0.5, 
    strokewidth:1,
    d1stroke:"black",
    d2stroke:"black",
    d3stroke:"black",
    d1fill:colours["d1"],
    d2fill:colours["d2"],
    d3fill:colours["d3"],
}

const oneAnswered = (questions)=>{
    return Object.keys(questions).reduce((acc, key)=>{
        return acc || questions[key] !== -1;
    }, false);
}

const atleastOneAnswer = (item)=>{
    return Object.keys(item).reduce((acc, dimension)=>{
        return acc || oneAnswered(item[dimension]);
    },false);
} 

const filterEmpty = (_answers)=>{
    
    return (Object.keys(_answers).reduce((acc, key)=>{
        if (atleastOneAnswer(_answers[key])){
            return [...acc, _answers[key]]
        }
        return acc;
    },[]))
}

const states = [[true, false, false],[false, true, false],[false,false,true],[true,true, true]];//, [true, true, false], [true,false,true],[true,true,true]];

const GalleryShape = ({ts, answers, id}) => {

    const [data, _setData] = React.useState(filterEmpty(answers));
    const [options, setOptions] = React.useState(_options);
    const dataRef = React.useRef(data);
    const [stateIndex, setStateIndex] = React.useState(1);
    React.useEffect(()=>{
        const data = filterEmpty(answers)
        dataRef.current = data;
        _setData(data);    
    },[answers])

   
    useInterval(()=>{
        const state = states[stateIndex];
        setOptions({
            ...options,
            d1: state[0],
            d2: state[1],
            d3: state[2],
        })
        setStateIndex(++stateIndex % states.length);
    }, 5000)

    const fni = [fp3,fp4,fp5];
    const cli = ["#bb2929","#e19c38","#61b359"];
    
    const center = {
        "d1":[109.5,90.5],
        "d2":[63,76.6],
        "d3":[75.5, 83]
    }

    const translatefn = (dim)=>{
        const tmatrix = [[-46.5,-14],[0,0],[-12.5,-6.5]]
        return tmatrix[dim]
    }

    const rotationfor = (chapter, dimension)=>{
        const am = 45 * chapter;
        const cp = center[dimension];
        return [am,cp[0],cp[1]];
    }   
    const TRANSDELAY = 100;
    const YDELTA = 30;

    //Quite neat nested interleaving with d3
    const interleaved = useD3((root)=>{
        
        const mydata = dataRef.current;
        const rows = root.selectAll("g.interleave").data(mydata);
        rows.exit().remove();

        const newrows = rows.enter()
            .append("g")
            .attr("class", "interleave")
           
        //newrows.attr("transform",  `translate(12,${options.grid ? -15: 0})`);

        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [{d:d.d1,chapter:i, dim:"d1"}, {d:d.d2, chapter:i, dim:"d2"}, {d:d.d3,chapter:i, dim:"d2"}];
        })
        paths.exit().remove();
        
        const newpaths = paths.enter()
            .append("path")
            .attr("class", "d1")
           .attr("opacity",0)
           .style("stroke-width", (d,i)=>{
                return options.strokewidth;
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                const [x,y] = translatefn(i);
                if (options.rotate){
                    return `rotate(${rotation[0]},${rotation[1]},${rotation[2]})`
                }else{
                    return `translate(${x},${y+50}) `
                }
            })
            
            .transition().duration(500).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (i*TRANSDELAY)
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                const [x,y] = translatefn(i);
            
                if (options.rotate){
                    return `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return `scale(1.0) translate(${x+50},${y+YDELTA}) `
                }
            })
            .style("fill", (d,i)=>{
                return options.fill ? cli[i] : "none"
            })
            .attr("d", (d,i)=>{
                return fni[i](d.d);
            })
            .style("stroke", (d,i)=>{
                return options[`d${i+1}stroke`] || "none" 
            })
            
            .style("fill-opacity", (d,i)=>{
                return options.grid ? 1.0 : options.fillopacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("opacity", (d,i)=>{
                return options[`d${i+1}`] ? 1.0 : 0.0
            });
    
        
        const _paths = paths.merge(newpaths)
        
    
        _paths
            .attr("d", (d,i)=>{
                return fni[i](d.d);
            })
           
            .transition().duration(500).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (i*TRANSDELAY)
            })
            .style("fill-opacity", (d,i)=>{
                return options.grid ? 1.0 : options.fillopacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("stroke", (d,i)=>{
                return options[`d${i+1}stroke`] || "none" 
            })
            .style("stroke-width", (d,i)=>{
                return options.strokewidth;
            })
            .style("opacity", (d,i)=>{
                return options[`d${i+1}`] ? 1.0 : 0.0
            })
            .style("fill", (d,i)=>{
                return options.fill ? options[`d${i+1}fill`] ||cli[i] : "none"
            }) 
            
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                const [x,y] = translatefn(i);
              
                if (options.rotate){
                    return  `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})`
                }else{
                    return  `scale(1.0) translate(${x},${y+YDELTA})`
                }
            });
            
    
    }, [data, options])

    const pad = (num)=>{
        if (num < 10)
            return `0${num}`
        return `${num}`
    }

    const formatDate = (ts)=>{
        const d = new Date(ts*1);
       // return  d.getDate()  + "-" + (pad(d.getMonth()+1)) + "-" + (d.getFullYear()-2000) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
        return pad(d.getHours()) + ":" + pad(d.getMinutes());

    }
    const SVGWIDTH = 300; const SVGHEIGHT = 300;
    const [tx,ty] = [10,-32];
   
    return <div style={{margin:40}}>
            {<svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                <g ref={interleaved} id="container" transform={`translate(${tx},${ty})`}></g>
            </svg>}
            <div style={{textAlign:"center"}}>
                <a href={`/shape/${id}`} className={styles.label}>{formatDate(ts)}</a>
            </div>
           
        </div>      
}

export default GalleryShape;