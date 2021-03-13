export class UrlToSendProgress {
    method: string
    url: string
    help: string
}

export class UrlToSendResponses {
    method: string
    url: string
    help: string
    responseClass: string
}

export default class PreparedParticipation {

    lastVisitedItemId:number
    participationId:number
    testAsJson: string
    urlToSendResponses: UrlToSendResponses
    urlToSendProgress: UrlToSendProgress

}