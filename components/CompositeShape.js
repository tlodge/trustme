import styles from '../styles/Composite.module.scss'
import * as d3 from 'd3';
//need to pull in seppath rather than segpath here and then iterate through each of the paths
//so that then we can mousein/mouseout each path segment.
import { seppath as fp3 } from '../utils/threepoint';
import { seppath as fp4 } from '../utils/fourpoint';
import { seppath as fp5 } from '../utils/fivepoint';
import useD3 from '../hooks/useD3';
import React, { useRef } from 'react';

import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux'

import {
    selectImages,
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

const CompositeShape = ({questions, answers, averages, onPrint}) => {
   
    console.log("nice am here", averages);

    const images = useAppSelector(selectImages);
    const options = useAppSelector(selectStyles);

    const dispatch = useAppDispatch()
    const [data, _setData] = React.useState(filterEmpty(answers));
    const [controls, showControls] = React.useState(false);
    const [tt, setTT] = React.useState({question:"",pos:[0,0]});
   
    const dataRef = useRef(data);
    

    React.useEffect(()=>{
        const data = filterEmpty(answers)
        dataRef.current = data;
        _setData(data);    
    },[answers])  


    const _setOptions = (attr,value)=>{
        dispatch(setOptions(attr,value));
    }

    const fni = [fp3,fp4,fp5];
    const dimindx = {"d1":0, "d2":1, "d3":2}

    const cli =  ["#e5efc1","#a2d5ab","#39aea9"];
    
    const center = {
        "d1":[109.5,90.5],
        "d2":[63,76.6],
        "d3":[75.5, 83]
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
        
        const {x:domX,y:domY} = root.node().getBoundingClientRect();

        const mydata = dataRef.current;

        var div = root.select(".tooltip").append("div").attr("class", "tooltip").style("opacity", 0);

        const rows = root.selectAll("g.interleave").data(mydata);
       
        const newrows = rows.enter().append("g").attr("class", "interleave")
           
        const paths = rows.merge(newrows).selectAll("path.shape").data((d,i)=>{
            return Object.keys(d).reduce((acc, k1)=>{
                const item = d[k1];
                return [...acc, ...Object.keys(item).reduce((acc, k2,j)=>{
                    const q = item[k2];
                    return [...acc, {d:item, question:j, chapter:i, dim:k1}]
                },[])];
            },[]);
        })

        paths.exit().remove();
        
        const newpaths = paths.enter()
            .append("path")
            .attr("class", "shape")
            .attr("opacity",0)
            .style("stroke-width", (d,i)=>{
                return options.strokewidth;
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter, d.dim);
                const [x,y] = translatefn(dimindx[d.dim]);
                const [x1,y1] = gridtranslate(dimindx[d.dim],d.chapter);
                if (options.rotate){
                    return options.grid ? `rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return options.grid ? `translate(${x+80+x1},${y-150+d.chapter*150})` : `translate(${x},${y+50}) `
                }
            })
            .transition().duration(500).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (dimindx[d.dim]*TRANSDELAY)
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,d.dim);
                const [x,y] = translatefn(dimindx[d.dim]);
                const [x1,y1] = gridtranslate(dimindx[d.dim],d.chapter);
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
                return fni[dimindx[d.dim]](d.d)[d.question];
            })
            .style("stroke", (d,i)=>{
                return options[`${d.dim}}stroke`] || "none" 
            })
            
            .style("fill-opacity", (d,i)=>{
                return options.grid ? 1.0 : options.fillopacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("opacity", (d,i)=>{
                return options[d.dim] ? 1.0 : 0.0
            })
    
        
        const _paths = paths.merge(newpaths)
        
        _paths
            .attr("d", (d,i)=>{   
                return fni[dimindx[d.dim]](d.d)[d.question];
            })
            .on("mouseover", (e,d)=>{
                const question = questions[d.chapter][d.dim][`q${[d.question+1]}`][0];
                const rank = Math.round(d.d[`q${d.question+1}`]);
                const average = averages[d.chapter][d.dim][`q${[d.question+1]}`];
                const colour = d.dim === "d1" ? "#e5efc1" : d.dim === "d2" ? "#a2d5ab" : "#39aea9";
                setTT({colour, question: `${question} <div style="padding:10px 0px 10px 00px"> your score: <strong>${rank}</strong> average: <strong> ${average}</strong></div>`, pos:[domX+e.offsetX-50,domY+e.offsetY-50]});
            }).on("mouseout", (d,i)=>{
                setTT({question: "", pos:[0,0]});
            })
            .transition().duration(500).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (dimindx[d.dim]*TRANSDELAY)
            })
            .style("fill-opacity", (d,i)=>{
                return options.grid ? 1.0 : options.fillopacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("stroke", (d,i)=>{
                return options[`${d.dim}stroke`] || "none" 
            })
            .style("stroke-width", (d,i)=>{
                return options.strokewidth;
            })
            .style("opacity", (d,i)=>{
                return options[d.dim] ? 1.0 : 0.0
            })
            .style("fill", (d,i)=>{
                return options.fill ? options[`${d.dim}fill`] ||cli[i] : "none"
            }) 
            
            .attr("transform", (d,i)=>{
             
                const rotation = rotationfor(d.chapter,d.dim);
                const [x,y] = translatefn(dimindx[d.dim]);
                const [x1,y1] = gridtranslate(dimindx[d.dim],d.chapter);
                if (options.rotate){
                    return options.grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return options.grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150})` : `scale(1.0) translate(${x},${y+YDELTA}) `
                }
            })

    }, [data, options, tt])

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

        return <g>{filters}{expand}</g>
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

    const renderChapterLabels = ()=>{
        return [0,1,2,3,4,5].map(c=>{
            return <g key={c}>
                    <circle cx={7} cy={-34 + (c*31)} r={6} style={{stroke:"#fff", strokeWidth:1}}></circle>
                    <image  xlinkHref={`/thumbs/c${c+1}a.png`}  width="12px" height="12px"x={1} y={-40 + (c*31)}  />
                   
                </g>
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
    const SVGWIDTH = 450; const SVGHEIGHT = 800;
    const tx = options.grid ? 10 : 15;
    const ty = options.grid ? -15 :  0;

    const tooltipstyle = {
        left:tt.pos[0],
        top:tt.pos[1], 
        background: tt.colour,
    }

    const renderScreenView = ()=>{
            return <div style={{display:"flex", flexDirection:"column"}}>
                
                <div style={{display:"flex", flexDirection:"row", margin:20}}>
                    {<svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        
                        <g onClick={()=>_toggleOption("grid")} ref={interleaved} id="container" transform={`translate(${tx},${ty})`}>

                            
                        </g>
                        {renderGridAxes()}
                    </svg>}
                </div>
                {options.grid && tt.pos[0] > 0 && tt.pos[1] > 0 && <div className={styles.tooltip}  style={tooltipstyle} dangerouslySetInnerHTML={{__html:tt.question}}></div>}
                <div style={{color:"white", fontSize:20, margin: "0px 0px 30px 190px"}} onClick={()=>_toggleOption("grid")}>
                    {`${options.grid? "view my shape" : "view as grid"}`}
                </div>
                <img target="_blank" onClick={()=>onPrint()} alt={"print image"} src={"/print.png"} width={22} height={22}/>
                {/*<div style={{textAlign:"center", color:"white", padding:7}} onClick={print}>print!</div>*/}
                {/*<div style={{textAlign:"center", color:"white", padding:7}} onClick={save}>save!</div>*/}
                {/*!printView &&  <div className={styles.stylecontainer} style={{textAlign:"center", color:"#171834", padding:7}} onClick={()=>{showControls(!controls)}}>style</div>*/}
                {/*controls && !printView && renderControls()*/}                     
            </div>
    }
  
    return <div className={styles.container}>
        {renderScreenView()}
    </div>

}

export default CompositeShape;