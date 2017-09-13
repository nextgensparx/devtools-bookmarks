<template>
<li class="tree-item"
  ref="item"
  @click="click"
  @focus="focus"
  @blur="blur"
  :class="{
  'selected': selected,
  'focused': focused,
  }">
  <div class="selection-fill"></div>
  <span class="icon-wrapper">
    <i class="material-icons md-18">bookmark</i>
  </span>
  <span class="bookmark-name">{{ model.name }} {{ model.link }}</span>
</li>
</template>

<script>
export default {
  name: 'bookmark',
  props: {
    'model': {
      type: Object,
    },
  },
  data() {
    return {
      selected: false,
      focused: false,
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
      this.bus.$emit('deselect-all', this.model.id);
      this.select();
      this.bus.$emit('selected', this.model.id);
    },
    focus() {
      this.focused = true;
    },
    blur() {
      this.focused = false;
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
