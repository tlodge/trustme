// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { csvParseRows } from "d3";
import { append } from "../../lib/api"

const items = (data)=>{
    return Object.keys(data).map(k=>{
        return data[k];
    })
}
const rows = (data)=>{
    const _rows = Object.keys(data).reduce((acc, key)=>{
        return [...acc, JSON.stringify(data[key])]
    },[])
    return `[${_rows.toString()}]`;
}

const flattened = (data)=>{
    return Object.keys(data).reduce((acc, key)=>{
        return [...acc, rows(data[key])]
    },[Date().toString(),Date.now()])
}
export default function handler(req, res) {
  const data = req.body;
  console.log('nice have data', data);
  const items = flattened(data);
  append(items);
  res.status(200).json({ success:true })
}