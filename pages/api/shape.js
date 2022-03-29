import { getAnswersById } from '../../lib/api';

export default async function handler(req, res) {
    const data = req.query;
    const {sid} = data;
    const answers = await getAnswersById();
    res.status(200).json(answers[`${sid}`])
}