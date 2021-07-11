export default class RFunctionCode {
    name!: string
    description!: string
    code!: string
    howToInterpret!: string
    moreDescription?: string
    source!: string
}

export const rPredefinedFunctions: RFunctionCode[] = [
    {
        name: 'Teste de normalidade Shapiro-Wilk',
        description: 'Testa se um determinado conjunto de itens apresenta distribuição normal.',
        code: 'shapiro.test($1)',
        howToInterpret: 'Se o p-value for maior que 0.1 então os dados seguem a distribuição normal.',
        moreDescription: `Pra a maioria das aplicações, você pode aceitar H0 (distribuição é normal) com segurança se p > 0,1 e rejeitar H0 com segurança se p <0,01. Para valores de p neste intervalo [0,01,0,1], pode ser uma boa ideia coletar mais dados.`,
        source: 'https://www.programmingr.com/shapiro-wilk-test-in-r/'
    },
    /* {
        name: 'Alpha de Cronbach',
        howToInterpret: 'Se o p.value for maior que o intervalo [0.01, 0.1] então os dados devem ter distribuição normal.',
        description: 'Testa se um determinado conjunto de itens apresenta distribuição normal.',
        code: 'shapiro_test($1)',
        source: 'https://www.rdocumentation.org/packages/rstatix/versions/0.7.0/topics/shapiro_test'
    } */
]