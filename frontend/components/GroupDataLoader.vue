<template>
  <div>
    <div class="flex-row">
      <el-button
        type="primary"
        @click="showDialogGroupSelector"
        size="small"
        round
      >
        <b>{{ buttonText }}</b>
        <i
          class="el-icon-close"
          round
          size="small"
          v-show="!!selectedGroupName"
          icon="el-icon-close"
        >
        </i>
      </el-button>
    </div>
    <el-dialog
      :visible.sync="selectorDialogVisible"
      :title="`Selecione o grupo para comparar`"
    >
      <message-alert
        v-show="showMessageInvalidControlGroupSelected"
        class="bottom-marged"
        type="warning"
      >
        A aplicação selecionada não é o grupo de controle da aplicação em
        análise.
        <el-button @click="selectControlGroup" type="text">
            Selecionar grupo de controle
        </el-button>
      </message-alert>
      <div>
        Os dados da aplicação
        <nuxt-link
          style="margin: 0"
          target="_blank"
          :to="`/platform/test-applications/${testApplication.id}`"
        >
          <el-button type="text" size="small">{{
            testApplication.name
          }}</el-button>
        </nuxt-link>
        serão comparados com os dados da seguinte aplicação:
      </div>
      <select-test-application
        ref="selectTestApplicationComponent"
        :forceSelectedApplication="testApplication.controlApplication"
        v-model="selectedTestApplication"
        localStorageUniqueId="LOCAL_STORAGE_ID_GROUP_SELECTOR"
      />

      <div slot="footer">
        <el-tooltip
          content="Remove os dados de comparação de grupo"
          effect="light"
        >
          <el-button
            v-show="!!selectedGroupName"
            icon="el-icon-close"
            @click="clearGroup"
          >
            Remover
          </el-button>
        </el-tooltip>
        <el-button
          type="primary"
          :disabled="!hasSelectedTestApplication"
          @click="selectTestApplication"
        >
          Selecionar
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import SelectTestApplication from "~/components/SelectTestApplication.vue";
@Component({
  components: {
    SelectTestApplication,
  },
})
export default class GroupDataLoader extends Vue {
  @Prop({ default: () => new TestApplication() })
  testApplication!: TestApplication;
  selectedTestApplication: TestApplication = new TestApplication();
  selectorDialogVisible = false;
  showMessageInvalidControlGroupSelected = false;
  selectedGroupName: string | null = null;

  @Ref() selectTestApplicationComponent!: SelectTestApplication;

  get hasControlApplication() {
    return !!this.testApplication?.controlApplication;
  }

  get hasSelectedTestApplication() {
    return !!this.selectedTestApplication;
  }

  showDialogGroupSelector() {
    if (this.selectedGroupName) {
      this.clearGroup();
      return;
    }
    this.selectorDialogVisible = true;
    this.$nextTick(() => {
      this.selectedTestApplication = this.selectTestApplicationComponent?.selectedTestApplication;
    });
  }

  @Watch("selectedTestApplication")
  onChangeSelectedApplication() {
    this.showMessageInvalidControlGroupSelected = false;
    if (this.hasSelectedTestApplication) {
      this.showMessageInvalidControlGroupSelected =
        this.hasControlApplication &&
        !!this.selectedTestApplication?.id &&
        this.selectedTestApplication?.id !=
          this.testApplication?.controlApplication?.id;
    }
  }

  selectTestApplication() {
    if (this.testApplication?.id == this.selectedTestApplication?.id) {
      this.$notify({
        title: "Selecione outra aplicação",
        message: "A aplicação selecionada é a mesma que já está em análise",
        type: "error",
      });
      return;
    }
    this.selectedGroupName = this.selectedTestApplication?.name;
    this.$emit("onSelectTestApplication", this.selectedTestApplication);
    this.hide();
  }

  clearGroup() {
    this.selectedTestApplication = new TestApplication();
    this.selectTestApplication();
  }

  get buttonText() {
    return !!this.selectedGroupName
      ? `${this.selectedGroupName}`
      : "Comparar dados";
  }

  selectControlGroup() {
    if (this.hasControlApplication) {
      this.selectTestApplicationComponent.select(
        //@ts-ignore
        this.testApplication?.controlApplication
      );
    }
  }

  hide() {
    this.selectorDialogVisible = false;
  }
}
</script>