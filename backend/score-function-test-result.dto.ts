import { Score } from "src/item-responses/score.entity"

export default class ScoreFunctionTestResult {
    toScore(): Score {
        let lines = this.response.split('\n').filter(line => !!line)
        let scoreJson = lines[lines.length - 1]
        console.warn('scoreJson', scoreJson)
        let score = JSON.parse(scoreJson) as Score
        score.message = this.response
        return score;
    }
    response!: string
}