import { Score } from "src/item-responses/score.entity"

export default class ScoreFunctionTestResult {
    toScore(): Score {
        let score: Score
        try {
            let lines = this.response.split('\n').filter(line => !!line)
            let scoreJson = lines[lines.length - 1]
            console.warn('scoreJson', scoreJson)
            score = JSON.parse(scoreJson) as Score
            score.message = this.response
            return score;
        } catch (e) {
            score = new Score();
            score.score = -1;
            score.max = -1;
            score.message = this.response;
        }
        return score;
    }
    response!: string
}