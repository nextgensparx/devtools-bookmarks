<template>
  <div id="app">
    <ol class="tree" role="tree" @keydown="keydown">
      <tree-item :model="root"></tree-item>
    </ol>
  </div>
</template>

<script>
import {bus} from '@/Bus';
import TreeItem from '@/components/TreeItem';

export default {
  name: 'app',
  components: {
    'tree-item': TreeItem,
  },
  data() {
    return {
      selectedTreeElement: null,
      root: {
        id: 0,
        title: 'Root',
        type: 'folder',
        children: [
          {id: 1, title: 'Main', type: 'bookmark', bookmark: {link: 'background.js'}},
          {id: 2, title: 'Resources', type: 'folder', children: [
            {id: 3, title: 'Image', type: 'bookmark', bookmark: {link: 'image.png'}},
          ]},
        ],
      },
    };
  },
  mounted() {
    bus.$on('selected', (item) => {
      this.selectedTreeElement = item;
    });
  },
  methods: {
    selectNext() {

    },
    keydown() {
      /* if (!this.selectedTreeElement || event.target !== this.selectedTreeElement.listItemElement || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }
      let handled = false;
      if (event.key === 'ArrowUp' && !event.altKey) {
        handled = this.selectPrevious();
      } else if (event.key === 'ArrowDown' && !event.altKey) {
        handled = this.selectNext();
      } else if (event.key === 'ArrowLeft') {
        handled = this.selectedTreeElement.collapseOrAscend(event.altKey);
      } else if (event.key === 'ArrowRight') {
        if (!this.selectedTreeElement.revealed()) {
          this.selectedTreeElement.reveal();
          handled = true;
        } else {
          handled = this.selectedTreeElement.descendOrExpand(event.altKey);
        }
      } else if (event.keyCode === 8 || event.keyCode === 46) {
        handled = this.selectedTreeElement.ondelete();
      } else if (isEnterKey(event)) {
        handled = this.selectedTreeElement.onenter();
      } else if (event.keyCode === UI.KeyboardShortcut.Keys.Space.code) {
        handled = this.selectedTreeElement.onspace();
      }*/
    },
  },
};
</script>

<style lang="scss">
@import "~material-design-icons/iconfont/material-icons.css";
@import "~styles/vars";

body{
  margin: 0;
  font-size: 12px;
  color: #222;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  overflow-y: scroll;
  -webkit-user-select: none;
  tab-size: 4;
  cursor: default;
}

/* Rules for sizing the icon. */
.material-icons {
  &.md-18 { font-size: 18px; }
  &.md-24 { font-size: 24px; }
  &.md-36 { font-size: 36px; }
  &.md-48 { font-size: 48px; }

  /* Rules for using icons as black on a light background. */
  &.md-dark { color: rgba(0, 0, 0, 0.54); }
  &.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

  /* Rules for using icons as white on a dark background. */
  &.md-light { color: rgba(255, 255, 255, 1); }
  &.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
}

.tree{
  padding: 0 0 4px 4px;
  margin: 0;
  z-index: 0;
  position: relative;
  list-style-type: none;
}

.bookmark{
  cursor: pointer;
}

.bookmark:hover{
  background-color: rgba(56, 121, 217, 0.1);
}
</style>
