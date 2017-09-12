/* global chrome */

chrome.devtools.panels.create('Bookmarks', '', './panel.html', (panel) => {
  panel.onShown.addListener((panelWindow) => {
    panelWindow.postMessage({from: 'devtools-bookmarks', type: 'load', isPanel: true}, '*');
  });
});

chrome.devtools.panels.sources.createSidebarPane('Bookmarks', (sidebarPane) => {
  sidebarPane.setPage('./panel.html');
  sidebarPane.onShown.addListener((sideBarWindow) => {
    sideBarWindow.postMessage({from: 'devtools-bookmarks', type: 'load', isPanel: false}, '*');
  });
});
