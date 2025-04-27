interface Gasto {
    nome: string,
    valor: string
}

interface Custeio {
    renda: string,
    gastos: Gasto[]
    regiao: string
}

export type {Custeio};