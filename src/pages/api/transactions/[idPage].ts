import {NextApiRequest, NextApiResponse} from 'next'
import { notion } from '../../../services/notion'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const idPage = req.query.idPage as string
        const response = await notion.pages.update({
            page_id: idPage,
            archived: true,
            properties: {}
        })

        return res.status(204).json(response)
    }
}