<template>
<div class="toolbar">
  <div class="toolbar-divider toolbar-item"></div>
  <div class="toolbar-item toolbar-input">
    <input v-model="title" type="text" placeholder="Title">
  </div>
  <div class="toolbar-divider toolbar-item"></div>
  <div class="toolbar-item toolbar-input">
    <input v-model="file" type="text" placeholder="File">
  </div>
  <div class="toolbar-divider toolbar-item"></div>
  <div class="toolbar-item toolbar-input">
    <input v-model="lineNumber" type="number" placeholder="Line number">
  </div>
  <button class="toolbar-button toolbar-item" @click="addBookmark"><i class="material-icons md-18">add</i></button>
  <button class="toolbar-button toolbar-item" @click="addFolder"><i class="material-icons md-18">create_new_folder</i></button>
</div>
</template>

<script>
export default {
  name: 'toolbar',
  data() {
    return {
      title: '',
      file: '',
      lineNumber: null,
    };
  },
  methods: {
    addBookmark() {
      this.$emit('addBookmark', this.file, this.lineNumber);
    },
    addFolder() {
      this.$emit('addFolder', this.title);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~styles/vars.scss';

  .toolbar{
    border-bottom: 1px solid #dadada;
    position: relative;
    height: 26px;
    display: flex;
    flex: none;
    align-items: center;

    .toolbar-item {
      position: relative;
      display: flex;
      background-color: transparent;
      flex: none;
      align-items: center;
      justify-content: center;
      padding: 0;
      height: 26px;
      border: none;
      color: #5a5a5a;
    }

    .toolbar-button{
      white-space: nowrap;
      overflow: hidden;
      min-width: 28px;
      background: transparent;
    }

    .toolbar-input{
      input {
        border: solid 1px #d8d8d8;
      }
    }

    .toolbar-divider{
      background-color: #ccc;
      width: 1px;
      margin: 5px 4px;
      height: 16px;
    }
  }
</style>
