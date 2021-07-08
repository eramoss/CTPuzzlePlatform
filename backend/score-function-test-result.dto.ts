import { Score } from "src/item-responses/score.entity"

export default class ScoreFunctionTestResult {

    setResponse(response: string): ScoreFunctionTestResult {
        this.response = response
        return this
    }

    response!: string

    toScore(): Score {
        let score: Score
        try {
            let lines = this.response.split('\n').filter(line => !!line)
            let scoreJson = lines[lines.length - 1]
            score = JSON.parse(scoreJson) as Score
            score.message = this.response
            score.json = scoreJson
            return score;
        } catch (e) {
            score = new Score();
            score.score = -1;
            score.max = -1;
            score.message = this.response;
        }
        score.message = score.message.split('\n').filter(line => line.indexOf('at file') == -1).join('\n');
        return score;
    }
}