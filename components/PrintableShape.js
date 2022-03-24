import { segpath as fp3 } from '../utils/threepoint';
import { segpath as fp4 } from '../utils/fourpoint';
import { segpath as fp5 } from '../utils/fivepoint';
import useD3 from '../hooks/useD3';
import React from 'react';

import { useAppSelector } from '../hooks/useRedux'

import {
    selectStyles,
} from '../features/shapes/shapeSlice'

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

const PrintableShape = ({questions, answers}) => {
   
    const options = useAppSelector(selectStyles);
    const [data, _setData] = React.useState(filterEmpty(answers));

    const dataRef = React.useRef(data);

    React.useEffect(()=>{
        const data = filterEmpty(answers)
        dataRef.current = data;
        _setData(data);    
    },[answers])

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

        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [{d:d.d1,chapter:i, dim:"d1"}, {d:d.d2, chapter:i, dim:"d2"}, {d:d.d3,chapter:i, dim:"d2"}];
        })
        paths.exit().remove();
        
        const newpaths = paths.enter()
            .append("path")
            .on("mouseover", (e,d)=>{
                console.log("mouseover", d);
                console.log("questions", questions[d.chapter][d.dim]);
            }).on("mouseout", (d,i)=>{
                console.log("mouseout", d);
            })
            .attr("class", "d1")
           .attr("opacity",0)
           .style("stroke-width", (d,i)=>{
                return options.strokewidth;
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                const [x,y] = translatefn(i);
                if (options.rotate){
                    return  `rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return  `translate(${x},${y+50}) `
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
                const [x1,y1] = gridtranslate(i,d.chapter);
                if (options.rotate){
                    return `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return `scale(1.0) translate(${x},${y+YDELTA}) `
                }
            });
            
    
    }, [data, options])

    const SVGWIDTH = 450; const SVGHEIGHT = 400
    const tx =  160 ;
    const ty =  -10 ;

    return <div style={{display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", flexDirection:"row", margin:20}}>
            {<svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${350} ${350}`}> 
                <g onClick={()=>_toggleOption("grid")} ref={interleaved} id="container" transform={`translate(${tx},${ty})`}></g>
            </svg>}
        </div>
        </div>
}

export default PrintableShape;