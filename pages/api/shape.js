import { getAnswersById } from '../../lib/api';

export default async function handler(req, res) {
    const data = req.query;
    const {sid} = data;
    const {answers={},averages={}} = await getAnswersById();
    res.status(200).json({answers:answers[`${sid}`], averages})
}