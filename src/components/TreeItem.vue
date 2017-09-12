<template>
<div class="tree-item-wrapper">
  <li role="treeitem" class="tree-item"
    ref="item"
    @click="click"
    @focus="focus"
    @blur="blur"
    :class="{
    'has-children': hasChildren,
    'selected': selected,
    'focused': focused,
    'open': open,
    'folder': model.type === 'folder',
    }">
    <div class="selection-fill"></div>
    <!--Dropdown icon-->
    <div class="dropdown-icon" @click="toggle">
      <i class="material-icons md-18">arrow_drop_down</i>
    </div>
    <!--Folder or file icon-->
    <span class="icon-wrapper" v-if="model.type">
      <i class="material-icons md-18">{{ isFolder ? 'folder' : 'bookmark' }}</i>
    </span>
    <span class="tree-item-title">{{ model.title }} {{ model.link }}</span>
  </li>
  <ol v-show="open" role="group">
    <tree-item
      v-for="child in model.children"
      :key="child.id"
      :model="child">
    </tree-item>
  </ol>
</div>
</template>

<script>
import Vue from 'vue';
import {bus} from '@/Bus';
export default {
  name: 'tree-item',
  props: {
    'model': {
      type: Object,
      validator: function(m) {
        if (!('id' in m)) {
          console.error('Invalid model: an id is required');
          return false;
        }
        if (typeof m.id !== 'number') {
          console.error('Invalid model: id provided must be numeric');
          return false;
        }
        if ('title' in m && typeof m.title !== 'string') {
          console.error('Invalid model: title must be string');
          return false;
        }
        if ('type' in m && typeof m.type !== 'string') {
          console.error('Invalid model: type must be string');
          return false;
        }
        let types = ['folder', 'bookmark'];
        if (!(types.includes(m.type))) {
          console.error('Invalid model: type must be one of the following: '+types.join(', ')+' found '+m.type);
          return false;
        }
        if ('children' in m && !Array.isArray(m.children)) {
          console.error('Invalid model: children must be array');
          return false;
        }
        return true;
      },
    },
  },
  data() {
    return {
      open: false,
      selected: false,
      focused: false,
    };
  },
  mounted() {
    bus.$on('deselect-all', () => {
      this.deselect();
    });
    if (this.isFolder) {
      Vue.set(this.model, 'children', []);
    }
  },
  computed: {
    isFolder() {
      return this.model.type === 'folder';
    },
    hasChildren() {
      return this.model.children && this.model.children.length;
    },
  },
  methods: {
    addNode(node) {
      this.model.children.push(node);
      if (!this.open) {
        this.open = true;
      }
    },
    addBookmark(bookmark) {
      if (this.isFolder) {
        this.addNode(bookmark);
      }
    },
    addFolder(folder) {
      if (this.isFolder) {
        this.addNode(folder);
      }
    },
    deselect() {
      this.selected = false;
      this.$refs.item.setAttribute('tabindex', null);
    },
    select() {
      this.selected = true;
      this.$refs.item.setAttribute('tabindex', 0);
      this.$refs.item.focus();
    },
    click() {
      bus.$emit('deselect-all', this);
      this.select();
      bus.$emit('selected', this);
    },
    focus() {
      this.focused = true;
    },
    blur() {
      this.focused = false;
    },
    toggle() {
      this.open = !this.open;
    },
    collapseOrAscend() {

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

    .dropdown-icon{
      display: flex;
      align-items: center;
      color: transparent;
      text-shadow: none;
      margin-right: -2px;
      height: 12px;
    }


    &.has-children{
      .dropdown-icon{
        color: rgb(110, 110, 110);
        .material-icons{
          transform: rotate(-90deg);
        }
      }

      &.open .dropdown-icon .material-icons{
        transform: rotate(0deg);
      }
    }

    .icon-wrapper{
      align-self: center;
      display: flex;
      align-items: center;
      padding-right: 4px;
      color: rgba(0, 0, 0, 0.54);
    }

    &.folder .icon-wrapper{
      .material-icons{
        color: hsl(210, 82%, 70%);
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
      .selection-fill{
        display: block;
        background-color: #ddd;
      }
      &.focused{
        color: #fff;
        .selection-fill{
          background-color: rgb(56, 121, 217);
        }
      }
    }
  }
</style>
