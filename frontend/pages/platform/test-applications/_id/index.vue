<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/platform/test-applications' }"
        >Aplicações</el-breadcrumb-item
      >
      <el-breadcrumb-item>Aplicação de teste</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Aplicação de teste</h2>
      <el-form>
        <el-row>
          <el-col :span="20">
            <el-form-item label-width="100px" label="Teste">
              <el-input
                ref="inputName"
                readonly
                v-model="test.name"
                placeholder="Teste de Pensamento Computacional"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="Link" label-width="100px">
              <div class="flex-row">
                <copy-input v-model="testApplication.url" style="flex-grow:1" />
                <el-tooltip content="Abrir tela do teste">
                  <el-button
                    style="margin-left: 20px"
                    type="text"
                    @click="accessTestApplication"
                    icon="el-icon-position">
                    Acessar
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <form-item-label label="Acompanhar"/>
            <el-table>
                <el-table-column label="Participante"/>
                <el-table-column label="Progresso"/>
            </el-table>
        </el-row>
        <el-row>
          <el-col>
            <btn-back @click="back" />
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import CopyInput from "~/components/CopyInput.vue";
import Vue from "vue";
import { Component } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import Test from "~/types/Test";

@Component({
  components: {
    CopyInput,
  },
})
export default class TestEditForm extends Vue {
  saving: boolean = false;
  testApplication: TestApplication = new TestApplication();

  async asyncData(ctx: Context) {
    let testApplication!: TestApplication;
    let id = ctx.params.id;
    testApplication = await ctx.store.dispatch("test-applications/getById", id);
    return {
      testApplication,
    };
  }

  get test(): Test {
    let test = new Test();
    if (this.testApplication) {
      if (this.testApplication.test) {
        test = this.testApplication.test;
      }
    }
    return test;
  }

  accessTestApplication() {
    window.open(this.testApplication.url, "_blank");
  }

  back() {
    this.$router.go(-1);
  }
}
</script>