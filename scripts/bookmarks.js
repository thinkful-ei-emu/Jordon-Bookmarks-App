/* global $, API, STORE*/
'use strict';


// bookmarkList function

// All my functions that handle my bookmarks

const bookmarkList = (function() {
  //FOR FORMS -- JQuery library edit extends library to give me an object with
  $.fn.extend({
    //Returns a string that contains a JSON representation
    serializeJson: function() {
      // The FormData() constructor creates a new FormData object.
      const formData = new FormData(this[0]);
      const obj = {};
      //FormData only has .forEach available to it
      formData.forEach((val, name) => (obj[name] = val));
      // The JSON.stringify() method converts a JavaScript object or value to a JSON string
      return JSON.stringify(obj);
    }
  });

  // create error messsage
  function generateError(error) {
    let message = '';
    if (error.responseJSON && error.responseJSON.message) {
      message = error.responseJSON.message;
    } else {
      message = `${error.code} Server Error`;
    }
    return `  
		<div class="col-12">
    	<p>${message}</p>
  	</div>`;
  }

  //generate HTML for bookmark elements
  function generateBookmarkElement(bookmark) {
    // star rating system
    const emptyStar = `<span class="icon">★</span>`;
    const checkedStar = `<span class="icon checked">★</span>`;
    let generateStars = emptyStar.repeat(5);

    const starRating = bookmark.rating;
    
    if (starRating === 5) {
      generateStars = `${checkedStar.repeat(5)}`;
    } else if (starRating === 4) {
      generateStars = `${checkedStar.repeat(4)} ${emptyStar.repeat(1)}`;
    } else if (starRating === 3) {
      generateStars = `${checkedStar.repeat(3)} ${emptyStar.repeat(2)}`;
    } else if (starRating === 2) {
      generateStars = `${checkedStar.repeat(2)} ${emptyStar.repeat(3)}`;
    } else if (starRating === 1) {
      generateStars = `${checkedStar.repeat(1)} ${emptyStar.repeat(4)}`;
    }

    // const holding html
    let bookmarkDesc = '';
    if (bookmark.desc) {
      bookmarkDesc = bookmark.desc;
    }
    const extendedBookmarkElements = `
		<li id="${bookmark.id}" class="expanded">
			<button aria-label="close ${bookmark.title} bookmark that has ${
    bookmark.rating
  } stars" class="bookmark-link js-bookmark-link">
			<h2>${bookmark.title}</h2>
			<div class="rated-stars">${generateStars}</div>
			</button>
			<p aria-label="description of bookmark" class="description">${bookmarkDesc}</p>
		
				<button aria-label="delete bookmark" class="delete-bookmark js-delete-bookmark">Delete</button>
			<!--	<button aria-label="edit bookmark" class="edit-bookmark js-edit-bookmark">edit</button> -->

			<a href="${bookmark.url}" target="blank" class="btn" aria-label="Visit ${
    bookmark.title
  } URL">Visit site</a>

</li>`;

    //if expanded state expand!
    if (bookmark.expanded) {
      return `
			${extendedBookmarkElements}
			`;
    }

    //return html
    return `
    <li id="${bookmark.id}" class="">
			<button aria-label="${bookmark.title} bookmark that has ${
    bookmark.rating
  } stars" class="bookmark-link js-bookmark-link">
			<h2>${bookmark.title}</h2>
			<div class="rated-stars" aria-label="${
  bookmark.rating
  } stars">${generateStars}</div>
			</button>
    </li>`;
  }

  //generate string of HTML from bookmark elements array
  function generateBookmarkElementsString(bookmarks) {
    const bookmarksString = bookmarks.map(bookmark => {
      //console.log(bookmark);
      return generateBookmarkElement(bookmark);
    });

    return bookmarksString.join('');
  }

  // generate HTML for add bookmark form

  function generateAddBookmarkForm() {
    const star = `<span class="icon">★</span>`;
    return `
		<!--add item form-->
		<div id="bookmark-form-wrapper">
				<!--title-->
				<label for="bookmark-title-entry">What is the title? *</label>
				<input type="text" name="title" id="bookmark-title-entry" placeholder="The title goes here">
				<!--rating-->
				<label for="bookmark-rating">How would you rate it?</label>
				<div name="rating" id="bookmark-rating" class="rating form-rating">
						<label>
								<input type="radio" name="rating" value="1" />
								<span class="icon">★</span>
						</label>
						<label>
								<input type="radio" name="rating" value="2" />
								<span class="icon">★</span>
								<span class="icon">★</span>
						</label>
						<label>
								<input type="radio" name="rating" value="3" />
								<span class="icon">★</span>
								<span class="icon">★</span>
								<span class="icon">★</span>
						</label>
						<label>
								<input type="radio" name="rating" value="4" />
								<span class="icon">★</span>
								<span class="icon">★</span>
								<span class="icon">★</span>
								<span class="icon">★</span>
						</label>
						<label>
								<input type="radio" name="rating" value="5" />
								<span class="icon">★</span>
								<span class="icon">★</span>
								<span class="icon">★</span>
								<span class="icon">★</span>
								<span class="icon">★</span>
						</label>
				</div>
				<label for="bookmark-description-entry">What is the description?</label>
				<textarea name="desc" id="bookmark-description-entry" placeholder="The description goes here"></textarea>
				<label for="bookmark-url-entry">What is the URL? *</label>
				<input type="text" name="url" id="bookmark-url-entry" placeholder="http://example.com">

				<!--required note *-->
				<p>* required fields</p>
		</div>
		<!--SUBMIT-->
		<button type="submit" class="btn submit">submit</button>
		`;
  }

  //Render

  function render() {
    let currentSTORE = STORE.items;

    //if error render error message on page & reset store to empty error message
    if (STORE.errorMessage) {
      const err = generateError(STORE.errorMessage);
      $('#js-error-message').html(err);
    } else {
      $('#js-error-message').html('');
    }
    STORE.setErrorMessage('');

    //if form expanded change button text & add form HTML
    if (STORE.formExpanded) {
      $('.js-add-bookmark').html('CLOSE FORM');
      $('#js-add-bookmark-form').html(generateAddBookmarkForm());
    } else {
      $('.js-add-bookmark').html('ADD BOOKMARK');
      $('#js-add-bookmark-form').html('');
    }

    //if 'Filter By' option selected render STORE items > option selected
    if (STORE.filterBy) {
      currentSTORE = STORE.items.filter(item => item.rating > STORE.filterBy);
    }

    //run the generate HTML function on the current state of the STORE and render HTML
    const bookmarkElementsString = generateBookmarkElementsString(currentSTORE);
    $('.js-bookmarks-list').html(bookmarkElementsString);
  }

  //'New Bookmark Submit' event listener 
  function handleNewBookmarkSubmit() {
    $('#js-add-bookmark-form').submit(function(event) {
      event.preventDefault();

      //use my JQuery extended function from above to create an object w/ correct format
      const newBookmarkData = $(event.target).serializeJson();

      //run create bookmark function
      API.createBookmark(
        newBookmarkData,
        newBookmark => {
          STORE.addBookmark(newBookmark);
          STORE.toggleFormExpanded();
          render();
        },
        error => {
          STORE.setErrorMessage(error);
          render();
        }
      );
    });
  }

  //'Expand bookmarks' event listener 
  function getBookmarkIdFromElement(item) {
    return $(item)
      .closest('li')
      .attr('id');
  }

  function handleBookmarkExpand() {
    $('.bookmarks-list').on('click', '.js-bookmark-link', event => {
      const bookmarkId = getBookmarkIdFromElement(event.currentTarget);

      STORE.expandBookmark(bookmarkId);
      render();
    });
  }

  //DELETE EVENT LISTNER 
  function handleBookmarkDelete() {
    $('.bookmarks-list').on('click', '.js-delete-bookmark', event => {
      const bookmarkId = getBookmarkIdFromElement(event.currentTarget);
      //DETELE FROM SERVER
      API.deleteBookmark(bookmarkId, () => {
        STORE.findAndDelete(bookmarkId);
        render();
      });
    });
  }

  //'Filter by' event listener 

  function handleFilterBy() {
    $('.js-bookmark-filter').on('change', function() {
      let selectedRating = $(this).val();

      STORE.setFilterBy(selectedRating);
      render();
    });
  }

  //'Add Bookmark' Button event listener 

  function handleAddABookmarkBtn() {
    $('.js-add-bookmark').on('click', () => {
      STORE.toggleFormExpanded();
      render();
    });
  }

  //Bind Event Listeners
  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleBookmarkExpand();
    handleBookmarkDelete();
    handleFilterBy();
    handleAddABookmarkBtn();
  }

  return {
    //expose functions
    render: render,
    bindEventListeners: bindEventListeners
  };
})();
