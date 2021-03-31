<template>
  <div>
    <table class="summary-table" v-if="quiz">
      <tr :key="question.id" v-for="question in quiz.questions">
        <td>{{ question.name }}</td>
        <td>
          {{ question.answer }}
        </td>
      </tr>
    </table>
    <div v-if="!quiz">
      <p>O questionário de fim de teste ainda não foi respondido</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { UserQuizSession } from "~/types/UserDataQuiz";
@Component
export default class QuizResponses extends Vue {
  @Prop({}) quiz!: UserQuizSession;
}
</script>