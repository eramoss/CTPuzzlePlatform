<template>
  <div class="form-builder panel shadow white">
    <h2 style="margin-bottom: 20px">Questionário de fim de teste</h2>
    <message-alert style="margin-bottom: 20px">
      <p>
        O questionário de fim de teste visa captar informações dos participantes
        do teste para fins estatísticos.
      </p>
    </message-alert>
    <table style="width: 100%">
      <tr>
        <th>Pergunta</th>
        <th style="width: 200px">Tipo da resposta</th>
        <th style="width: 200px">Obrigatório</th>
        <th style="width: 200px">Remover</th>
      </tr>
      <tr
        v-for="(userDataVariable, index) in userDataList"
        :key="userDataVariable.id"
      >
        <td>
          <el-input :ref="`input${index}`" v-model="userDataVariable.name" />
        </td>
        <td>
          <el-select v-model="userDataVariable.variableType" value-key="id">
            <el-option
              :key="variableType.id"
              v-for="variableType in variableTypes"
              :value="variableType"
              :label="variableType.varTypeName"
            >
            </el-option>
          </el-select>
        </td>
        <td style="text-align: center">
          <el-switch v-model="userDataVariable.required" />
        </td>
        <td>
          <btn-remove @click="removeVariable(userDataVariable)"></btn-remove>
        </td>
      </tr>
      <tr style="margin-top: 10px">
        <td style="padding-top: 10px">
          <el-button
            title="Adicionar pergunta"
            class="fill"
            style="font-weight: bold"
            icon="el-icon-plus"
            size="large"
            type="warning"
            @click="addVariable"
          >
            Adicionar nova pergunta
          </el-button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, VModel } from "nuxt-property-decorator";
import { ElInput } from "element-ui/types/input";

type VarType = "number" | "string" | "date" | "boolean";

class UserDataType {
  id!: number;
  varTypeName!: string;
  varType!: VarType;
}

class UserDataVariable {
  id!: number;
  name!: string;
  variableType!: UserDataType;
  required!: boolean;
}

@Component
export default class UserDataToRequestFormBuilder extends Vue {
  @VModel() userDataList!: UserDataVariable[];

  get variableTypes(): UserDataType[] {
    return [
      { id: 1, varTypeName: "Número", varType: "number" },
      { id: 2, varTypeName: "Texto", varType: "string" },
      { id: 4, varTypeName: "Sim ou não", varType: "boolean" },
    ];
  }

  getVarType(varType: VarType): UserDataType {
    return this.variableTypes.filter((it) => it.varType == varType)[0];
  }

  removeVariable(userDataVariable: UserDataVariable) {
    let index = this.userDataList.indexOf(userDataVariable);
    this.userDataList.splice(index, 1);
  }

  addVariable() {
    let variable = new UserDataVariable();
    let lastVariable = this.userDataList[this.userDataList.length];
    if (lastVariable) {
      variable.id = lastVariable.id + 1;
    }

    let randomQuestions = [
      "Qual é seu nome?",
      "Gosta de problemas?",
      "Quais padrões você observou?",
      "Prefere jogos de corrida ou de cartas?",
      "Você resolveu em partes, ou tudo de uma vez?",
      "Gostou do jogo?",
      "O que mudaria?",
      "Jogaria novamente?",
      "Precisou de ajuda?",
    ];

    variable.name =
      randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
    variable.variableType = this.getVarType("number");

    this.userDataList.push(variable);

    this.$nextTick(() => {
      let inputToFocus = `input${this.userDataList.length - 1}`;
      let elements = this.$refs[inputToFocus] as any[];
      if (elements && elements.length) {
        let elInput = elements[0] as ElInput;
        if (elInput) {
          elInput.select();
          elInput.focus();
        }
      }
    });
  }

  mounted() {
    if (!this.userDataList.length)
      this.userDataList = [
        {
          id: 1,
          name: "Nome",
          variableType: this.getVarType("string"),
          required: false,
        },
        {
          id: 2,
          name: "Idade",
          variableType: this.getVarType("number"),
          required: false,
        },
        {
          id: 3,
          name: "Já programou alguma vez?",
          variableType: this.getVarType("boolean"),
          required: false,
        },
        {
          id: 4,
          name: "O que achou do teste?",
          variableType: this.getVarType("string"),
          required: false,
        },
      ];
  }
}
</script>
<style lang="scss">
.form-builder {
  margin: 20px auto;
  //border: 1px solid red;
}
</style>