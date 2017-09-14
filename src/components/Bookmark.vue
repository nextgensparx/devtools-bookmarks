<template>
<li class="tree-item" v-if="model.enabled"
  @click="click"
  @dblclick="dblclick"
  @mouseenter="mouseenter"
  @mouseleave="mouseleave"
  :class="{
  'selected': selected,
  }">
  <div class="selection-fill"></div>
  <span class="icon-wrapper">
    <i class="material-icons md-18">bookmark</i>
  </span>
  <span class="tree-item-name">{{ model.name }}</span>
  <span class="tree-item-url" v-if="isPanel">&nbsp;- {{ model.url }}</span>
  <span class="action" v-if="isPanel && hover" @click="deleteNode"><i class="material-icons md-18">delete</i></span>
</li>
</template>

<script>
/* global chrome */
export default {
  name: 'bookmark',
  props: {
    'model': {
      type: Object,
    },
    'isPanel': Boolean,
  },
  data() {
    return {
      selected: false,
      hover: false,
    };
  },
  mounted() {
    this.bus.$on('select', (id) => {
      if (this.model.id === id) this.select();
    });
    this.bus.$on('deselect-all', () => {
      this.deselect();
    });
    this.bus.$on('select-next', () => {
      if (this.selected) this.selectNext();
    });
  },
  computed: {
    hasChildren() {
      return this.model.children && this.model.children.length;
    },
  },
  methods: {
    deleteNode() {
      this.bus.$emit('delete-node', this.model.id);
    },
    deselect() {
      this.selected = false;
    },
    select() {
      this.selected = true;
    },
    click() {
      this.bus.$emit('deselect-all', this.model.id);
      this.select();
      this.bus.$emit('selected', this.model.id);
    },
    mouseenter() {
      this.hover = true;
    },
    mouseleave() {
      this.hover = false;
    },
    dblclick() {
      chrome.devtools.panels.openResource(this.model.url, parseInt(this.model.lineNumber));
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~styles/vars.scss';

  ol{
    padding-left: 12px;
    list-style-type: none;
  }

  li.tree-item{
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    display: flex;
    align-items: center;
    min-height: 20px;

    .action {
      color: #5a5a5a;
      margin-left: 1em;
      &:hover{
        color: #333;
        background-color: #e5e5e5;
      }
    }

    .tree-item-url{
      color: #919191;
    }

    .icon-wrapper{
      align-self: center;
      display: flex;
      align-items: center;
      padding-right: 4px;
      color: rgba(0, 0, 0, 0.54);
    }

    .selection-fill {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      display: none;
      z-index: -1;
      margin-left: -10000px;
    }

    &:hover{
      .selection-fill{
        display: block;
        background-color: rgba(56, 121, 217, 0.1);
      }
    }

    &.selected{
      color: #fff;
      .tree-item-url{
        color: #c4c4c4;
      }
      .selection-fill{
        display: block;
        background-color: rgb(56, 121, 217);
      }
    }
  }
</style>
