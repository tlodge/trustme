import * as d3 from 'd3';

const CX = 109.5, CY=90.5;

const q1points = (answer,sf=1)=>{
    const q1ToY = d3.scaleLinear().domain([0,100]).range([Math.min(80,16.6*sf),85.7]);
    return [109.5, q1ToY(answer)];
}

const torad = deg => deg * (Math.PI/180);

const rotate = ([x, y], deg)=>{
  
    const theta = torad(deg);
    const s = Math.sin(theta);
    const c = Math.cos(theta);
    const  xn = c * (x - CX) - s * (y-CY) + CX;
    const  yn = s * (x - CX) + c * (y-CY) + CY;
    return [xn,yn];
}

const points = (q, deg, answers, sf=1)=>{  
    if (!answers || answers[q] == -1){
        return [[CX,CY],[CX,CY],[CX,CY]];
    }

    const theta = 30*(Math.PI/180);
    const r = CY-q1points(answers[q],sf)[1];
    const p1 = rotate(q1points(answers[q],sf),deg);
    const p2 = rotate([CX+ (Math.cos(theta)*r), CY+(Math.sin(theta)*r)],deg);
    const p3 = [CX, CY]  
    return [p1,p2,p3];
}


const createpath = (points)=>{
    const [start, ...rest] = points
    const path = rest.reduce((acc,point)=>{
       
        return `${acc}L${point[0]},${point[1]}`
    },"");
    return `M${start[0]},${start[1]}${path}Z`;
}

export const fullpath = (answers, sf=1)=>{
    const [f1,f2,f3] = points("q1",0, answers, sf);
    const [f4,f5,f6] = points("q2",120, answers, sf);
    const [f7,f8,f9] = points("q3",240, answers,sf);
    return createpath([f1,f2,f4,f5,f7,f8]);
}
