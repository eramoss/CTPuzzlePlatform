<template>
  <div class="quiz-form center">
    <h2>Responda o questionário abaixo para ver o resultado</h2>
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
              <el-radio-button class="large-radio" label="true"
                >Sim</el-radio-button
              >
              <el-radio-button class="large-radio" size="large" label="false"
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
              :disabled="!currentQuestion.answer"
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
        <el-button class="btnSeeResult" type="success" size="large">
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
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Ref, Watch } from "nuxt-property-decorator";
import { UserDataType, UserDataQuestion, VarType } from "~/types/UserDataQuiz";
import Participation from "~/types/Participation";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";

@Component({
  head: {
    title: "Resultado do teste",
  },
  auth: false,
})
export default class EndOfTestQuizzPage extends Vue {
  //@Action('participations/loadEndOfTestQuiz') loadEndOfTestQuiz:()=>

  participation!: Participation;

  questionIndex = 0;

  @Ref() input!: ElInput;

  get hasQuestion() {
    return !!this.currentQuestion;
  }

  nextQuestion() {
    this.questionIndex = this.questionIndex + 1;
    this.saveParticipation();
    this.focusInput();
  }

  restart() {
    this.participation.userDataToRequest = this.participation.application?.test?.userDataToRequest;
    this.questionIndex = 0;
  }

  @Action("participations/save")
  callSaveParticipation!: (
    participation: Participation
  ) => Promise<Participation>;

  prevQuestion() {
    this.questionIndex = this.questionIndex - 1;
    this.saveParticipation();
    this.focusInput();
  }

  async saveParticipation() {
    this.participation = await this.callSaveParticipation(this.participation);
  }

  focusInput() {
    this.input?.focus();
  }

  get currentQuestion() {
    return this.questions[this.questionIndex];
  }

  get questions() {
    return this.participation?.userDataToRequest as UserDataQuestion[];
  }

  async asyncData(ctx: Context) {
    const participation = await ctx.store.dispatch(
      "participations/getById",
      ctx.params.participationId
    );
    if (!participation.userDataToRequest) {
      participation.userDataToRequest =
        participation?.application?.test?.userDataToRequest;
    }
    return {
      participation,
    };
  }

  get participationId() {
    return this.$route.params.participationId;
  }

  get currentQuestionIndexCookieName() {
    let participationId = this.participationId;
    return `${participationId}_questionIndex`;
  }

  @Watch("questionIndex")
  onChangeQuestionIndex() {
    localStorage.setItem(
      this.currentQuestionIndexCookieName,
      this.questionIndex + ""
    );
  }

  mounted() {
    this.questionIndex = parseInt(
      localStorage.getItem(this.currentQuestionIndexCookieName) || "0"
    );
    this.focusInput();
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
</style>