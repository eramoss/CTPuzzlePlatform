<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/platform/tests' }"
        >Testes</el-breadcrumb-item
      >
      <el-breadcrumb-item>Edição</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Edição de teste</h2>
      <el-form :model="test" :rules="formRules" ref="form" v-if="test">
        <el-row :gutter="15">
          <el-col :span="19">
            <el-form-item label-width="130px" label="Nome do teste" prop="name">
              <el-input
                ref="inputName"
                v-model="test.name"
                placeholder="Teste de Pensamento Computacional"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="19">
            <el-form-item label="Pesquisar itens" label-width="130px">
              <el-select
                no-data-text="Não há itens para selecionar"
                value=""
                :v-model="selectedItems"
                popper-class="items-select"
                filterable
                multiple
                placeholder="Selecione os itens do teste"
              >
                <el-option
                  v-for="item in noSelectedItems"
                  :label="item.name"
                  :key="item.id"
                  :value="item"
                  value-key="id"
                >
                  <el-tooltip
                    content="Clique para adicionar ao teste"
                    effect="light"
                  >
                    <div @click="addItemToTest(item)">
                      <item-thumbnail :item="item" />
                    </div>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">

          </el-col> -->
          <el-col :span="24">
            <el-form-item>
              <form-item-label
                v-if="selectedItems.length"
                label="Itens adicionados (arraste para ordenar)"
                required
              />
              <draggable
                :v-bind="dragOptions"
                v-model="selectedItems"
                class="added-items"
                @end="updateOrder"
              >
                <transition-group type="transition">
                  <div
                    class="added-item"
                    v-for="(testItem, index) in selectedItems"
                    :key="testItem.item.id"
                  >
                    <item-thumbnail :item="testItem.item">
                      <div slot="headline">
                        Fase {{ index + 1 }}: {{ testItem.item.name }}
                      </div>
                      <template slot="start">
                        <el-tooltip effect="light" content="Arraste para mover">
                          <div class="drag-indicator" style="height: 100%">
                            <img src="/dragger.svg" alt="Arrastar" />
                          </div>
                        </el-tooltip>
                      </template>
                      <template slot="end">
                        <div>
                          <span v-if="testItem.countItemResponses">
                            Há {{ testItem.countItemResponses }} respostas
                            informadas para este item
                          </span>
                        </div>
                        <div>
                          <nuxt-link
                            target="_blank"
                            :to="`/platform/items/${testItem.item.id}`"
                          >
                            <btn-edit />
                          </nuxt-link>
                          <btn-remove
                            :title="
                              testItem.countItemResponses
                                ? 'Não é possível remover pois há respostas informadas'
                                : ''
                            "
                            :disabled="!!testItem.countItemResponses"
                            @click="removeItem(testItem)"
                          />
                        </div>
                      </template>
                    </item-thumbnail>
                  </div>
                </transition-group>
              </draggable>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <user-data-to-request-form-builder v-model="test.userDataToRequest" />
        </el-row>
        <el-row>
          <el-col>
            <btn-save @click="save" :loading="saving" />
            <btn-back @click="back" />
            <!-- <el-button
              type="primary"
              @click="genereateTestJson"
              icon=""
              :disabled="!test.id"
            >
              Gerar JSON
            </el-button> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import draggable from "vuedraggable";
import Vue from "vue";
import { Action, Component, Ref } from "nuxt-property-decorator";
import Test from "~/types/Test";
import Item from "~/types/Item";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";
import TestItem from "~/types/TestItem";
import TestApplicationDialog from "~/components/TestApplicationDialog.vue";
import ItemThumbnail from "~/components/ItemThumbnail.vue";
import { ElForm } from "element-ui/types/form";
import ResearchGroup from "~/types/ResearchGroup";
import UserDataToRequestFormBuilder from "~/components/UserDataToRequestFormBuilder.vue";

@Component({
  head: {
    title: "Teste",
  },
  components: {
    draggable,
    TestApplicationDialog,
    ItemThumbnail,
    UserDataToRequestFormBuilder,
  },
  data() {
    return {
      availableItems: [],
    };
  },
})
export default class TestEditForm extends Vue {
  saving = false;
  generatingJson = false;
  test: Test = new Test();
  availableItems: Item[] = [];
  selectedItems: TestItem[] = [];

  @Ref("inputName") inputName!: ElInput;
  @Ref("form") form!: ElForm;

  @Action("tests/save") saveTest!: (test: Test) => Promise<Test>;

  get formRules() {
    return {
      name: [
        { required: true, trigger: "blur", message: "Informe o nome do teste" },
      ],
    };
  }

  async genereateTestJson() {
    try {
      if (this.test.id) {
        this.generatingJson = true;
        let url =
          this.$axios.defaults.baseURL +
          "/tests/public/generateJson/" +
          this.test.id;
        window.open(url, "_blank");
      }
    } catch (e) {
      this.$notify({
        type: "error",
        title: "Não foi possível gerar o json",
        message: e,
      });
    } finally {
      this.generatingJson = false;
    }
  }

  get dragOptions() {
    return {
      animation: 0,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };
  }

  async formIsValid() {
    return this.form.validate();
  }

  async save() {
    if (!(await this.formIsValid())) {
      return;
    }
    try {
      this.saving = true;
      this.test = await this.saveTest(this.test);
      /* this.$notify({
        type: "success",
        title: "O teste foi salvo",
        message: "Você já pode acessar o teste.",
      }); */
      this.$alert(
        "Gostaria de aplicar o teste?",
        "O teste está pronto! Quer aplicá-lo agora?",
        {
          confirmButtonText: "Aplicar agora",
          cancelButtonText: "Não",
          confirmButtonClass: "el-button--success",
          showCancelButton: true,
          callback: (action: string) => {
            debugger;
            if (action == "confirm") {
              this.$router.push(
                `/platform/test-applications?test=${this.test.id}&action=apply`
              );
            }
            if (action == "cancel") {
              this.back();
            }
          },
        }
      );

      this.$router.push({ params: { id: this.test.id + "" } });
      //this.back();
    } catch (e) {
      console.error(e);
      this.$notify({
        type: "error",
        title: "Não foi possível guardar as alterações",
        message: "Ocorreu um erro ao armazenar as informações do teste.",
      });
    } finally {
      this.saving = false;
    }
  }

  updateOrder() {
    this.selectedItems.forEach((item: TestItem, index: number) => {
      item.order = index;
    });
  }

  get noSelectedItems(): Item[] {
    let notInTestItems = (item: Item) => {
      let testItemIds = this.selectedItems.map(
        (testItem: TestItem) => testItem.item.id
      );
      return testItemIds.indexOf(item.id) === -1;
    };
    return this.availableItems.filter(notInTestItems);
  }

  addItemToTest(item: Item) {
    let testItem = new TestItem();
    testItem.item = item;
    this.selectedItems.push(testItem);
    this.updateOrder();
    /* this.$notify({
      type: "success",
      title: "O item foi adicionado",
      message: "O item foi adicionado ao teste. Salve para registrar.",
    }); */
  }

  removeItem(testItem: TestItem) {
    this.selectedItems.splice(this.selectedItems.indexOf(testItem), 1);
    /* this.$notify({
      type: "success",
      title: "O item foi removido",
      message: "O item foi removido do teste. Salve para registrar.",
    }); */
  }

  async asyncData(ctx: Context) {
    let test!: Test;
    let id = ctx.params.id;
    if (id == "new") {
      test = new Test();
    }
    if (id != "new") {
      test = await ctx.store.dispatch("tests/getById", id);
    }
    if (!test) {
      test = new Test();
    }
    let selectedItems = test.items || [];
    let availableItems = await ctx.store.dispatch("items/findAll");
    test.researchGroup = ctx.$auth.user?.researchGroup as ResearchGroup;
    return {
      test,
      availableItems,
      selectedItems,
    };
  }

  mounted() {
    this.inputName?.focus();
  }

  back() {
    this.$router.push("/platform/tests");
  }
}
</script>
<style lang="scss">
.items-select {
  .el-select-dropdown__item {
    height: 100px !important;
    padding: 0;
    //border: 1px solid red;
  }
}
.added-items {
  flex-flow: column nowrap;
  .added-item {
    box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 3px;
    .drag-indicator {
      height: 100%;
      //border: 1px solid red;
      display: flex;
      //visibility: hidden;
    }
  }
  .added-item:hover {
    cursor: grab;
    box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 10px;
    .drag-indicator {
      visibility: visible;
    }
  }
  .added-item {
    background: white;
    margin: 5px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  border: 1px solid red;
  opacity: 1;
}
</style>
