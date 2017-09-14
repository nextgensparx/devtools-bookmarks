<template>
  <div id="app">
    <div v-if="!loading">
      <toolbar v-if="isPanel" @addBookmark="addBookmark" :resources="resources"></toolbar>
      <ol class="tree" role="tree">
        <bookmark v-for="bookmark in bookmarks"
         :key="bookmark.id"
         :model="bookmark"
         :isPanel="isPanel"></bookmark>
      </ol>
      <span v-if="error" class="error">{{ error }}</span>
    </div>
  </div>
</template>

<script>
/* global chrome */
import Vue from 'vue';
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
      error: null,
      isPanel: null,
      lastId: 0,
      bookmarks: [],
      resources: [],
    };
  },
  mounted() {
    window.addEventListener('message', (event) => {
      if (event.data.from === 'devtools-bookmarks' && event.data.type === 'load') {
        this.isPanel = event.data.isPanel;
        this.loading = false;

        chrome.storage.sync.get('bookmarks', (data) => {
          if (data.bookmarks) {
            this.bookmarks = data.bookmarks;
          }
          this.refreshBookmarks();
        });
      }
    });
    chrome.devtools.inspectedWindow.onResourceAdded.addListener((resource) => {
      if (resource.url.indexOf('debugger') !== 0) {
        // TODO: Check performance
        this.refreshBookmarks();
      }
    });
    this.bus.$on('delete-node', (id) => {
      this.removeBookmark(id);
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
    refreshBookmarks() {
      chrome.devtools.inspectedWindow.getResources((resources) => {
        let resourceUrls = [];
        for (let resource of resources) {
          resourceUrls.push(resource.url);
        }
        Vue.set(this, 'resources', resourceUrls);
        for (let bookmark of this.bookmarks) {
          Vue.set(bookmark, 'enabled', resourceUrls.includes(bookmark.url));
        }
      });
    },
    addBookmark(name, url, lineNumber) {
      this.bookmarks.push({id: this.lastId++, name, url, lineNumber});
      this.refreshBookmarks();
    },
    getBookmarkIndex(id) {
      for (let index in this.bookmarks) {
        if (this.bookmarks[index].id === id) return index;
      }
      return null;
    },
    removeBookmark(id) {
      this.bookmarks.splice(this.getBookmarkIndex(id), 1);
      this.refreshBookmarks();
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
