import styles from '../styles/FourPoint.module.css'
import * as d3 from 'd3';
import { fullpath as fp3 } from '../utils/threepoint';
import { fullpath as fp4 } from '../utils/fourpoint';
import { fullpath as fp5 } from '../utils/fivepoint';
import useD3 from '../hooks/useD3';
import React from 'react';


const COLOURS = ["#fff", "#000", "#c8c8c8", "#282b55", "#bb2929","#e19c38","#61b359"];

const allAnswered = (questions)=>{
    return Object.keys(questions).reduce((acc, key)=>{
        return acc || questions[key] != -1;
    }, false);
}

const noEmptyAnswers = (item)=>{
    return Object.keys(item).reduce((acc, dimension)=>{
        return acc && true;//allAnswered(item[dimension]);
    },true);
} 

const filterEmpty = (_answers)=>{
    
    return (Object.keys(_answers).reduce((acc, key)=>{
        if (noEmptyAnswers(_answers[key])){
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
const fn = {
    "d1": fp3,
    "d2": fp4,
    "d3": fp5
}

const INITIALSTATE = {
    d1:true,
    d2:true,
    d3:true, 
    fill:true,
    opacity:1,
    fillopacity:0.5, 
    strokeopacity:0.5, 
    strokewidth:1,
    d1stroke:colours["d1"],
    d2stroke:colours["d2"],
    d3stroke:colours["d3"],
    d1fill:colours["d1"],
    d2fill:colours["d2"],
    d3fill:colours["d3"],
}

const CompositeShape = ({answers, clicked=()=>{}, selected}) => {
   
    const [data, _setData] = React.useState(filterEmpty(answers));
    const [options, _setOptions] = React.useState(INITIALSTATE);

    const dataRef = React.useRef(data);
    const optionsRef = React.useRef(options);

    React.useEffect(()=>{
        const data = filterEmpty(answers)
        dataRef.current = data;
        _setData(data);    
    },[answers])

    const setOptions = (value)=>{
        optionsRef.current = value;
        _setOptions(value);
    }

    

    const fni = [fp3,fp4,fp5];
    const cli = ["#bb2929","#e19c38","#61b359"];

    const linestyle = (dim) => {
        return {
            fill:colours[dim], 
            fillOpacity:0.4,
            strokeOpacity:0.8,
            strokeWidth:0,
            stroke:"#2b2b55",//"white",//colours[dim]
        }
    }
    
    const SVGHEIGHT = 450;
    
    const center = {
        "d1":[109.5,90.5],
        "d2":[63,76.6],
        "d3":[75.5, 83]
    }

    const renderChaptersFor = (dim)=>{
        const p = center[dim];
        return [0,1,2,3,4,5,6,7].map((chapter,i)=>{
           return <g key={chapter} transform={`rotate(${45*i},${[p[0]]},${p[1]})`}>  
            <path d={fn[dim](answers[chapter][dim])} style={linestyle(dim)} />
          </g>
        })
        
    }

    const renderChapterFor = (chapter, dim)=>{
        const p = center[dim];
        
        return <g key={chapter} transform={`rotate(${45*chapter},${[p[0]]},${p[1]})`}>  
            <path d={fn[dim](answers[chapter][dim])} style={linestyle(dim)} />
        </g>
         
    }

    const translatefn = (dim)=>{
        const tmatrix = [[-46.5,-14],[0,0],[-12.5,-6.5]]
        return tmatrix[dim]
    }

    const opacityscale = d3.scaleLinear().clamp(true).domain([0,30]).range([0,1]);
    const strokescale = d3.scaleLinear().clamp(true).domain([0,30]).range([0,20]);

    const fillopacity = useD3((root)=>{
        root.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation(); 
            root.attr("cx", Math.min(30,Math.max(0,e.x)));    
        }).on("end", (e)=>{
            setOptions({...optionsRef.current, opacity:opacityscale(e.x)});
        }));
    });

    const strokewidth = useD3((root)=>{
        root.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation(); 
            root.attr("cx", Math.min(30,Math.max(0,e.x)));    
        }).on("end", (e)=>{
            setOptions({...optionsRef.current, strokewidth:strokescale(e.x)});
        }));
    });

    const strokeopacity = useD3((root)=>{
        root.call(d3.drag().on("drag", (e)=>{
            e.sourceEvent.stopPropagation(); 
            root.attr("cx", Math.min(30,Math.max(0,e.x)));    
        }).on("end", (e)=>{
            setOptions({...optionsRef.current, strokeopacity:opacityscale(e.x)});
        }));
    });

    const anglemultiplier = {
        "d1":120,
        "d2":90,
        "d3":22,
    }

    const rotationfor = (chapter, dimension)=>{
        const am = 45 * chapter;
        const cp = center[dimension];
        return [am,cp[0],cp[1]];
    }

    //Quite neat nested interleaving with d3
    const interleaved = useD3((root)=>{
        
        const mydata = dataRef.current;
        const rows = root.selectAll("g.interleave").data(mydata);
    
        rows.exit().remove();

        const newrows = rows.enter()
            .append("g")
            .attr("class", "interleave")
           
        const paths = rows.merge(newrows).selectAll("path.d1").data((d,i)=>{
            return [{d:d.d1,chapter:i}, {d:d.d2, chapter:i}, {d:d.d3,chapter:i}];
        })
        paths.exit().remove();
        
        const newpaths = paths.enter()
            .append("path")
            .attr("class", "d1")
            .attr("transform", (d,i,j)=>{
                const [x,y] = translatefn(i);
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                return  `translate(${x},${y}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})`
            })
            .attr("d", (d,i)=>{
                return fni[i](d.d);
            })
            .style("stroke", (d,i)=>colours[`d${i+1}`])
            .style("fill-opacity", (d,i)=>{
                return options.opacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("stroke-width", (d,i)=>{
                return options.strokewidth;
            })
            .style("opacity", (d,i)=>{
                return options[`d${i+1}`] ? 1.0 : 0.0
            })
            .style("fill", (d,i)=>{
                return options.fill ? cli[i] : "none"
            }) 
            .style("stroke", (d,i)=>{
                return options[`d${i+1}stroke`] || "none" 
            }) 

        const _paths = paths.merge(newpaths)
        
        _paths.transition().duration(1000)
            .attr("d", (d,i)=>{
                return fni[i](d.d);
            })
            .style("fill-opacity", (d,i)=>{
                return options.opacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
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
            .style("stroke", (d,i)=>{
                return options[`d${i+1}stroke`] || "none" 
            }) 

        _paths.attr("transform", (d,i)=>{
                const [x,y] = translatefn(i);
                const rotation = rotationfor(d.chapter,`d${i+1}`);
                if (options.rotate){
                    return  `translate(${x},${y}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})`
                }
                else{
                    return  `translate(${x},${y})`
                }  
        })
    }, [data, options])

    const threepoint = useD3((root)=>{
        const d1s = dataRef.current.map(d=>d.d1);
       
        const paths = root.selectAll("path.d1").data(d1s, (d,i)=>i) 
        //d ? `${d.q1}${d.q2}${d.q3}`:"");
      
        //enter
        paths.enter()
             .append("path")
             .attr("class", "d1")
             .attr("d", (d,i)=>{
                 return fp3(d)
             })
             .style("stroke", colours.d1)
             .style("fill", "none");

        //update
        paths.transition().duration(1000).attr("d", (d,i)=>{
            return fp3(d);
        });

        //remove
        paths.exit().remove();

    },[data]);

    const fourpoint = useD3((root)=>{
      
        const d2s = data.map(d=>d.d2);
        const paths = root.selectAll("path.d2").data(d2s, (d,i)=>i) 
        
        //enter
        paths.enter()
             .append("path")
             .attr("class", "d2")
             .attr("d", (d,i)=>{
                 return fp4(d)
             })
             .style("stroke", colours.d2)
             .style("fill", "none");

        //update
        paths.transition().duration(1000).attr("d", (d,i)=>{
            return fp4(d);
        });

        //remove
        paths.exit().remove();

    },[data]);


    const fivepoint = useD3((root)=>{
      
        const d3s = data.map(d=>d.d3);
        const paths = root.selectAll("path.d3").data(d3s, (d,i)=>i) 
        
        //enter
        paths.enter()
             .append("path")
             .attr("class", "d3")
             .attr("d", (d,i)=>{
                 return fp5(d)
             })
             .style("stroke", colours.d3)
             .style("fill", "none");

        //update
        paths.transition().duration(1000).attr("d", (d,i)=>{
            return fp5(d);
        });

        //remove
        paths.exit().remove();

    },[data]);

    const renderInterLeavedChapters =()=>{
        return [0,1,2,3,4,5,6,7].map((chapter,i)=>{
            return <g key={i}>
                    <g id="threepoint" transform="translate(-12,-10)">
                        {renderChapterFor(chapter,"d3")}
                    </g>
                        
                    <g id="fourpoint" transform="translate(-46.3,-17.5)">  
                        {renderChapterFor(chapter,"d1")}
                    </g>

                    <g id="fivepoint" transform="translate(-20,-3.4)">
                        {renderChapterFor(chapter,"d2")}
                    </g>
             </g>
        });
    }

    const toggleOption = (attr)=>{
        const style = {
            [attr] : options[attr] ? false : true
        }
        setOptions({...options, ...style});
    }

    const _clicked = ()=>{
        setOptions(++options);
        clicked();
    }

    const renderFilters = ()=>{
        return ["d1", "d2", "d3"].map((dim,index)=>{
            return <g key={dim} transform={`translate(${15*index},0)`}>
                <g>
                    <circle onClick={()=>toggleOption(dim)} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                    {!options[dim] && <circle onClick={()=>toggleOption(dim)} cx={10} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
                    <text   onClick={()=>toggleOption(dim)} x={10} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>{dim}</text>
                </g>
            </g>
        })
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


    const renderFillColours = ()=>{

    
        const fillrects = (dim)=>{
            return  COLOURS.map((r,i)=>{
                return <rect key={r} onClick={()=>{setOptions({...options, [`d${dim}fill`]:r})}} x={20 + (6 * i)} y={1} width={5} height={5} style={{stroke: options[`d${dim}fill`] === r ? "white": "#000", strokeWidth:0.3, fill:r}}/>
            });
        }

        const strokerects = (dim)=>{ 
            return COLOURS.map((r,i)=>{
                return <rect key={r} onClick={()=>{setOptions({...options, [`d${dim}stroke`]:r})}} x={96 + (6 * i)} y={1} width={5} height={5} style={{stroke: options[`d${dim}stroke`] === r ? "white": "#000", strokeWidth:0.3, fill:r}}/>
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

    //TODO - to interleave could do a g ref={c13point, c23point etc.}
    return <div style={{display:"flex", flexDirection:"column"}}>
            <svg  width={SVGHEIGHT} height={SVGHEIGHT}   viewBox="0 0 150 150"  className={styles.square}> 
                {/*<rect x={0} y={0} width={SVGHEIGHT-10} height={SVGHEIGHT-10}/>*/}
                <g ref={interleaved} id="container" transform="translate(10,-10)"></g>
                
                    
                    
                    {/*<g ref={threepoint} id="threepoint" transform="translate(-45,-10)"></g>
                    <g ref={fourpoint} id="fourpoint" transform="translate(0,-10)"></g>
                    <g ref={fivepoint} id="fivepoint" transform="translate(-12,-10)"></g>*/}
                    {/*renderInterLeavedChapters()*/}
                
            </svg>
            <svg width={SVGHEIGHT} height={SVGHEIGHT}   viewBox="0 0 150 150"  className={styles.square}> 
                
            {renderFilters()}
            
                <g transform="translate(0,20)">
                    <g>
                        <circle onClick={()=>toggleOption("fill")} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                        {!options.fill && <circle onClick={()=>toggleOption("fill")} cx={10} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
                        <text   onClick={()=>toggleOption("fill")} x={10} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>fill</text>
                    </g>
                </g>
                {renderStrokeWidth()}
                {renderFillOpacity()}
                {renderStrokeOpacity()}
                <g transform="translate(122,20)">
                    <g>
                        <circle onClick={()=>toggleOption("rotate")} cx={10} cy={10} r={4} style={{fill:"#c8c8c8"}}></circle>
                        {!options.rotate && <circle onClick={()=>toggleOption("rotate")} cx={10} cy={10} r={2.5}  style={{fill:"#282b55"}}></circle>}
                        <text   onClick={()=>toggleOption("rotate")} x={10} y={22} style={{fill:"#c8c8c8", fontSize:"0.3em", textAnchor:"middle"}}>rot</text>
                    </g>
                </g>   
                {renderFillColours()}
            </svg>
            </div>
}

export default CompositeShape;