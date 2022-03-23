// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { append } from "../../lib/api"

export default function handler(req, res) {
  append(["this","is", "me"]);
  res.status(200).json({ name: 'John Doe' })
}
