import {NextApiRequest, NextApiResponse} from 'next'
import { notion } from '../../../../services/notion'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const id = req.query.id as string
        const { currentValue } = req.body
        const response = await notion.pages.update({
            page_id: id,
            archived: false,
            properties: {
                pay: {
                    type: 'checkbox',
                    checkbox: !currentValue,
                    
                }
            }
        })

        res.json(response)
    }
}