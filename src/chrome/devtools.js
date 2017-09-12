// 'chrome-extension://dgbhkkhkfailmipnaakpnccgelnbjpdp/background.js'

/* let revealable = {
  columnNumber:99,
  lineNumber:1296,
  uiSourceCode: uiSourceCode
}*/

// var uiSourceCode = project.uiSourceCodeForURL('chrome-extension://dgbhkkhkfailmipnaakpnccgelnbjpdp/background.js');
/* var uiSourceCode = Workspace.workspace.uiSourceCodeForURL('chrome-extension://dgbhkkhkfailmipnaakpnccgelnbjpdp/background.js');

function createAnchor(uiSourceCode, lineNumber, columnNumber) {
  return Components.Linkifier.linkifyRevealable(uiSourceCode.uiLocation(lineNumber, columnNumber), '');
}

var anchor = createAnchor(uiSourceCode, 1296, 99);
console.log(anchor);*/

function createBookmarkContent(bookmark) {
  let el = document.createElement('div');
  el.classList.add('bookmark');

  let primaryContent = document.createElement('span');
  primaryContent.classList.add('mdl-list__item-primary-content');

  let header = document.createElement('span');
  header.textContent = bookmark.title;
  primaryContent.appendChild(header);

  let body = document.createElement('span');
  body.classList.add('mdl-list__item-text-body');
  body.textContent = new URL(bookmark.url).pathname + ':' + bookmark.lineNumber;
  primaryContent.appendChild(body);

  el.appendChild(primaryContent);

  let secondaryContent = document.createElement('span');
  secondaryContent.classList.add('mdl-list__item-secondary-action');
  let editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect', 'mdl-list__item-secondary-action');
  secondaryContent.appendChild(editButton);

  el.appendChild(secondaryContent);

  return el;
}

function createBookmarkListItem(bookmark) {
  let item = document.createElement('li');
  item.classList.add('mdl-list__item', 'mdl-list__item--three-line');
  item.setAttribute('data-url', bookmark.url);
  item.setAttribute('data-line', bookmark.lineNumber);
  item.setAttribute('data-column', bookmark.column);
  let newBookmarkContent = createBookmarkContent(bookmark);
  item.appendChild(newBookmarkContent);
  return item;
}

let bookmarks = [
  {title: 'Main code', url: 'chrome-extension://dgbhkkhkfailmipnaakpnccgelnbjpdp/background.js', lineNumber: 12, column: null},
];
chrome.devtools.panels.create('Bookmarks', '', './panel.html', function(panel) {
  let runOnce = false;
  panel.onShown.addListener(function(panelWindow) {
    // This runs everytime it's opened
    /* const bookmarksList = panelWindow.document.querySelector('.bookmarks-list');
    bookmarksList.innerHTML = '';
    bookmarks.forEach((bookmark) => {
      let newBookmark = createBookmarkListItem(bookmark);
      bookmarksList.appendChild(newBookmark);

      newBookmark.addEventListener('click', function(e) {
        e.preventDefault();
        let url = this.getAttribute('data-url');
        let lineNumber = this.getAttribute('data-line');
        let column = this.getAttribute('data-column');
        chrome.devtools.panels.openResource(url, lineNumber);
      });
    });

    if (runOnce) return;
    runOnce = true;*/
  });
});
chrome.devtools.panels.sources.createSidebarPane('Bookmarks', function(sidebarPane) {
  sidebarPane.setPage('./panel.html');
});
