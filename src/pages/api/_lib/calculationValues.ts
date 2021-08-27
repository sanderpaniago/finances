export function calcTotalValues(results) {
    return results.results.reduce((acc, item) => {
        if (item.properties.category.select.name === 'Entrada') {
            acc.entradas = acc.entradas + item.properties.price.number
        } else {
            acc.saidas = acc.saidas + item.properties.price.number
        }

        acc.total = acc.entradas + acc.saidas

        return acc
    }, {
            total: 0, 
            entradas: 0,
            saidas: 0
        })
}