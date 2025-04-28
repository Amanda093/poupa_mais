interface Gasto {
    nome: string,
    valor: string
};

interface Custeio {
    renda: string,
    gastos: Gasto[]
    estado: number
    obs: string
};

export type {Custeio};