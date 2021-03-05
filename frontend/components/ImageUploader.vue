<template>
  <div>
    <div
      class="avatar-uploader"
      @click="input.click()"
      :style="{ background: `url(${imageUrl})` }"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
        style="display: none"
      />
      <div v-else>
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <i>Dica: Tecle CTRL+V para colar uma imagem</i>
      </div>
    </div>
    <input
      style="display: none"
      type="file"
      ref="fileUpload"
      @change="updateImage"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Ref, VModel, Watch } from "nuxt-property-decorator";
import { $axios } from "~/utils/axios";

@Component
export default class ImageUploader extends Vue {
  imageUrl?: any = "";

  @Ref("fileUpload") input!: any;
  @VModel() imageName!: string;

  get action() {
    return $axios.defaults.baseURL + "/file-upload/upload";
  }

  get fileLocation(): string {
    let location = "";
    if (this.imageName) {
      location =
        $axios.defaults.baseURL + "/file-upload/view/" + this.imageName;
    }
    return location;
  }

  @Watch("imageName", { immediate: true })
  onChangeImageName() {
    this.imageUrl = this.fileLocation;
  }

  async updateImage() {
    let file: File = this.input.files[0];
    try {
      let formData = new FormData();
      formData.append("file", file, file.name);
      let response = await fetch(this.action, {
        method: "POST",
        body: formData,
      });

      let text = await response.text();
      this.imageName = text;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  }

  onPaste(e: ClipboardEvent) {
    this.input.files = e.clipboardData?.files;
    this.updateImage();
  }

  mounted() {
    //@ts-ignore
    window.addEventListener("paste", this.onPaste);
  }

  destroyed() {
    //@ts-ignore
    window.removeEventListener("paste", this.onPaste);
  }
}
</script>
<style lang="scss">
.avatar-uploader {
  display: flex;
  align-content: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  width: 280px;
  height: 170px;
  background-position: center !important;
  background-size: cover !important;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 170px;
  line-height: 170px;
  text-align: center;
}
</style>
