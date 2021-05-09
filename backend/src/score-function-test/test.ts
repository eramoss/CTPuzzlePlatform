let resultados = []
{
    class Abacate {
        name: string = ''
    }
    let teste = new Abacate()
    teste.name = 'abacate 1'
    resultados.push(teste)
}

{
    class Abacate {
        name:string = ''
    }
    let teste = new Abacate()
    teste.name = 'abacate 2'
    resultados.push(teste)
}
console.log(resultados)