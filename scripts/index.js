/* global $, bookmarkList, API, STORE*/
'use strict';

//DOM
function start() {
  bookmarkList.bindEventListeners();
  bookmarkList.render();
//ADD
  API.getBookmarks(items => {
    items.forEach(item => STORE.addBookmark(item));
    bookmarkList.render();
  });
}
$(start);
