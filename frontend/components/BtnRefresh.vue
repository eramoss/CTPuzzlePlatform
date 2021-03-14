<template>
  <el-tooltip content="Atualizar dados da tela" effect="light">
    <el-button
      v-bind="$attrs"
      type="text"
      icon="el-icon-refresh"
      @click="$emit('click')"
    >
      <slot> Atualizar </slot>
    </el-button>
  </el-tooltip>
</template>