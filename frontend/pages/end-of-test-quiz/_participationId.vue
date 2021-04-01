<template>
  <div>
    <centered-logo/>
    <div v-show="isTestingQuiz" class="quiz-test-info">
      Testando questionário (as respostas não serão guardadas)
    </div>
    <div class="quiz-form center">
      <h2 v-if="hasQuestion">Responda o questionário abaixo para ver o resultado</h2>
      <h2 v-if="!hasQuestion">Obrigado por sua participação!</h2>
      <div>
        <div v-if="hasQuestion">
          <div class="question" style="margin: 0 auto">
            <h3>Questão {{ questionIndex + 1 }} de {{ questions.length }}</h3>
            <h3>{{ currentQuestion.name }}</h3>
            <div>
              <el-input
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
                v-if="currentQuestion.variableType.varType == 'number'"
                class="large-input"
                ref="input"
                size="large"
                type="number"
                style="text-align: center"
                v-model="currentQuestion.answer"
                placeholder="0"
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
        <div>
          <el-button
            class="btnSeeResult"
            type="success"
            size="large"
            @click="seeResult"
          >
            Ver resultado!
          </el-button>
        </div>
        <div>
          <el-button
            @click="restart"
            class="btnSeeResult"
            type="default"
            size="large"
          >
            Reponder novamente
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Ref, Watch } from "nuxt-property-decorator";
import {
  UserDataType,
  UserDataQuestion,
  VarType,
  UserQuizSession,
} from "~/types/UserDataQuiz";
import Participation from "~/types/Participation";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";
import CenteredLogo from "~/components/CenteredLogo.vue";

@Component({
  components: { CenteredLogo },
  head: {
    title: "Resultado do teste",
  },
  auth: false,
})
export default class EndOfTestQuizzPage extends Vue {
  participation!: Participation;

  @Ref() input!: ElInput;
  isTestingQuiz = false;

  get hasQuestion() {
    return !!this.currentQuestion;
  }

  get questionIndex() {
    return this.quizSession?.index || 0;
  }

  nextQuestion() {
    this.quizSession.index = this.questionIndex + 1;
    this.saveParticipation();
    this.focusInput();
  }

  restart() {
    initQuizSession(this.participation, true);
  }

  @Action("participations/save")
  callSaveParticipation!: (
    participation: Participation
  ) => Promise<Participation>;

  prevQuestion() {
    this.quizSession.index = this.questionIndex - 1;
    this.saveParticipation();
    this.focusInput();
  }

  async saveParticipation() {
    if (!this.isTestingQuiz) {
      this.participation = await this.callSaveParticipation(this.participation);
    }
  }

  focusInput() {
    this.input?.focus();
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

  async asyncData(ctx: Context) {
    let participationId = ctx.params.participationId;
    let participation = new Participation();
    let isTestingQuiz = false;
    if (participationId) {
      participation = await ctx.store.dispatch(
        "participations/getById",
        participationId
      );
      initQuizSession(participation);
    } else {
      isTestingQuiz = true;
      let strQuiz = ctx.route.query.quiz as string;
      let quiz = Object.assign(
        new UserQuizSession(),
        JSON.parse(strQuiz)
      ) as UserQuizSession;
      quiz.index = 0;
      participation.userDataToRequest = quiz;
    }
    return {
      participation,
      isTestingQuiz,
    };
  }

  get participationId() {
    return this.$route.params.participationId;
  }

  seeResult() {
    this.$router.push(`/score?participationId=${this.participationId}`);
  }

  mounted() {
    this.focusInput();
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
      width: 50%;
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
  background: #e6a23c;
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 12pt;
  color: white;
  padding: 7px;
}
</style>