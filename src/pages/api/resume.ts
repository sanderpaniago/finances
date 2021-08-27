import {NextApiRequest, NextApiResponse} from 'next'
import { notion } from '../../services/notion'
import { calcTotalValues } from '../api/_lib/calculationValues'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const {currentMouth, currentYear} = req.query
        
        if (currentMouth && currentYear) {

            const daysMouth = new Date(Number(currentYear), Number(currentMouth), 0 ).getDate()

            const initialFilter =  `${currentYear 
                ? currentYear 
                : '01'}-${currentMouth ? currentMouth : '01'}-01`

            const endFilter = `${currentYear}-${currentMouth}-${daysMouth}`

            const response = await notion.databases.query({
                database_id: process.env.NOTION_DATABASE_ID,
                filter: {
                    and: [
                        {
                            property: 'dueDate',
                            date: {
                                on_or_after: initialFilter
                            }
                        },
                        {
                            property: 'dueDate',
                            date: {
                                on_or_before: endFilter
                            }
                        }
                    ]
                },
            })

            const totalValue = calcTotalValues(response)

            return res.json({totalValue, transactions: response.results})
        }

        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID
        })

        const totalValue = calcTotalValues(response)
        return res.json({totalValue, response})
    }
}