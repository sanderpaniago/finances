import { NextApiRequest, NextApiResponse } from "next";
import { notion } from "../../services/notion";

function initialFilter(year, month) {
    let filterYear;
    let filterMonth;

    switch (month) {
        case 1:
            filterMonth = 10;
            filterYear = year - 1;
            break;
        case 2:
            filterMonth = 11;
            filterYear = year - 1;
            break;
        case 3:
            filterMonth = 12;
            filterYear = year - 1;
        default:
            filterMonth = month - 3;
            filterYear = year;
            break;
    }

    return {
        filterMonth,
        filterYear,
    };
}

function finalyFilter(year, month) {
    let filterYear;
    let filterMonth;

    switch (month) {
        case 12:
            filterMonth = 1;
            filterYear = year + 1;
            break;
        default:
            filterMonth = month + 1;
            filterYear = year;
            break;
    }

    return {
        filterMonth,
        filterYear,
    };
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const daysMouth = (year, month) =>
            new Date(Number(year), Number(month), 0).getDate();

        const startFilter = initialFilter(currentYear, currentMonth);
        const endFilter = finalyFilter(currentYear, currentMonth);


        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                and: [
                    {
                        property: "dueDate",
                        date: {
                            on_or_after: `${startFilter.filterYear}-${startFilter.filterMonth.toString().length === 1
                                    ? `0${startFilter.filterMonth}`
                                    : startFilter.filterMonth
                                }-01`,
                        },
                    },
                    {
                        property: "dueDate",
                        date: {
                            on_or_before: `${endFilter.filterYear}-${endFilter.filterMonth.toString().length === 1
                                    ? `0${endFilter.filterMonth}`
                                    : endFilter.filterMonth
                                }-${daysMouth(endFilter.filterYear, endFilter.filterMonth)}`,
                        },
                    },
                ],
            },
        });

        const results = response.results.reduce((acc, item) => {
            const monthItem =
                new Date(item.properties.dueDate.date.start).getMonth()
            const yearItem = new Date(item.properties.dueDate.date.start).getFullYear()
            const objKey = `${yearItem}-${monthItem}-1T00:00:00.000Z`
            const valueOfMonth = item.properties.price.number;

            const category = item.properties.category.select.name
            
            if(!acc[objKey]) {
                acc[objKey] = {
                    entradas: 0,
                    saidas: 0
                };
            }

            if (category === 'Saida') {
                acc[objKey].saidas = acc[objKey].saidas + valueOfMonth;
            } else {
                acc[objKey].entradas = acc[objKey].entradas + valueOfMonth
            }


            return acc;
        }, {});

        return res.json(results);
    }
}
