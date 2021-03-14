<template>
  <el-button
    v-bind="$attrs"
    type="text"
    icon="el-icon-refresh"
    @click="$emit('click')"
  >
    <slot> Atualizar </slot>
  </el-button>
</template>