import Big from "big.js";
import { evaluate, range } from "mathjs";

export default class ItemCharacteristicCurveFunction {

    itemCharacteristicCurve!: Function;
    curveExpression =
        "P(ability, a, b) = 1 / ( 1 + exp(1) ^ (-a * (ability - b)) )";

    constructor() {
        this.compile()
    }

    execute(ability: number, discrimination: number, difficulty: number): number {
        return this.itemCharacteristicCurve(ability, discrimination, difficulty)
    }

    setExpression(curveExpression: string) {
        this.curveExpression = curveExpression
        this.compile()
    }

    compile() {
        this.itemCharacteristicCurve = evaluate(this.curveExpression)
    }

    maximumLikelihoodEstimation(
        abilityLevelsRange: number[],
        observedCorrectnessProportionsInThatLevels: number[]): { difficulty: number, discrimination: number } {

        let difficulties = range(-3, 3, 0.1)
        let discriminations = range(0, 30, 0.1)

        let bestFitDifficulty = 1
        let bestFitDiscrimination = 0
        let minError = Infinity

        for (let i = 0; i < 2; i++) {
            minError = Infinity
            difficulties.forEach(difficulty => {
                let error = this.calculateError(
                    abilityLevelsRange,
                    observedCorrectnessProportionsInThatLevels,
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
                    abilityLevelsRange,
                    observedCorrectnessProportionsInThatLevels,
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
        abilityLevelsRange: number[],
        observedCorrectnessProportionsInThatLevels: number[],
        discrimination: number,
        difficulty: number): number {

        let error = 0
        abilityLevelsRange.forEach((ability, index) => {
            let probabilithOfBeingCorrectGivenThisAbilithLevel = this.execute(ability, discrimination, difficulty)
            let observedCorrectProportion = observedCorrectnessProportionsInThatLevels[index]
            error += Math.abs(probabilithOfBeingCorrectGivenThisAbilithLevel - observedCorrectProportion)
        })
        return error
    }

}