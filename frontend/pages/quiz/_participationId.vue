<template>
  <div v-show="!loading">
    <centered-logo />
    <div v-show="isTestingQuiz" class="quiz-test-info">
      Testando questionário (as respostas não serão guardadas)
    </div>
    <div class="quiz-form center">
      <div v-if="puzzleUrl">
        <div v-if="hasQuestion">
          <h3>Antes de iniciar, por favor responda ao questionário</h3>
        </div>
      </div>

      <div v-if="!puzzleUrl">
        <div v-if="hasQuestion">
          <h3>Parabéns! Você finalizou todas as fases!</h3>
          <h2>Responda o questionário abaixo para ver o resultado</h2>
        </div>
        <h2 v-if="!hasQuestion">Obrigado por sua participação!</h2>
      </div>

      <div>
        <div v-if="hasQuestion">
          <div class="question" style="margin: 0 auto">
            <h3>Questão {{ questionIndex + 1 }} de {{ questions.length }}</h3>
            <h2>
              {{ currentQuestion.name }}
              <span v-show="!currentQuestion.required">(opcional)</span>
            </h2>
            <div>
              <el-input
                @keydown.enter.native="nextQuestion"
                v-if="currentQuestion.variableType.varType == 'string'"
                class="large-input"
                ref="input"
                size="large"
                v-model="currentQuestion.answer"
                placeholder="Responda aqui"
              >
              </el-input>
              <el-radio-group
                v-model="currentQuestion.answer"
                v-if="currentQuestion.variableType.varType == 'boolean'"
              >
                <el-radio-button class="large-radio" label="Sim"
                  >Sim</el-radio-button
                >
                <el-radio-button class="large-radio" size="large" label="Não"
                  >Não</el-radio-button
                >
              </el-radio-group>
              <el-radio-group
                v-model="currentQuestion.answer"
                v-if="currentQuestion.variableType.varType == 'options'"
              >
                <el-radio-button
                  :key="option.id"
                  v-for="option in currentQuestion.options"
                  class="large-radio"
                  :label="option.name"
                  >{{ option.name }}</el-radio-button
                >
              </el-radio-group>
              <el-input
                @keydown.enter.native="nextQuestion"
                v-if="currentQuestion.variableType.varType == 'number'"
                class="large-input"
                ref="inputNumber"
                size="large"
                type="number"
                style="text-align: center"
                v-model="currentQuestion.answer"
                placeholder="0"
              >
              </el-input>
              <el-input
                v-if="currentQuestion.variableType.varType == 'longString'"
                class="large-input"
                ref="inputTextArea"
                size="large"
                type="textarea"
                style="text-align: center"
                v-model="currentQuestion.answer"
                placeholder="Escreva aqui sua resposta"
              >
              </el-input>
            </div>
          </div>
          <div class="flex-row center btns">
            <div class="prev" v-if="questionIndex > 0">
              <el-button @click="prevQuestion" type="success">
                <div class="flex-row">
                  <icon name="arrow_back" />
                  Questão anterior
                </div>
              </el-button>
            </div>
            <div class="next" v-if="questionIndex < questions.length">
              <el-button
                @click="nextQuestion"
                type="success"
                :disabled="!currentQuestion.answer && currentQuestion.required"
              >
                <div class="flex-row">
                  Próxima questão
                  <icon name="arrow_forward" />
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="center fill" v-if="!hasQuestion">
        <div v-if="!puzzleUrl">
          <el-button
            class="btnSeeResult"
            type="success"
            size="large"
            @click="seeResult"
          >
            Ver resultado!
          </el-button>
        </div>

        <div v-if="puzzleUrl">
          <el-button
            class="btnSeeResult"
            type="success"
            size="large"
            @click="startTest"
          >
            Iniciar teste
          </el-button>
        </div>

        <!-- <div>
          <el-button
            @click="restart"
            class="btnSeeResult"
            type="default"
            size="large"
          >
            Responder novamente
          </el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Ref } from "nuxt-property-decorator";
import { UserDataQuestion, UserQuizSession } from "~/types/UserDataQuiz";
import Participation from "~/types/Participation";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";
import CenteredLogo from "~/components/CenteredLogo.vue";
import { loadUserUuid } from "~/types/userUuidUtil";

import {
  ACTION_GET_BY_ID_PUBLIC_PARTICIPATION,
  ACTION_SAVE_QUIZ_RESPONSE,
} from "~/store/participations";
import { ACTION_PARTICIPATE_IN_THE_TEST } from "~/store/test-applications";

@Component({
  components: { CenteredLogo },
  head: {
    title: "Questionário",
  },
  auth: false,
})
export default class EndOfTestQuizzPage extends Vue {
  participation: Participation = new Participation();
  loading = true;

  @Ref() input!: ElInput;
  @Ref() inputTextArea!: ElInput;
  @Ref() inputNumber!: ElInput;

  isTestingQuiz = false;
  puzzleUrl: string = "";

  get hasQuestion() {
    return !!this.currentQuestion;
  }

  get questionIndex() {
    return this.quizSession?.index || 0;
  }

  startTest() {
    window.open(this.puzzleUrl, "_blank");
  }

  async nextQuestion() {
    if (this.currentQuestion?.required) {
      if (!this.currentQuestion?.answer) {
        return;
      }
    }
    this.quizSession.index = this.questionIndex + 1;
    await this.saveQuizResponse();
    this.$nextTick(() => {
      this.focusInput();
    });
  }

  restart() {
    initQuizSession(this.participation, true);
  }

  @Action(ACTION_SAVE_QUIZ_RESPONSE)
  callSaveQuizResponse!: (
    participation: Participation
  ) => Promise<Participation>;

  prevQuestion() {
    this.quizSession.index = this.questionIndex - 1;
    this.saveQuizResponse();
    this.focusInput();
  }

  async saveQuizResponse() {
    if (!this.isTestingQuiz) {
      this.participation = await this.callSaveQuizResponse(this.participation);
    }
  }

  focusInput() {
    let varType = this.currentQuestion?.variableType?.varType;
    if (varType == "longString") {
      this.inputTextArea?.focus();
    }
    if (varType == "string") {
      this.input?.focus();
    }
    if (varType == "number") {
      this.inputNumber?.focus();
    }
  }

  get currentQuestion(): UserDataQuestion {
    let question = new UserDataQuestion();
    if (this.questions) {
      question = this.questions[this.questionIndex];
    }
    return question;
  }

  get quizSession(): UserQuizSession {
    return this.participation?.userDataToRequest as UserQuizSession;
  }

  get questions(): UserDataQuestion[] {
    return this.quizSession?.questions || [];
  }

  async asyncData(ctx: Context) {}

  get participationId() {
    return this.$route.params.participationId;
  }

  seeResult() {
    if (this.participationId) {
      this.$router.push(`/score/${this.participationId}`);
    }
  }

  @Action(ACTION_PARTICIPATE_IN_THE_TEST)
  participateInTheTest!: (payload: {
    applicationHash: string;
    userHash: string;
  }) => Promise<Participation>;

  async mounted() {
    let participationId = this.$route.params.participationId;
    let momentOfQuizPresentation = this.$route.query.moment;

    if (participationId) {
      this.participation = await this.$store.dispatch(
        ACTION_GET_BY_ID_PUBLIC_PARTICIPATION,
        participationId
      );
    }

    if (!participationId) {
      if (momentOfQuizPresentation == "before-the-test") {
        this.initializeParticipation();
      }
    }

    if (!this.participationId && !this.participation.id) {
      this.isTestingQuiz = true;
      this.participation.userDataToRequest = this.convertQueryUrlToTestingQuiz();
    }

    if (!this.isTestingQuiz) {
      initQuizSession(this.participation);
    }
    this.loading = false;
    this.focusInput();
  }

  async initializeParticipation() {
    let userHash = loadUserUuid();
    let dataUrl = this.$route.query.dataUrl + "";
    dataUrl = dataUrl.replace("<user_uuid>", userHash);
    this.puzzleUrl = `${this.$route.query.puzzleUrl}&dataUrl=${dataUrl}`;
    let applicationHash = this.extractApplicationHash(dataUrl);
    this.participation = await this.participateInTheTest({
      applicationHash,
      userHash,
    });
  }

  convertQueryUrlToTestingQuiz(): UserQuizSession {
    let strQuiz = this.$route.params.quiz as string;
    let quiz = Object.assign(
      new UserQuizSession(),
      JSON.parse(strQuiz)
    ) as UserQuizSession;
    quiz.index = 0;
    return quiz;
  }
  extractApplicationHash(dataUrl: string): string {
    return dataUrl.substring(
      dataUrl.indexOf("data") + 5,
      dataUrl.lastIndexOf("/")
    );
  }
}
function initQuizSession(participation: Participation, force: boolean = false) {
  if (!participation.userDataToRequest || force) {
    const quiz = new UserQuizSession();
    quiz.questions = participation?.application?.test
      ?.userDataToRequest as UserDataQuestion[];
    quiz.index = 0;
    participation.userDataToRequest = quiz;
  }
}
</script>
<style lang="scss">
.quiz-form {
  padding: 15px;
  .question {
    h3 {
      margin-top: 30px;
      margin-bottom: 10px;
    }
  }
  .large-radio {
    .el-radio-button__inner {
      font-size: 20pt;
    }
  }
  .large-input {
    font-size: 20pt;
    .el-input__inner {
      height: 60px;
      padding: 20px !important;
    }
  }
  .btns {
    margin-top: 30px;
    .el-button {
      margin: 10px;
      font-size: 12pt;
      font-weight: bold;
    }
  }
}

.btnSeeResult {
  margin-top: 20px;
  font-weight: bold;
  font-size: 12pt;
}
@media (min-width: 800px) {
  .quiz-form {
    padding: 30px;
    .question {
      width: 80%;
    }
    .btns {
      .el-button {
        font-size: 20pt;
      }
    }
    .btnSeeResult {
      font-size: 20pt;
    }
  }
}
.quiz-test-info {
  background: #ffbe1c;
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 12pt;
  color: white;
  padding: 7px;
}
</style>