export function formatter() {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function formatterDate() {
    return new Intl.DateTimeFormat('pt-BR')
}