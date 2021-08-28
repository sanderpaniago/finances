import {NextApiRequest, NextApiResponse} from 'next'
import { notion } from '../../../services/notion'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const idDatabase = req.query.idDatabase as string
    if (req.method === 'GET') {
        const { currentMouth, currentYear} = req.query

        const after = req.query.after as string
        if (currentMouth && currentYear) {
            const daysMouth = new Date(Number(currentYear), Number(currentMouth), 0 ).getDate()

            const initialFilter =  `${currentYear 
                ? currentYear 
                : '01'}-${currentMouth ? currentMouth : '01'}-01`

            const endFilter = `${currentYear}-${currentMouth}-${daysMouth}`
            const response = await notion.databases.query({
                database_id: idDatabase,
                page_size: 6,
                start_cursor: after,
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

            
            return res.status(200).json(response)
        }

        const response = await notion.databases.query({
            database_id: idDatabase,
            page_size: 6,
            start_cursor: after,
        })


        return res.json(response)
    }

    if (req.method === 'POST') {
        const {dueDate, price, title, category} = req.body

        console.log({dueDate, price, title, category})
        const response = await notion.pages.create({
            parent: {
                database_id: idDatabase,
            },
            properties: {
                pay: {
                    type: 'checkbox',
                    checkbox: category === 'Entrada',
                },
                dueDate: {
                    type: 'date',
                    date: {
                        start: dueDate
                    }
                },
                price: {
                    type: 'number',
                    number: category === 'Entrada' ? price : Math.abs(price) * -1
                },
                title: {
                    type: 'title',
                    title: [{
                        type: 'text',
                        text: {
                            content: title
                        }
                    }]
                },
                category: {
                    type: 'select',
                    select: {
                        name: category
                    }
                }

            }
        })

        return res.status(201).json(response)
    }
}