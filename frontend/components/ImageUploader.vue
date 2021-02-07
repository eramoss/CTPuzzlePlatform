<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "nuxt-property-decorator";
import { $axios } from "~/utils/axios";

@Component
export default class ImageUploader extends Vue {
  imageUrl: string = "";

  get action() {
    return $axios.defaults.baseURL + "/file-upload/upload";
  }

  handleAvatarSuccess(res: any, file: any) {
    this.imageUrl = URL.createObjectURL(file.raw);
  }

  beforeAvatarUpload(file: any) {
    //const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    /* if (!isJPG) {
      this.$message.error("Avatar picture must be JPG format!");
    } */
    if (!isLt2M) {
      this.$message.error("A imagem não pode ter tamanho maior que 2MB!");
    }
    //return isJPG &&
    return isLt2M;
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 220px;
  height: 170px;
  line-height: 170px;
  text-align: center;
}
.avatar {
  width: 220px;
  height: 170px;
  display: block;
}
</style>
