<template>
  <div>
    <div class="flex-row">
      <el-select
        v-loading="loadingTestApplications"
        :filterable="true"
        v-model="selectedTestApplication"
        value-key="id"
        placeholder="Selecione a aplicação"
      >
        <el-option
          v-for="testApplication in testApplications"
          :key="testApplication.id"
          :label="testApplication.name"
          :value="testApplication"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import { PageRequest, PageResponse } from "~/types/pagination";
import { ACTION_PAGINATE_APPLICATIONS } from "~/store/test-applications";
@Component
export default class SelectTestApplication extends Vue {
  testApplications: TestApplication[] = [];
  selectedTestApplication: TestApplication = new TestApplication();
  loadingTestApplications = false;

  @Prop({ default: "TEST_APPLICATION_ID" }) localStorageUniqueId!: string;
  @Prop({}) forceSelectedApplication!: TestApplication;

  async loadTestApplications() {
    let pageRequest = new PageRequest({});
    let researchGroup = this.$auth.user?.researchGroup;
    if (this.$auth.user?.researchGroup) {
      //@ts-ignore
      pageRequest.andWhere = "test.researchGroup.id = " + researchGroup.id;
    }
    try {
      this.loadingTestApplications = true;
      let pageResponse: PageResponse<TestApplication> = await this.$store.dispatch(
        ACTION_PAGINATE_APPLICATIONS,
        pageRequest
      );
      this.testApplications = pageResponse.data;
    } catch (e) {
      console.error(e);
      this.$notify({
        title: "Não foi possível carregar as aplicações",
        message: "Ocorreu um erro ao carregar",
        type: "error",
      });
    } finally {
      this.loadingTestApplications = false;
    }
  }

  registerLoadedTestApplicationId() {
    localStorage.setItem(
      this.localStorageUniqueId,
      this.selectedTestApplication?.id + ""
    );
  }

  loadPreviousSelectedTestApplicationId(): number | null {
    let applicationId = undefined;
    applicationId = localStorage.getItem(this.localStorageUniqueId);
    applicationId = parseInt("0" + applicationId);
    return applicationId;
  }

  selectTestApplicationById(testApplicationId: number) {
    let testApplication = this.testApplications?.find(
      (testApplication) => testApplication.id == testApplicationId
    );
    if (testApplication) {
      this.selectedTestApplication = testApplication;
    }
  }

  loadSavedTestApplication() {
    let testApplicationId = this.loadPreviousSelectedTestApplicationId();
    if (testApplicationId) {
      this.selectTestApplicationById(testApplicationId);
    }
  }

  @Watch("selectedTestApplication")
  onChangeSelectedTestApplication() {
    this.registerLoadedTestApplicationId();
    this.$emit("input", this.selectedTestApplication);
  }

  select(testApplication: TestApplication) {
    let foundToSelect = this.testApplications.find(
      (it) => it.id == testApplication.id
    );
    if (foundToSelect) {
      this.selectedTestApplication = foundToSelect;
    }
  }

  async mounted() {
    await this.loadTestApplications();
    if (this.forceSelectedApplication) {
      this.selectedTestApplication = this.forceSelectedApplication;
      return;
    }
    this.loadSavedTestApplication();
  }
}
</script>