<template>
  <el-tooltip content="Voltar" effect="light">
    <el-button
      v-bind="$attrs"
      icon="el-icon-arrow-left"
      @click="$emit('click')"
    >
      <slot> Voltar </slot>
    </el-button>
  </el-tooltip>
</template>