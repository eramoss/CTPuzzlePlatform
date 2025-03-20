export class UrlHelper {
  method: string;
  url: string;
  help: string;
  responseClass?: string;
}

export default class PreparedParticipation {
  participationId: number;
  test: string;
  urlToSendResponses: UrlHelper;
  urlToEndOfTestQuiz: UrlHelper;
  urlToInstantiateItem: UrlHelper;
}
