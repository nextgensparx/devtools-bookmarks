<template>
<li class="tree-item"
  v-if="model.enabled"
  @click="click"
  @mouseenter="mouseenter"
  @mouseleave="mouseleave"
  :class="{
  'selected': selected,
  'auto' : model.auto
  }">
  <div class="selection-fill"></div>
  <span class="icon-wrapper">
    <i class="material-icons md-18" :class="{auto : model.auto}">bookmark</i>
    <!-- <i class="material-icons md-18" v-if="model.enabled">radio_button_checked</i>
    <i class="material-icons md-18" v-else>radio_button_unchecked</i> -->
  </span>
  <span @dblclick="dblclick" class="tree-item-text">
    <span class="tree-item-name">{{ model.name }}</span>
    <span class="tree-item-url">
      <template v-if="isPanel">
        {{ model.url }}
      </template>
      <template v-else>
        {{ model.url.substring(model.url.lastIndexOf('/')+1) }}
      </template>
      : {{ model.lineNumber }}
    </span>
  </span>
  <span class="action" v-if="isPanel && !model.auto" @click="deleteNode"><i class="material-icons md-18">delete</i></span>
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
      chrome.devtools.panels.openResource(this.model.url, parseInt(this.model.lineNumber) - 1);
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
      align-self: right;
      color: #5a5a5a;
      // margin-left: 1em;
      margin-left: auto;
      &:hover{
        color: #333;
        background-color: #e5e5e5;
      }
    }

    .tree-item-text{
      display: flex;
      width: 100%;

      .tree-item-name{
        margin-right: 1em;
      }

      .tree-item-url{
        margin-left: auto;
        margin-right: 1em;
        color: #919191;
      }
    }

    .icon-wrapper{
      align-self: center;
      display: flex;
      align-items: center;
      padding-right: 4px;
      color: rgba(0, 0, 0, 0.54);
      .auto {
        color: #3dc41b;
      }
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
