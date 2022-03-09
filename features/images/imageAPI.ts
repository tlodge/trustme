import {post,get} from '../../utils/net';

const API_ENDPOINT = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';
const SVG_ENDPOINT = 'https://storage.googleapis.com/artlab-public.appspot.com/stencils/selman/'

const getResults =(data)=>{
    var regex = /SCORESINKS: (.*) Service_Recognize:/
    try{
        return JSON.parse(data[1][0][3].debug_info.match(regex)[1])
    }catch(err){
        console.log(err);
    }
}

export async function  fetchGuess(path){
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

    return post(API_ENDPOINT,payload).then(async (data)=>{

        if (data[0] !== 'SUCCESS') {
          throw new Error(data)
        }

        var results = getResults(data);

        /*const bestguess = results.reduce((acc,item)=>{
            const [picture, score] = item;
            const [_,max] = acc;
            if (score < max){
                return [picture, score];
            }
            return acc;
        },["",10]);*/
        
        let url;
        for (const svg of results){
            const [picture, score] = svg;
            const escapedName = picture.replace(/ /g, '-').toLowerCase();
            url = SVG_ENDPOINT + escapedName + '-01.svg'
            try{
                const img = await get(url);
                break;
            }catch(err){
                console.log("could not get", url);
            }
        }
        return url;
      })
}