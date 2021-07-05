import Big from "big.js"
import * as math from "mathjs"

class MathHelper {

    constructor() {
    }

    average(numbers: number[]): number {
        return math.sum(numbers) / numbers.length
    }

    standartDeviation(numbers: number[]): number {
        return math.std(numbers)
    }

    variance(numbers: number[]): number {
        return math.variance(numbers)
    }


}

export const mathHelper = new MathHelper()

export function round(number: number, precision: number = 2): number {
    return Big(number).round(2).toNumber()
}