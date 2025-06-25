import { ParticipationTest } from './participation.entity';

export class UrlHelper {
  method: string;
  url: string;
  help: string;
  responseClass?: string;
}

export default class PreparedParticipation {
  test: ParticipationTest;
  urlToSendResponses?: UrlHelper;
  urlToEndOfTestQuiz?: UrlHelper;
}
