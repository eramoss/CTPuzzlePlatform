export default class RFunctionCode {
    name!: string
    description!: string
    code!: string
    howToInterpret?: string
    source!: string
}

export const rPredefinedFunctions: RFunctionCode[] = [
    {
        name: 'Teste de normalidade Shapiro Wilk',
        description: 'Testa se um determinado conjunto de itens apresenta distribuição normal',
        code: 'shapiro.test($1)',
        howToInterpret: 'p.value deve ser menor que 0.1',
        source: 'https://www.rdocumentation.org/packages/rstatix/versions/0.7.0/topics/shapiro_test'
    },
    {
        name: 'Alpha de Cronbach',
        description: 'Testa se um determinado conjunto de itens apresenta distribuição normal',
        code: 'shapiro_test($1)',
        source: 'https://www.rdocumentation.org/packages/rstatix/versions/0.7.0/topics/shapiro_test'
    }
]