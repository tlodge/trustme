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
import { select } from 'd3';
import { compose } from '@reduxjs/toolkit';

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
   
    const images = useAppSelector(selectImages);
    const options = useAppSelector(selectStyles);
    const dispatch = useAppDispatch()
    const [data, _setData] = React.useState(filterEmpty(answers));
    const [tt, setTT] = React.useState({question:"",pos:[0,0]});
    const [filters, setFilters] = React.useState({d1:true, d2:true, d3:true});
    const [segment, selectSegment] = React.useState();

    const dataRef = useRef(data);
    

    const dimaverages = (averages)=>{
        const sumquestions = (obj)=>{
            return Object.keys(obj).reduce((acc, key)=>{
                return acc + Number(obj[key]);
            },0)
        }

        const dimtots = Object.keys(averages).reduce((acc,key)=>{
            return {
                d1 : (acc.d1 || 0) + sumquestions(averages[key].d1),
                d2 : (acc.d2 || 0) + sumquestions(averages[key].d2),
                d3 : (acc.d3 || 0) + sumquestions(averages[key].d3)
            }
        },{});

        const chapters = Object.keys(averages).length;

        return {
            d1 : Math.round(dimtots.d1 / chapters),
            d2 : Math.round(dimtots.d2 / chapters),
            d3 : Math.round(dimtots.d3 / chapters),
        }
    }


    const createmessages = (answers, averages)=>{
        const diff = {
            d1 : answers.d1 - averages.d1,
            d2 : answers.d2 - averages.d2,
            d3 : answers.d3 - averages.d3,
        }
        return {
            d1: 
                [
                    diff.d1 >= -1 && diff.d1 <= 1 ? "the same knowledge" : diff.d1 <=1 ? "less knowledge" : "more knowledge",
                    diff.d1 >= -1 && diff.d1 <= 1 ? "as most" : diff.d1 <=1 ? "than most" : "than most",
                ],

            d2: [
                    diff.d2 >= -1 && diff.d2 <= 1 ? "the same choice" : diff.d2 <=1 ? "greater choice" : "less choice",
                    diff.d2 >= -1 && diff.d2 <= 1 ? "as most" : diff.d2 <=1 ? "than most" : "than most",
                ],

            d3: [
                    diff.d3 >= -1 && diff.d3 <= 1 ? "the same risk" : diff.d3 <=1 ? "less risk" : "greater risk",
                    diff.d3 >= -1 && diff.d3 <= 1 ? "as most" : diff.d3 <=1 ? "than most" : "than most",
                ]
        }
    }
    const aggregatemsgs = createmessages(dimaverages(answers), dimaverages(averages))

    

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
    const TRANSDELAY = 10;
    const YDELTA = 30;



    const renderShape = (root, grid)=>{
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
                    return grid ? `rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return grid ? `translate(${x+80+x1},${y-150+d.chapter*150})` : `translate(${x},${y+50}) `
                }
            })
            .transition().duration(50).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (dimindx[d.dim]*TRANSDELAY)
            })
            .attr("transform", (d,i)=>{
                const rotation = rotationfor(d.chapter,d.dim);
                const [x,y] = translatefn(dimindx[d.dim]);
                const [x1,y1] = gridtranslate(dimindx[d.dim],d.chapter);
                if (options.rotate){
                    return grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150})` : `scale(1.0) translate(${x+50},${y+YDELTA}) `
                }
            })
            .style("fill", (d,i)=>{
                if (segment && segment.chapter==d.chapter && segment.question==d.question && segment.dimension==d.dim){
                    return 'white';
                }
                return options.fill ? cli[i] : "none"
            })
            .attr("d", (d,i)=>{
                return fni[dimindx[d.dim]](d.d)[d.question];
            })
            .style("stroke", (d,i)=>{
                return options[`${d.dim}}stroke`] || "none" 
            })
            
            .style("fill-opacity", (d,i)=>{
                if (!grid && segment && segment.chapter==d.chapter && segment.question==d.question && segment.dimension==d.dim){
                    return 1.0;
                }
                return grid ? 1.0 : options.fillopacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("opacity", (d,i)=>{
                return grid || filters[d.dim] ? 1.0 : 0.0
            })
    
        
        const _paths = paths.merge(newpaths)
        
        _paths
            .attr("d", (d,i)=>{   
                return fni[dimindx[d.dim]](d.d)[d.question];
            })
            .on("mouseover", (e,d)=>{
                if (grid){
                    const question = questions[d.chapter][d.dim][`q${[d.question+1]}`][0];
                    const rank = Math.round(d.d[`q${d.question+1}`]);
                    const average = averages[d.chapter][d.dim][`q${[d.question+1]}`];
                    const colour = d.dim === "d1" ? "#e5efc1" : d.dim === "d2" ? "#a2d5ab" : "#39aea9";
                    setTT({colour, question: `${question} <div style="padding:10px 0px 10px 00px"> your score: <strong>${rank}%</strong> average: <strong> ${average}%</strong></div>`, pos:[domX+e.offsetX-50,domY+e.offsetY-50]});
                    setFilters({...{"d1":false, "d2":false, "d3":false},[d.dim]:true})
                    selectSegment({chapter:d.chapter, dimension:d.dim, question:d.question});
                }
            }).on("mouseout", (d,i)=>{
                if (grid){
                    setTT({question: "", pos:[0,0]});
                    setFilters({"d1":true, "d2":true, "d3":true})
                    selectSegment();
                }
            })
            .transition().duration(500).delay(function(d, i) {
                return (d.chapter* 3) * TRANSDELAY + (dimindx[d.dim]*TRANSDELAY)
            })
            .style("fill-opacity", (d,i)=>{
                if (segment && segment.chapter==d.chapter && segment.question==d.question && segment.dimension==d.dim){
                    return 1.0;
                }
                if (!grid && segment && segment.dimension==d.dim){
                    return 0.1;
                }
                return grid ? 1.0 : options.fillopacity;
            })
            .style("stroke-opacity", (d,i)=>{
                return options.strokeopacity;
            })
            .style("stroke", (d,i)=>{
                if (segment && segment.chapter==d.chapter && segment.question==d.question && segment.dimension==d.dim){
                    return 'black';
                }
                return options[`${d.dim}stroke`] || "none" 
            })
            .style("stroke-width", (d,i)=>{
                
                return options.strokewidth;
            })
            .style("opacity", (d,i)=>{
                return grid || filters[d.dim] ? 1.0 : 0.0
            })
            .style("fill", (d,i)=>{
                if (segment && segment.chapter==d.chapter && segment.question==d.question && segment.dimension==d.dim){
                    return 'white';
                }
                return options.fill ? options[`${d.dim}fill`] ||cli[i] : "none"
            }) 
            
            .attr("transform", (d,i)=>{
             
                const rotation = rotationfor(d.chapter,d.dim);
                const [x,y] = translatefn(dimindx[d.dim]);
                const [x1,y1] = gridtranslate(dimindx[d.dim],d.chapter);
                if (options.rotate){
                    return grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150}) rotate(${rotation[0]},${rotation[1]},${rotation[2]})` : `scale(1.0) translate(${x},${y+YDELTA}) rotate(${rotation[0]},${rotation[1]},${rotation[2]}) `
                }else{
                    return grid ? `scale(0.2) translate(${x+80+x1},${y-150+d.chapter*150})` : `scale(1.0) translate(${x},${y+YDELTA}) `
                }
            })

    }

    const combined = useD3((root)=>{
        renderShape(root, false)
    }, [data, options, tt, filters, segment]);
    //Quite neat nested interleaving with d3
    const interleaved = useD3((root)=>{
        renderShape(root, true);   
    }, [data, options, tt, segment])

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
                    <circle cx={7} cy={(c*31)} r={6} style={{stroke:"#fff", strokeWidth:1}}></circle>
                    <image  xlinkHref={`/thumbs/c${c+1}a.png`}  width="12px" height="12px"x={1} y={-6 + (c*31)}  />
                   
                </g>
        })
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
    const SVGWIDTH = 450; const SVGHEIGHT = 600;
    const SVGCOMPOSITEWIDTH = 450; const SVGCOMPOSITEHEIGHT = 450;
    const tx = 20;
    const ty = 15;

    const tooltipstyle = {
        left:tt.pos[0],
        top:tt.pos[1], 
        background: tt.colour,
    }

    const renderScreenView = ()=>{
            return <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                    
                   
                  
                    {<svg  width={SVGCOMPOSITEWIDTH} height={SVGCOMPOSITEHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        <g ref={combined} id="container" transform={`translate(${20},${-30})`}></g>
                     
                    </svg>}
                        <div style={{display:"flex", flexDirection:"row"}}>
                            <div style={{display: "flex", flexDirection:"column", padding:20}}>
                                <div className={styles.summary}>You have</div>
                                <div className={styles.summarycontainer}>
                                    <div className={styles.subknowledge}>{aggregatemsgs.d1[0]}</div>
                                    <div className={styles.subknowledge}>{aggregatemsgs.d1[1]}</div>
                                </div>
                            </div>
                            <div style={{display: "flex", flexDirection:"column", padding:20}}>
                                <div className={styles.summary}>You want</div>
                                <div className={styles.summarycontainer}>
                                <div className={styles.subknowledge}>{aggregatemsgs.d2[0]}</div>
                                <div className={styles.subknowledge}>{aggregatemsgs.d2[1]}</div>
                                </div>
                            </div>
                            <div style={{display: "flex", flexDirection:"column", padding:20}}>
                                <div className={styles.summary}>You see</div> 
                                <div className={styles.summarycontainer}>
                                    <div className={styles.subknowledge}>{aggregatemsgs.d3[0]} </div>
                                    <div className={styles.subknowledge}>{aggregatemsgs.d3[1]}</div>
                                </div>
                            </div>
                        </div>
                  
                    {<svg  width={SVGWIDTH} height={SVGHEIGHT}   viewBox={`0 0 ${150} ${150}`}> 
                        <g ref={interleaved} id="container" transform={`translate(${tx},${ty})`}></g>
                        {renderChapterLabels()}
                    </svg>}
                   
               
                {tt.pos[0] > 0 && tt.pos[1] > 0 && <div className={styles.tooltip}  style={tooltipstyle} dangerouslySetInnerHTML={{__html:tt.question}}></div>}
                <img target="_blank" onClick={()=>onPrint()} alt={"print image"} src={"/print.png"} width={22} height={22}/>         
            </div>
    }
  
    return <div className={styles.container}>
        {renderScreenView()}
    </div>

}

export default CompositeShape;