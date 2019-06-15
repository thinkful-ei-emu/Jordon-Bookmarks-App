/* global $*/
'use strict';

//API

const API = (function() {
  //BASE_URL
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Jordon';

  //CREATE
  const createBookmark = function(newBookmarkData, onSuccess, onError) {
    //Change the text of a <div> element using an AJAX request
    $.ajax({
      url: BASE_URL + '/bookmarks',
      //If a form is sent using this method, the data is appended to the body of the HTTP request
      method: 'POST',
      contentType: 'application/json',
      data: newBookmarkData,
      success: onSuccess,
      error: onError
    });
  };
  //GET
  const getBookmarks = function(callback) {
    //through the requested data, builds an unordered list, and appends it to the body.
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };
  //UPDATE
  const updateBookmark = function(id, updateData, callback) {
    //Change the text of a <div> element using an AJAX request
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      //The HTTP PATCH request method applies partial modifications to a resource
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback
    });
  };
  //DELETE
  const deleteBookmark = function(id, callback) {
    //Change the text of a <div> element using an AJAX request
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
    });
  };

  //expose functions
  return {
    createBookmark,
    getBookmarks,
    updateBookmark,
    deleteBookmark
  };
})();
