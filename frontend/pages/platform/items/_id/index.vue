<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/platform/items' }"
        >Itens de teste</el-breadcrumb-item
      >
      <el-breadcrumb-item>Edição</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Edição de item de testes</h2>
      <el-form :model="item" :rules="formRules" ref="form">
        <el-row>
          <el-col>
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item
                  label="Nome"
                  title="Nome"
                  prop="name"
                  required=""
                  label-width="170px"
                >
                  <el-input
                    ref="nameInput"
                    v-model="item.name"
                    autofocus
                    placeholder="Fase de programação fácil"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Tipo de mecânica"
                  label-width="170px"
                  prop="mechanic"
                >
                  <el-row>
                    <el-col :span="item.mechanic ? 21 : 24">
                      <el-select
                        value-key="id"
                        v-model="item.mechanic"
                        class="fill"
                        filterable
                      >
                        <el-option
                          v-for="m in availableMechanics"
                          :key="m.id"
                          :value="m"
                          :label="m.name"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="3" v-if="item.mechanic">
                      <nuxt-link
                        :to="`/platform/mechanics/${item.mechanic.id}`"
                      >
                        <el-button
                          :disabled="!item.mechanic"
                          type="text"
                          icon="el-icon-top-right"
                        >
                          Acessar
                        </el-button>
                      </nuxt-link>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item
                  prop="description"
                  label="Descrição"
                  title="Descrição da mecânica"
                  label-width="170px"
                >
                  <el-input
                    type="textarea"
                    v-model="item.description"
                    autofocus
                    placeholder="Informações sobre o desafio presente no item"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Tutorial" label-width="170px">
                  <el-checkbox v-model="item.isTutorial"
                    >Este é um item de tutorial
                    <el-tooltip
                      effect="light"
                      content="Itens de tutorial não contam pontos"
                      ><i class="el-icon-question" /> </el-tooltip
                  ></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item title="Ilustração da mecânica">
                  <FormItemLabel label="Ilustração do item" />
                  <ImageUploader v-model="item.thumbnail" />
                </el-form-item>
              </el-col>
            </el-row>

            <MessageAlert type="info">
              A configuração do item deve obedecer as especificações definidas
              na mecânica. <br />
              O objeto json/TypeScript configurado deve ser utilizado pelo
              desenvolvedor no momento de instanciar o item do teste.
            </MessageAlert>

            <el-form-item prop="itemDefinition">
              <FormItemLabel label="Especificação do item" :required="true" />
              <el-row :gutter="10">
                <el-col :span="8" v-if="item.mechanic">
                  <code-editor
                    :uniqueId="`mechanicClassDefinition${item.id}`"
                    editor-title="Classe da mecânica"
                    :font-size="13"
                    :readonly="true"
                    v-model="item.mechanic.classDefinition"
                  >
                  </code-editor>
                </el-col>
                <el-col :span="16">
                  <code-editor
                    :uniqueId="`item.itemDefinition${item.id}`"
                    id="instantiate"
                    editor-title="Instanciação do item"
                    :disabled="!item.mechanic"
                    language="typescript"
                    v-model="item.itemDefinition"
                    height="500px"
                    @input="form.validateField('itemDefinition')"
                  >
                    <template v-slot:bar>
                      <el-tooltip
                        effect="light"
                        :open-delay="300"
                        content="Testar item no ambiente do puzzzle"
                      >
                        <el-button
                          @click="testOpenItem"
                          type="success"
                          icon="el-icon-video-play"
                        >
                          Testar
                        </el-button>
                      </el-tooltip>
                    </template>
                  </code-editor>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <btn-save @click="save" />
            <btn-back @click="back"></btn-back>
            <el-button
              type="primary"
              @click="duplicateItem"
              icon="el-icon-copy-document"
              title="Cria um novo item igual a este para servir de base"
              >Fazer uma cópia</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Ref, Component, Action } from "nuxt-property-decorator";
import Mechanic from "@/types/Mechanic";
import CodeEditor from "~/components/CodeEditor.vue";
import Item, { createExampleItem } from "~/types/Item";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";
import { ElForm } from "element-ui/types/form";
import queryString from "~/utils/utils";

@Component({
  head: {
    title: "Itens de teste",
  },
  components: {
    CodeEditor,
  },
})
export default class ItemEditForm extends Vue {
  item!: Item;
  availableMechanics: Mechanic[] = [];
  saving: boolean = false;

  @Ref("nameInput") nameInput!: ElInput;
  @Ref("form") form!: ElForm;

  get formRules() {
    return {
      name: {
        required: true,
        message: "Informe o nome do item",
        trigger: "blur",
      },
      mechanic: {
        required: true,
        message: "Informe a mecânica",
        trigger: "change",
      },
      description: {
        required: true,
        message: "Informe a descrição do item",
        trigger: "blur",
      },
      itemDefinition: {
        required: true,
        message: "Informe a definição do item",
      },
    };
  }

  async asyncData(ctx: Context) {
    let item;
    let id = ctx.params.id;
    if (id == "new") {
      item = createExampleItem();
    }
    if (id != "new") {
      item = await ctx.store.dispatch("items/getById", id);
    }
    let availableMechanics = await ctx.store.dispatch("mechanics/findAll");
    return { item: item, availableMechanics };
  }

  @Action("items/save") saveItem!: (item: Item) => Promise<Item>;

  async save() {
    if (!(await this.form.validate())) {
      return;
    }
    this.saving = true;
    try {
      this.item = await this.saveItem(this.item);
      this.$notify({
        type: "success",
        title: "Sucesso ao salvar o item de teste!",
        message: "Agora você já pode criar testes com esse item",
      });
      this.$router.push({ params: { id: this.item.id + "" } });
      //this.back();
    } catch (e) {
      console.error(e);
      this.$notify({
        type: "error",
        title: "Não foi possível salvar o item!",
        message: "Ocorreu uma falha ao salvar",
      });
    } finally {
      this.saving = false;
    }
  }

  duplicateItem() {
    if (!this.item.id) {
      this.$alert(
        "Para duplicar o item, é necessário antes salvá-lo. <br>Dica: Para salvar, você pode utilizar o atalho <br><b><h2>Ctrl + S<h2></b>",
        {
          dangerouslyUseHTMLString: true,
          title: "Salve o item para poder duplicá-lo.",
          confirmButtonText: "Entendi",
          showCancelButton: false,
          type: "error",
        }
      );
      return;
    }
    this.item.id = 0;
    this.item.name = "Cópia " + this.item.name;
    this.$notify({
      type: "success",
      title: "O item foi copiado",
      message: "Altere o que for necessário no item atual",
    });
    window.scrollTo(0, 0);
    this.$nextTick(() => {
      this.nameInput?.focus();
      this.nameInput?.select();
    });
  }

  testOpenItem() {
    if (!this.item.mechanic) {
      this.$notify({
        type: "error",
        title: "Não foi possível abrir o item",
        message:
          "Para rodar o item, é necessário selecionar uma mecânica válida, com url base do aplicativo que vai abrir o item configurado",
      });
      return;
    }

    if (!this.item.mechanic.baseUrl) {
      this.$notify({
        type: "error",
        title: "Não existe o endereço base do aplicativo",
        message:
          "A mecânica não possui uma url base do aplicativo que deve apresentar a o item configurado",
      });
      return;
    }

    if (!this.item.id) {
      this.$notify({
        type: "error",
        title: "Salve o item",
        message: "Para testar o item é necessário salvá-lo na base de dados",
      });
      return;
    }

    let appBaseUrl = this.item.mechanic.baseUrl;
    let serverBaseUrl = this.$axios.defaults.baseURL;
    let testItemNumber = this.item.id;
    let urlToInstantiateItem = `${serverBaseUrl}/items/public/instantiate/${testItemNumber}`;
    let qs = queryString({ op: "playground", urlToInstantiateItem });
    window.open(`${appBaseUrl}?${qs}`, "_blank");
  }

  back() {
    this.$router.push("/platform/items");
  }

  mounted() {
    this.nameInput?.focus();
  }
}
</script>
