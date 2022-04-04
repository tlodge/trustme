// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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

const flattened = (data,id)=>{
    return Object.keys(data).reduce((acc, key)=>{
        return [...acc, rows(data[key])]
    },[id,Date().toString(),Date.now()])
}

export default async function handler(req, res) {
    console.log("seen a request to save");
  const id = Math.round(Math.random()  * 80000)
  const data = req.body;
  const items = flattened(data,id);
  console.log("appending items", JSON.stringify(items));
  await append(items);
  console.log("returning", `${process.env.VERCEL_URL}/shape/${id}`);
  res.status(200).json({ id:  `${process.env.VERCEL_URL}/shape/${id}`})
}
