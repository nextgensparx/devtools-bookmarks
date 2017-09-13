<template>
  <div id="app">
    <div v-if="!loading">
      <toolbar v-if="isPanel" @addBookmark="addBookmark"></toolbar>
      <ol class="tree" role="tree">
        <bookmark v-for="bookmark in bookmarks"
         :key="bookmark.id"
         :model="bookmark"></bookmark>
      </ol>
    </div>
  </div>
</template>

<script>
/* global chrome */
import Bookmark from '@/components/Bookmark.vue';
import Toolbar from '@/components/Toolbar.vue';

export default {
  name: 'app',
  components: {
    'bookmark': Bookmark,
    'toolbar': Toolbar,
  },
  data() {
    return {
      loading: true,
      isPanel: null,
      lastId: 0,
      bookmarks: [],
    };
  },
  mounted() {
    window.addEventListener('message', (event) => {
      if (event.data.from === 'devtools-bookmarks' && event.data.type === 'load') {
        this.isPanel = event.data.isPanel;
        this.loading = false;
      }
    });
    chrome.storage.sync.get('bookmarks', (data) => {
      if (data.bookmarks) {
        this.bookmarks = data.bookmarks;
      }
    });
  },
  watch: {
    bookmarks: {
      handler: (value) => {
        let json = JSON.parse(JSON.stringify(value));
        chrome.storage.sync.set({bookmarks: json}, function() {
          // TODO: Handle save error
        });
      },
      deep: true,
    },
  },
  methods: {
    addBookmark(name, file, lineNumber) {
      this.bookmarks.push({id: this.lastId++, name, file, lineNumber});
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
