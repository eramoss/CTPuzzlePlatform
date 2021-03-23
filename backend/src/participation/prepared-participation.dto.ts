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

export class UrlToSendUserData {
    method: string
    url: string
    help: string
}

export default class PreparedParticipation {

    lastVisitedItemId:number
    participationId:number
    test: string
    urlToSendResponses: UrlToSendResponses
    urlToSendProgress: UrlToSendProgress
    urlToSendUserData: UrlToSendUserData

}