'use strict';

//STORE function
// - functions needed to alter current state of store
// - return store defaults/ functions

const STORE = (function() {
  //functions for STORE

  //error message
  const setErrorMessage = function(error) {
    this.errorMessage = error;
  };

  //form expanded
  const toggleFormExpanded = function() {
    this.formExpanded = !this.formExpanded;
  };

  //add bookmark
  const addBookmark = function(bookmark) {
    this.items.push(bookmark);
  };

  //find by id
  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  //expanded bookmark
  const expandBookmark = function(id) {
    const selectedBookmark = this.findById(id);
    selectedBookmark.expanded = !selectedBookmark.expanded;
  };

  // find and delete bookmark
  const findAndDelete = function(id) {
    //Filter item id we're pointing to id 
    this.items = this.items.filter(item => item.id !== id);
  };

  // filter by rating
  const setFilterBy = function(rating) {
    this.filterBy = rating;
  };

  return {
    items: [],
    errorMessage: null,
    formExpanded: false,
    filterBy: 0,

    setErrorMessage,
    toggleFormExpanded,
    addBookmark,
    findById,
    findAndDelete,
    setFilterBy,
    expandBookmark
  };
})();
