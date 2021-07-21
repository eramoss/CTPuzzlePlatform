import Big from "big.js";
import { evaluate, range } from "mathjs";

export default class ItemCharacteristicCurveFunction {

    P!: Function;
    curveExpression =
        "P(ability, a, b) = 1 / ( 1 + exp(1) ^ (-a * (ability - b)) )";

    constructor() {
        this.compile()
    }

    setExpression(curveExpression: string) {
        this.curveExpression = curveExpression
        this.compile()
    }

    compile() {
        this.P = evaluate(this.curveExpression)
    }

    estimateItemParameters(
        abilityLevels: number[],
        hitProbabilityByAbilityLevel: number[]): { difficulty: number, discrimination: number } {

        let difficulties = range(-3, 3, 0.03)
        let discriminations = range(0.5, 20, 0.2)

        let bestFitDifficulty = 1
        let bestFitDiscrimination = 0
        let minError = Infinity

        for (let i = 0; i < 5; i++) {
            minError = Infinity
            difficulties.forEach(difficulty => {
                let error = this.calculateError(
                    abilityLevels,
                    hitProbabilityByAbilityLevel,
                    bestFitDiscrimination,
                    difficulty)

                if (error < minError) {
                    minError = error
                    bestFitDifficulty = difficulty
                }
            })

            minError = Infinity
            discriminations.forEach(discrimination => {
                let error = this.calculateError(
                    abilityLevels,
                    hitProbabilityByAbilityLevel,
                    discrimination,
                    bestFitDifficulty)

                if (error < minError) {
                    minError = error
                    bestFitDiscrimination = discrimination
                }
            })
        }

        bestFitDiscrimination = Big(bestFitDiscrimination).round(2).toNumber()
        bestFitDifficulty = Big(bestFitDifficulty).round(2).toNumber()

        return { difficulty: bestFitDifficulty, discrimination: bestFitDiscrimination }
    }

    calculateError(
        abilityLevels: number[],
        hitProbabilityByAbilityLevel: number[],
        discrimination: number,
        difficulty: number): number {

        let error = 0
        let shift = 2
        abilityLevels.forEach((ability, index) => {
            let hitProbability = this.P(ability, discrimination, difficulty)
            for (let i = index - shift; i < index + shift; i++) {
                let observedCorrectProportion = hitProbabilityByAbilityLevel[i]
                if (observedCorrectProportion != undefined) {
                    let x1 = abilityLevels[i]
                    let x2 = ability
                    let y1 = observedCorrectProportion
                    let y2 = hitProbability
                    let b2 = Math.pow(Math.abs(x2 - x1), 2)
                    let c2 = Math.pow(Math.abs(y2 - y1), 2)
                    error += Math.sqrt(b2 + c2)
                }
            }
        })
        return error
    }

}