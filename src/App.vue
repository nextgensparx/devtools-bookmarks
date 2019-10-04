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
    chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener((resource) => {
      // TODO: Check performance
      this.refreshBookmarks();
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
    findBookmarks(resource) {
      return new Promise((resolve, reject) => {
        resource.getContent((content, encoding) => {
          if (content) {
            const bookmarks = [];
            const lines = content.split(/\n/);
            lines.forEach(function(line, lineNumber) {
              const captureGroups = line.match(/\/\/(.*)bookmark:(.+)/i, '');
              if (captureGroups && captureGroups.length > 1) {
                bookmarks.push({
                  name: captureGroups[2],
                  lineNumber,
                });
              }
            });
            resolve(bookmarks);
          } else {
            reject(new Error('resource is empty'));
          }
        });
      });
    },
    refreshBookmarks() {
      chrome.devtools.inspectedWindow.getResources((resources) => {
        const resourceUrls = [];
        const inlineBookmarks = [];
        let promises = [];
        for (let resource of resources) {
          promises.push(this.findBookmarks(resource).then((bookmarks) => {
            if (bookmarks.length > 0) {
              inlineBookmarks.push({resource, bookmarks});
            }
          }));
          resourceUrls.push(resource.url);
        }
        // Wait for async requests
        Promise.all(promises).then(() => {
          for (let inlineBookmark of inlineBookmarks) {
            for (let bookmark of inlineBookmark.bookmarks) {
              this.addBookmark(bookmark.name,
                inlineBookmark.resource.url,
                bookmark.lineNumber + 1,
                true);
            }
          }
          Vue.set(this, 'resources', resourceUrls);
          for (let i=0; i<this.bookmarks.length; i++) {
            let bookmark = this.bookmarks[i];
            Vue.set(this.bookmarks[i], 'enabled', resourceUrls.includes(bookmark.url));
          }
        });
      });
    },
    addBookmark(name, url, lineNumber, auto) {
      let exists = false;
      for (let bookmark of this.bookmarks) {
        if (bookmark.url === url
        && bookmark.name === name
        && bookmark.lineNumber === lineNumber) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.bookmarks.push({id: this.lastId++, name, url, lineNumber, auto});
        this.refreshBookmarks();
      }
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
  user-select: none;
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
  /*padding: 0 0 4px 4px;*/
  padding: 0;
  margin: 0;
  z-index: 0;
  position: relative;
  list-style-type: none;
}

</style>
