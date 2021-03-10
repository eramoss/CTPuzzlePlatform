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
                  <div class="select-item">
                    <div class="image">
                      <thumbnail :src="item.thumbnail" />
                    </div>
                    <div class="item-infos">
                      <p class="title">{{ item.name }}</p>
                      <p class="description">{{ item.description }}</p>
                    </div>
                    <div class="image">
                      <thumbnail :src="item.thumbnail" />
                    </div>
                    <div>
                      <el-button
                        class="add-button"
                        size="large"
                        @click="addItemToTest(item)"
                      >
                        <i class="el-icon-plus"></i>
                        <p>Adicionar ao teste</p>
                      </el-button>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <form-item-label
              label="Itens adicionados (arraste para ordenar)"
              required
            />
            <draggable
              :v-bind="dragOptions"
              v-model="selectedItems"
              class="added-items"
              @end="updateOrder"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  title="Arraste para ordenar"
                  class="added-item"
                  v-for="(testItem, index) in selectedItems"
                  :key="testItem.item.id"
                >
                  <!-- <div class="drag-indicator"><i class="el-icon-rank"></i></div> -->
                  <div class="item-text">
                    <div class="item-title">
                      Fase {{ index + 1 }}: {{ testItem.item.name }}
                    </div>
                    <div class="item-subtitle">
                      {{ testItem.item.description }}
                    </div>
                  </div>
                  <el-button
                    @click="editItem(testItem)"
                    size="small"
                    title="Editar item"
                    icon="el-icon-edit"
                    type="default"
                  >
                    Editar
                  </el-button>
                  <el-button
                    size="small"
                    @click="removeItem(testItem)"
                    title="Remover item"
                    icon="el-icon-delete-solid"
                    type="danger"
                    >Remover</el-button
                  >
                </div>
              </transition-group>
            </draggable>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col>
            <btn-save @click="save" :loading="saving" />
            <btn-back @click="back" />
            <el-button
              type="primary"
              @click="genereateTestJson"
              icon=""
              :disabled="!test.id"
            >
              Gerar JSON
            </el-button>
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
import { ElForm } from "element-ui/types/form";

@Component({
  components: {
    draggable,
    TestApplicationDialog,
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
  @Action("tests/generateJson") generateJsonFromTest!: (
    test: Test
  ) => Promise<string>;

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
          this.$axios.defaults.baseURL + "/tests/generateJson/" + this.test.id;
        window.open(url, "_blank");
        //let json = await this.generateJsonFromTest(this.test);
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
      this.$notify({
        type: "success",
        title: "O teste foi salvo",
        message: "Você já pode acessar o teste.",
      });
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

  editItem(testItem: TestItem) {
    this.$router.push("/platform/items/" + testItem.item.id);
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
    let selectedItems = test.items || [];
    let availableItems = await ctx.store.dispatch("items/findAll");
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
.select-item > div {
  margin: 0 10px;
}
.select-item {
  display: flex;
  flex-flow: row nowrap;
  padding: 5px;
  justify-content: space-between;

  .item-infos {
    flex-grow: 1;
    padding: 6px;
    display: flex;
    flex-flow: column nowrap;
    .title {
      font-weight: bold;
      font-size: 16pt;
    }
  }
  .add-button {
    justify-content: center;
    height: 130px;
    display: flex;
    flex-flow: column;
    align-items: center;
    .el-icon-plus {
      font-size: 30pt;
    }
  }
  .image {
    width: 200px;
    height: 130px;
    border: 1px solid #ccc;
  }
}
.items-select {
  .el-select-dropdown__item {
    height: 140px !important;
    padding: 0;
    //border: 1px solid red;
  }
}
.added-items {
  display: flex;
  flex-flow: column nowrap;
  .added-item {
    .drag-indicator {
      margin-right: 5px;
      font-size: 15pt;
      flex-grow: 0;
      color: #777;
    }
    .item-text {
      display: flex;
      flex-flow: column;
      flex-grow: 1;
    }
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }
  .added-item:hover {
    background: #eee;
    cursor: grab;
  }
  .added-item .drag-indicator {
    color: #ddd;
  }
  .added-item:hover .drag-indicator {
    color: #222;
  }
  .added-item {
    background: white;
    position: relative;
    padding: 10px;
    margin: 5px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;

    .item-title {
      line-height: 1.2em;
      font-size: 13pt;
      font-weight: bold;
      color: #333;
    }

    .item-subtitle {
      line-height: 1.2em;
      font-size: 9pt;
      color: #333;
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
