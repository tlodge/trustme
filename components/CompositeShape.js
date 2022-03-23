import styles from '../styles/Composite.module.css'
import * as d3 from 'd3';
import { segpath as fp3 } from '../utils/threepoint';
import { segpath as fp4 } from '../utils/fourpoint';
import { segpath as fp5 } from '../utils/fivepoint';
import useD3 from '../hooks/useD3';
import React from 'react';

import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'

import {
    saveShape
} from '../features/questions/questionSlice';

import {
    selectImages,
    guessShape,
} from '../features/images/imageSlice'

import {
    selectStyles,
    toggleOption,
    setOptions,
} from '../features/shapes/shapeSlice'



const COLOURS = ["#fff", "#000", "#c8c8c8", "#282b55", "#bb2929","#e19c38","#61b359"];

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

const colours = {
    "d1":"#bb2929",
    "d2":"#e19c38",
    "d3":"#61b359"
}

const CompositeShape = ({questions, answers}) => {
   
    const images = useAppSelector(selectImages);
    const options = useAppSelector(selectStyles);

    const dispatch = useAppDispatch()
    const [data, _setData] = React.useState(filterEmpty(answers));
    const [controls, showControls] = React.useState(false);
    const [printView, setPrintView] = React.useState(false);

    const dataRef = React.useRef(data);
    
    window.onafterprint = function(){
        setPrintView(false);
    }

    React.useEffect(()=>{
        const data = filterEmpty(answers)
        dataRef.current = data;
        _setData(data);    
    },[answers])

    React.useEffect(()=>{
        if (printView){
            window.print();
        }
    },[printView]);
    
    const _setOptions = (attr,value)=>{
        dispatch(setOptions(attr,value));
    }

    const fni = [fp3,fp4,fp5];
    const cli = ["#bb2929","#e19c38","#61b359"];
    
   
    const center = {
        "d1":[109.5,90.5],
        "d2":[63,76.6],
        "d3":[75.5, 83]
    }

    const save = ()=>{
        dispatch(saveShape());
    }

    const translatefn = (dim)=>{
        const tmatrix = [[-46.5,-14],[0,0],[-12.5,-6.5]]
        return tmatrix[dim]
    }

    const gridtranslate = (dim, chapter)=>{
        return [180*dim+0,50*dim];
    }

    const opacityscale = d3.scaleLinear().clamp(true).domain([0,30]).range([0,1]);
    const strokescale = d3.scaleLinear().clamp(true).domain([0,30]).range([0,20]);

    const fillopacity = useD3((root)=>{
        root.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation(); 
            root.attr("cx", Math.min(30,Math.max(0,e.x)));    
        }).on("end", (e)=>{
            _setOptions("fillopacity",opacityscale(e.x));
        }));
    });

    const strokewidth = useD3((root)=>{
        root.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation(); 
            root.attr("cx", Math.min(30,Math.max(0,e.x)));    
        }).on("end", (e)=>{
            _setOptions("strokewidth",strokescale(e.x));
        }));
    });

    const strokeopacity = useD3((root)=>{
        root.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation(); 
            root.attr("cx", Math.min(30,Math.max(0,e.x)));    
        }).on("end", (e)=>{
            _setOptions("strokeopacity",opacityscale(e.x));
        }));
    });

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
                const [x1,y1] = gridtranslate(i,d.chapter);
                if (options.rotate){
                    return options.grid ? `rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return options.grid ? `translate(${x+80+x1},${y-150+d.chapter*150})` : `translate(${x},${y+50}) `
                }
            })
            .transition().duration(500).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (i*TRANSDELAY)
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                const [x,y] = translatefn(i);
                const [x1,y1] = gridtranslate(i,d.chapter);
                if (options.rotate){
                    return options.grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return options.grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150})` : `scale(1.0) translate(${x+50},${y+YDELTA}) `
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
            })
            .each(async (d,i,n)=>{
                const path = n[i];
                
                if (path && path.getTotalLength() > 0){
                    const sum = Object.keys(answers[d.chapter][`d${i+1}`]).reduce((acc,key)=>{
                        return acc+answers[d.chapter][`d${i+1}`][key];
                    },0);
                    if (options.autodraw){
                        dispatch(guessShape(d.chapter, i, `${sum.toFixed(2)}`, path));
                    }
                }
            });
    
        
        const _paths = paths.merge(newpaths)
        
        

        /*
        delay(function(d, i) {
            return (d.chapter* 3) * TRANSDELAY + (i*TRANSDELAY)
        })*/
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
                    return options.grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return options.grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150})` : `scale(1.0) translate(${x},${y+YDELTA}) `
                }
            }).each(async (d,i,n)=>{
                const path = n[i];
                
                if (path && path.getTotalLength() > 0){
                    const sum = Object.keys(answers[d.chapter][`d${i+1}`]).reduce((acc,key)=>{
                        return acc+answers[d.chapter][`d${i+1}`][key];
                    },0);
                    if (options.autodraw){
                        dispatch(guessShape(d.chapter, i, `${sum.toFixed(2)}`, path));
                    }
                }
            });
            
    
    }, [data, options])

    const _toggleOption = (attr)=>{
        dispatch(toggleOption(attr));
    }

    const renderFilters = ()=>{
       const filters =  ["d1", "d2", "d3"].map((dim,index)=>{
            return <g key={dim} transform={`translate(${15*index},0)`}>
                <g>
                    <circle onClick={()=>_toggleOption(dim)} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                    {!options[dim] && <circle onClick={()=>_toggleOption(dim)} cx={10} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
                    <text   onClick={()=>_toggleOption(dim)} x={10} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>{dim}</text>
                </g>
            </g>
        })
        const expand = <g>
            <circle onClick={()=>_toggleOption("grid")} cx={60} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
            {!options["grid"] && <circle onClick={()=>_toggleOption("grid")} cx={60} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
            <text   onClick={()=>_toggleOption("grid")} x={60} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>grid</text>
        </g>

        const autodraw = <g>
            <circle onClick={()=>_toggleOption("autodraw")} cx={80} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
            {!options["autodraw"] && <circle onClick={()=>_toggleOption("autodraw")} cx={80} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
            <text   onClick={()=>_toggleOption("autodraw")} x={80} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>autodraw</text>
        </g>

        return <g>{filters}{expand}{autodraw}</g>
    }
    
    
    const renderStrokeWidth = ()=>{
        return <g transform="translate(20,20)">
            <g>
                <rect x={0} y={8} width={30} height={4} rx={3} ry={3}></rect>
                <circle ref={strokewidth}  cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                <text  x={15} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>stroke width</text>
            </g>
        </g>
    }


    const renderFillOpacity = ()=>{
        return <g transform="translate(55,20)">
            <g>
                <rect x={0} y={8} width={30} height={4} rx={3} ry={3}></rect>
                <circle ref={fillopacity}  cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                <text  x={15} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>fill opacity</text>
            </g>
        </g>
    }

    const renderStrokeOpacity = ()=>{
        return <g transform="translate(90,20)">
            <g>
                <rect x={0} y={8} width={30} height={4} rx={3} ry={3}></rect>
                <circle ref={strokeopacity} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                <text  x={15} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>stroke opacity</text>
            </g>
        </g>
    }


    const renderControls = ()=>{
        return (<svg width={SVGWIDTH} height={SVGWIDTH}   viewBox="0 0 150 150"  className={styles.square}> 
                
                {renderFilters()}
            
                <g transform="translate(0,20)">
                    <g>
                        <circle onClick={()=>_toggleOption("fill")} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                        {!options.fill && <circle onClick={()=>_toggleOption("fill")} cx={10} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
                        <text   onClick={()=>_toggleOption("fill")} x={10} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>fill</text>
                    </g>
                </g>
                {renderStrokeWidth()}
                {renderFillOpacity()}
                {renderStrokeOpacity()}
                <g transform="translate(122,20)">
                    <g>
                        <circle onClick={()=>_toggleOption("rotate")} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                        {!options.rotate && <circle onClick={()=>_toggleOption("rotate")} cx={10} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
                        <text   onClick={()=>_toggleOption("rotate")} x={10} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>rot</text>
                    </g>
                </g>   
                {renderFillColours()}
            </svg>)
    }
    const renderFillColours = ()=>{

    
        const fillrects = (dim)=>{
            return  COLOURS.map((r,i)=>{
                return <rect key={r} onClick={()=>{_setOptions(`d${dim}fill`,r)}} x={20 + (6 * i)} y={1} width={5} height={5} style={{stroke: options[`d${dim}fill`] === r ? "white": "#000", strokeWidth:0.3, fill:r}}/>
            });
        }

        const strokerects = (dim)=>{ 
            return COLOURS.map((r,i)=>{
                return <rect key={r} onClick={()=>{_setOptions(`d${dim}stroke`,r)}} x={96 + (6 * i)} y={1} width={5} height={5} style={{stroke: options[`d${dim}stroke`] === r ? "white": "#000", strokeWidth:0.3, fill:r}}/>
            });
        }

        return [1,2,3].map((dim,i)=>{ 
            return <g key={dim} transform={`translate(4,${50 + (i * 10)})`}>
                    <g>
                    <text  x={10} y={5} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>{`d${dim} fill`}</text>
                    {fillrects(dim)}
                    <text  x={81} y={5} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>{`d${dim} stroke`}</text>
                    {strokerects(dim)}
                </g>
            </g>   
        })
    }

    const print = ()=>{
        setPrintView(true);
    }

    const renderChapterLabels = ()=>{
        return [0,1,2,3,4,5,6,7].map(c=>{
            return <image key={c} xlinkHref="c1thumb.png" width="15px" height="15px" x={0} y={-40 + (c*31)}  />
      
            //return <text key={c} x={10} y={-30 + (c*31)} style={{fontSize:4, fill:"#c8c8c8", textAnchor:"middle"}}>{`c${c+1}`}</text>
        })
    }
    const renderGridAxes = ()=>{
        return  <g className={styles.gridcategories}>
                    {options.grid && renderChapterLabels()}
                    <text onClick={()=>_toggleOption("d1")} x={40} y={205} style={{opacity: options["d1"] ? 1 : 0.2, fontSize:4, fill:"#c8c8c8", textAnchor:"middle"}}>knowledge</text>
                    <text onClick={()=>_toggleOption("d2")} x={77} y={205} style={{opacity: options["d2"] ? 1 : 0.2,fontSize:4, fill:"#c8c8c8", textAnchor:"middle"}}>choice</text>
                    <text onClick={()=>_toggleOption("d3")} x={112} y={205} style={{opacity: options["d3"] ? 1 : 0.2,fontSize:4, fill:"#c8c8c8", textAnchor:"middle"}}>risk</text>
                </g>
    }

   
    const renderRows = ()=>{
        const renderImages = (row)=>{
            return row.map((imgsrc,i)=>{
                return <Image key={i} alt={"svg image"} src={imgsrc} width={50} height={50}/>
            }) 
        }

        return (images||[]).map((row,i)=>{
            return <div key={i} style={{display:"flex", flexDirection:"row", marginBottom:42}}>
                    {renderImages(row)}
                </div>
           
        })
    }
    const SVGWIDTH = 450; const SVGHEIGHT = printView ? 400: 800;
    const tx = options.grid ? 10 : printView ? 160 : 15;
    const ty = options.grid ? -15 : printView ? -10 : 0;

//320 works
    return <div style={{display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", flexDirection:"row", margin:20}}>
            {<svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${printView? 350:150} ${printView? 350:150}`}> 
                <g onClick={()=>_toggleOption("grid")} ref={interleaved} id="container" transform={`translate(${tx},${ty})`}></g>
                {renderGridAxes()}
            </svg>}
            {options.autodraw && <div style={{display:"flex", flexDirection:"column", marginTop:60}}>
                {renderRows()}
            </div>}
        </div>
        <div style={{color:"white", fontSize:20, margin: "0px 0px 30px 190px"}} onClick={()=>_toggleOption("grid")}>
            {`${options.grid? "view my shape" : "view as grid"}`}
        </div>
        {<div style={{textAlign:"center", color:"white", padding:7}} onClick={print}>print!</div>}
        {<div style={{textAlign:"center", color:"white", padding:7}} onClick={save}>save!</div>}

        {!printView &&  <div className={styles.stylecontainer} style={{textAlign:"center", color:"#171834", padding:7}} onClick={()=>{showControls(!controls)}}>style</div>}
        {controls && !printView && renderControls()}
                    
        </div>
}

export default CompositeShape;