interface Gasto {
    nome: string,
    valor: string
}

interface Custeio {
    renda: string,
    gastos: Gasto[]
}

export type {Custeio};