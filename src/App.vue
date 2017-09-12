<template>
  <div id="app">
    <div v-if="!loading">
      <toolbar v-if="isPanel" @addBookmark="addBookmark" @addFolder="addFolder"></toolbar>
      <ol class="tree" role="tree" @keydown="keydown">
        <tree-item :model="tree"></tree-item>
      </ol>
    </div>
  </div>
</template>

<script>
/* global chrome */
import {bus} from '@/Bus';
import TreeItem from '@/components/TreeItem';
import Toolbar from '@/components/Toolbar';

export default {
  name: 'app',
  components: {
    'tree-item': TreeItem,
    'toolbar': Toolbar,
  },
  data() {
    return {
      loading: true,
      isPanel: null,
      lastId: 0,
      selectedTreeElement: null,
      tree: {
        id: 0,
        title: 'Root',
        type: 'folder',
        children: [],
      },
    };
  },
  mounted() {
    window.addEventListener('message', (event) => {
      if (event.data.from === 'devtools-bookmarks' && event.data.type === 'load') {
        this.isPanel = event.data.isPanel;
        this.loading = false;
      }
    });
    chrome.storage.sync.get('tree', (data) => {
      this.tree = data.tree;
    });
    bus.$on('selected', (item) => {
      this.selectedTreeElement = item;
    });
  },
  watch: {
    tree: {
      handler: (treeValue) => {
        let treeJson = JSON.parse(JSON.stringify(treeValue));
        chrome.storage.sync.set({tree: treeJson}, function() {
          // TODO: Handle save error
        });
      },
      deep: true,
    },
  },
  methods: {
    addBookmark(file, lineNumber) {
      this.selectedTreeElement.addBookmark({id: this.lastId++, title: file, type: 'bookmark'});
    },
    addFolder(title) {
      this.selectedTreeElement.addFolder({id: this.lastId++, title: title, type: 'folder'});
    },
    selectPrevious() {

    },
    selectNext() {

    },
    keydown(event) {
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

</style>
