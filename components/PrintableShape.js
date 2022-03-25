import { segpath as fp3 } from '../utils/threepoint';
import { segpath as fp4 } from '../utils/fourpoint';
import { segpath as fp5 } from '../utils/fivepoint';
import useD3 from '../hooks/useD3';
import React from 'react';
import styles from '../styles/Printable.module.scss'
const colours = {
    "d1":"#e5efc1",
    "d2":"#a2d5ab",
    "d3":"#39aea9"
}

const _options = {
    d1:true,
    d2:true,
    d3:true, 
    grid: false,
    autodraw:false,
    fill:true,
    rotate:false,
    opacity:1,
    fillopacity:1, 
    strokeopacity:1, 
    strokewidth:1,
    d1stroke:"black",
    d2stroke:"black",
    d3stroke:"black",
    d1fill:colours["d1"],
    d2fill:colours["d2"],
    d3fill:colours["d3"],
}

const center = {
    "d1":[109.5,90.5],
    "d2":[63,76.6],
    "d3":[75.5, 83]
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

const rotationfor = (chapter, dimension)=>{
    const am = 90;
    const cp = center[dimension];
    return [am,cp[0],cp[1]];
}   

const PrintableShape = ({questions, answers}) => {
   
    const options = _options;
    const [data, _setData] = React.useState(filterEmpty(answers));
    const [printView, setPrintView] = React.useState(false);

    const dataRef = React.useRef(data);

    React.useEffect(()=>{
        const data = filterEmpty(answers)
        dataRef.current = data;
        _setData(data);    
    },[answers])

    const fni = {d1:fp3,d2:fp4,d3:fp5};
    const cli = {d1:colours["d1"],d2:colours["d2"],d3:colours["d3"]};
    
    React.useEffect(()=>{
        if (printView){
            window.print();
        }
    },[printView]);
   
    const center = {
        "d1":[109.5,90.5],
        "d2":[63,76.6],
        "d3":[75.5, 83]
    }


    const translatefn = (dim)=>{
        const tmatrix = {d1:[-46.5,-14],d2:[0,0],d3:[-12.5,-6.5]}
        return tmatrix[dim]
    }
  
    const TRANSDELAY = 100;
    const YDELTA = 30;

    //Quite neat nested interleaving with d3
    const interleaved = useD3((root)=>{
        
        const mydata = dataRef.current;
        const rows = root.selectAll("g.interleave").data(mydata);
        rows.exit().remove();

        const newrows = rows.enter().append("g").attr("class", "interleave")
        
        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [{d:d.d1,chapter:i, dim:"d1"}, {d:d.d2, chapter:i, dim:"d2"}, {d:d.d3,chapter:i, dim:"d3"}];
        })
        paths.exit().remove();
        
        paths.enter()
            .append("path")
            .attr("class", "d1")
            .attr("opacity",0)
            .style("stroke-width", options.strokewidth)
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return `scale(1.0) translate(${x+50},${y+YDELTA})`})
            .style("fill", (d,i)=>cli[d.dim])
            .attr("d", (d,i)=>fni[d.dim](d.d))
            .style("stroke", (d,i)=>options[`${d.dim}stroke`] || "none")          
            .style("fill-opacity", options.fillopacity)
            .style("stroke-opacity", options.strokeopacity)
            .style("opacity", (d,i)=>options[d.dim] ? 1.0 : 0.0);
    
       
    }, [data, options]);

    const triangle = useD3((root)=>{
        
        const mydata = dataRef.current;
        const rows = root.selectAll("g.interleave").data(mydata);
        rows.exit().remove();

        const newrows = rows.enter().append("g").attr("class", "interleave")
        
        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [{d:d.d1,chapter:i, dim:"d1"}];
        })
        paths.exit().remove();
        
        paths.enter().append("path").attr("class", "d1").attr("opacity",0).style("stroke-width", options.strokewidth)
            .attr("transform", (d,i)=>{const rotation = rotationfor(d.chapter,d.dim); return `rotate(${rotation[0]},${rotation[1]},${rotation[2]})`})
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return  `translate(${x},${y+50})`})
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return `scale(1.0) translate(${x+50},${y+YDELTA})`})
          
            .style("fill", (d,i)=>cli[d.dim])
            .attr("d", (d,i)=>fni[d.dim](d.d))
            .style("stroke", (d,i)=>options[`${d.dim}stroke`] || "none")          
            .style("fill-opacity", options.fillopacity)
            .style("stroke-opacity", options.strokeopacity)
            .style("opacity", (d,i)=>options[d.dim] ? 1.0 : 0.0);
    
    }, [data, options]);

    const square = useD3((root)=>{
        
        const mydata = dataRef.current;
        const rows = root.selectAll("g.interleave").data(mydata);
        rows.exit().remove();

        const newrows = rows.enter().append("g").attr("class", "interleave")
        
        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [ {d:d.d2, chapter:i, dim:"d2"}];
        })
        paths.exit().remove();
        
        paths.enter().append("path").attr("class", "d1").attr("opacity",0).style("stroke-width", options.strokewidth)
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return  `translate(${x},${y+50})`})
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return `scale(1.0) translate(${x+50},${y+YDELTA})`})
            .style("fill", (d,i)=>cli[d.dim])
            .attr("d", (d,i)=>fni[d.dim](d.d))
            .style("stroke", (d,i)=>options[`${d.dim}stroke`] || "none")          
            .style("fill-opacity", options.fillopacity)
            .style("stroke-opacity", options.strokeopacity)
            .style("opacity", (d,i)=>options[d.dim] ? 1.0 : 0.0);
    
       
    }, [data, options]);

    const pentagon = useD3((root)=>{
        
        const mydata = dataRef.current;
        const rows = root.selectAll("g.interleave").data(mydata);
        rows.exit().remove();

        const newrows = rows.enter().append("g").attr("class", "interleave")
        
        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [{d:d.d3,chapter:i, dim:"d3"}];
        })
        paths.exit().remove();
        
        paths.enter().append("path").attr("class", "d1").attr("opacity",0).style("stroke-width", options.strokewidth)
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return  `translate(${x},${y+50})`})
            .attr("transform", (d,i)=>{const [x,y] = translatefn(d.dim);return `scale(1.0) translate(${x+50},${y+YDELTA})`})
            .style("fill", (d,i)=>cli[d.dim])
            .attr("d", (d,i)=>fni[d.dim](d.d))
            .style("stroke", (d,i)=>options[`${d.dim}stroke`] || "none")          
            .style("fill-opacity", options.fillopacity)
            .style("stroke-opacity", options.strokeopacity)
            .style("opacity", (d,i)=>options[d.dim] ? 1.0 : 0.0);
    
    }, [data, options]);

    
    const SVGWIDTH = 300; const SVGHEIGHT = 300
    const tx =  -20 ;
    const ty =  -30 ;

    const renderText = ()=>{
        
        const ox = 84;
        const oy = 80;
        const spacing = 26;
        
        return ["THE", "SHAPE", "OF", "TRUST"].map((t,i)=>{
            return <text key={t} className={styles.logo}  x={i == 2 ? ox+13: ox} y={oy + i*spacing}>{t}</text>
        })
    }
    return  <div onClick={()=>{setPrintView(true)}} style={{marginLeft:180, marginTop:300, display:"flex", flexDirection:"column"}}>
                <div style={{display:"flex", flexDirection:"column", margin:0}}>
                    <svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        
                        
                        <g ref={interleaved} id="container" transform={`translate(${tx},${ty}) rotate(90,109.5,90.5)`}></g>
                        <g transform={`translate(${tx},${ty}) rotate(90,109.5,90.5)`}>
                       {renderText()}
                        </g>
                    </svg>
                    <svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        <g ref={triangle} id="container" transform={`translate(${tx},${ty}) rotate(90,109.5,90.5)`}></g>
                    </svg>
                    <svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        <g ref={square} id="container" transform={`translate(${tx},${ty}) rotate(90,109.5,90.5)`}></g>
                    </svg>
                    <svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        <g ref={pentagon} id="container" transform={`translate(${tx},${ty}) rotate(90,109.5,90.5)`}></g>
                    </svg>
                </div>
            </div>
}

export default PrintableShape;