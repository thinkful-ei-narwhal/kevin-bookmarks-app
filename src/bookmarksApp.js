import $ from 'jquery';
import store from "./store";
import api from "./api";

const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const generateAddingBookmark = function() {
  return `
  <form class = "add-bookmark">
    <label for="bookmark-url">Add New Bookmark:</label>
    <input type="url" class="new-bookmark-url" id="new-bookmark-url" name="new-bookmark-url" placeholder="http://example.com/" required>
    <input type="text" class="new-bookmark-title" id="new-bookmark-title" name="new-bookmark-title" placeholder="Add a Title" required>
    <div class="rating">
      <span>
        <input type="radio" name="rating" id="str5" value="5">
        <label for="str5">5</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str4" value="4">
        <label for="str4">4</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str3" value="3">
        <label for="str3">3</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str2" value="2">
        <label for="str2">2</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str1" value="1">
        <label for="str1">1</label>
      </span>
      <span class="rating-descriptor">Rating:</span>
    </div>
    <input type="text" class="new-bookmark-desc" id="new-bookmark-desc" name="new-bookmark-desc" placeholder="Add a description (optional)">
    <button type="button" class="cancel" id="cancel">Cancel</button>
    <input type="submit" class="add-bookmark" id="add-bookmark" value="Save">
  </form>`
}

const generateInteractiveStarRating = function (bookmark) {
  let rating = bookmark.rating;
  let uncheckedStars = '';
  let checkedStars = '';
  let defaultStar = '';
  for (let i=5; i>rating; i--) {
    uncheckedStars += `
      <span>
        <input type="radio" name="rating" id="str${i}" value="${i}">
        <label for="str${i}"></label>
      </span>`
  }
  for (let i=rating; i=rating; i--){
    defaultStar = `
    <span>
      <input class="checked" type="radio" name="rating" id="str${i}" value="${i}">
      <label for="str${i}"></label>
    </span>`
  }
  for (let i=rating-1; i>0; i--) {
    checkedStars += `
      <span>
        <input class="checked" type="radio" name="rating" id="str${i}" value="${i}">
        <label for="str${i}"></label>
      </span>`
  }
  return uncheckedStars + defaultStar + checkedStars;
}

const generateEditingBookmark = function() {
  let id = store.editing.id;
  return `
    <form class = "editing-bookmark" id="id">
      <label for="bookmark-url">Edit Bookmark</label>
      <input type="url" id="bookmark-url" name="bookmark-url" default="${store.findById(id).url}" required>
      <input type="text" name="title" id="title" default="${store.findById(id).title}">
      <div class="rating">
        ${generateInteractiveStarRating(store.findById(id))}
        <span class="rating-descriptor">Rating:</span>
      </div>
      <input type="text" id="description" name="description" placeholder="${store.findById.desc}">
      <button type="button" class="cancel" id="cancel">Cancel</button>
      <input type="submit" class="submit" id="update-bookmark" value="Save">
    </form>`
}

const generateStarRating = function (bookmark) {
  let rating = bookmark.rating;
  let opposite = 5 - bookmark.rating;
  let checkedStars = '';
  let uncheckedStars = '';
  for (let i=1; i<=rating; i++) {
    checkedStars += '<span class="fa fa-star checked"></span>'
  }
  for (let i=1; i<=opposite; i++) {
    uncheckedStars += '<span class="fa fa-star"></span>'
  }
  return checkedStars+uncheckedStars;
}

const generateBookmarkElement = function (bookmark) {
  let id = store.expanded;
  if (id === bookmark.id) {
    return `
      <div class = "bookmark" data-bookmark-id="${store.findById(id).id}>
        <div class = "condensed">
          <button type = "button" id='collapse'>-</button>
          <p class = "title">${store.findById(id).title}</p>
          <div class = "display-rating">
            ${generateStarRating(store.findById(id))}
          </div>
        </div>
        <div class = "details">
          <a href="${store.findById(id).url}" target="_blank">Visit Site</a>
          <p>${store.findById(id).desc}</p>
          <button type="button" id="edit">Edit</button>
          <button type="button" class="delete" id="delete">Delete</button>
        </div>
      </div>`;
  } else {
    return `
      <div class = "bookmark" data-bookmark-id="${bookmark.id}">
        <div class = "condensed">
          <button type = "button" id="expand">+</button>
          <p class = "title">${bookmark.title}</p>
          <div class = "display-rating">
            ${generateStarRating(bookmark)}
          </div>
        </div>
      </div>`
  }
}

const generateAllElements = function (bookmarks) {
  const bookmark = bookmarks.map(bookmark => generateBookmarkElement(bookmark));
  return bookmark.join("");
};

const generateMainView = function(bookmarks) {
  return `
  <div class = "initial-view">
    <form class = "initial-options">
      <input id="add-new" type="button" value="New Bookmark">
      <label for="filter">Filter:</label>
      <select name="filter" id="filter">
        <option value="5">5 Stars</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
        <option value="2">2+ Stars</option>
        <option value="0" selected>Show All</option>
      </select>
    </form>
    ${generateAllElements(bookmarks)}
  </div>`
}

const render = function() {
  renderError();

  let bookmarks = [...store.bookmarks];
  bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);
  console.log(store.bookmarks);

  if (store.adding === true) {
    $("main").html(generateAddingBookmark());
  } else if (store.editing === true) {
    $("main").html(generateEditingBookmark());
  } else {
    $("main").html(generateMainView(bookmarks));
  }
} 

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest(".bookmark")
    .data("bookmark-id");
};

const handleAddBookmarkButton = function() {
  $('body').on('click', '#add-new', event => {
    event.preventDefault();
    store.adding = true;
    render();
  })
}

const handleFilter = function() {
  $("body").on("change", "#filter", event => {
    event.preventDefault();
    store.filter = $("#filter").val();
    render();
  });
}

const handleCollapseButton = function() {
  $("body").on('click', '#collapse', event => {
    event.preventDefault();
    store.expanded = '';
    render();
  });
}

const handleExpandButton = function() {
  $("body").on('click', '#expand', event => {
    event.preventDefault();
    store.expanded = getBookmarkIdFromElement(event.currentTarget);
    console.log(store.expanded);
    render();
  });
}

const handleEditButton = function() {
  $("body").on('click', '#edit', event => {
    event.preventDefault();
    store.editing.id = getBookmarkIdFromElement(event.currentTarget);
    store.editing.editing = true;
    console.log(store.editng);
    render();
  })
}

const handleDeleteButton = function() {
  $("body").on('click', '#delete', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    console.log(id);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  })
}

const handleNewBookmarkSubmit = function() {
  $('body').on('submit', '.add-bookmark', event => {
    event.preventDefault();
    console.log('button pressed');
    // try { 
    //   if ($('input[name="rating"]:checked').val() === undefined) throw "Rating is required";
    // } catch (e) {
    //   alert(e);
    // }
    const newBookmark = {};
    newBookmark.title = $(".new-bookmark-title").val();
    newBookmark.url = $(".new-bookmark-url").val();
    newBookmark.desc = $(".new-bookmark-desc").val();
    newBookmark.rating = $('input[name="rating"]:checked').val();
    api.createBookmark(newBookmark)
      .then((newBookmark) => {
        console.log(newBookmark);
        store.addBookmark(newBookmark);
        store.adding = false;
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleUpdateBookmarkSubmit = function() {
  $('body').on('submit', '.update-bookmark', event => {
    event.preventDefault();
    try { 
      if ($('input[name="rating"]:checked').val() === undefined) throw "Rating is required";
    } catch (e) {
      alert(e);
    }
    const id = getBookmarkIdFromElement(event.currentTarget);
    
    const newBookmark = {};
    newBookmark.title = $(".new-bookmark-title").val();
    newBookmark.url = $(".new-bookmark-url").val();
    newBookmark.desc = $(".new-bookmark-desc").val();
    newBookmark.rating = $('input[name="rating"]:checked').val();

    api.updateItem(id, newBookmark)
      .then(() => {
        store.findAndUpdate(id, newBookmark);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
}

const handleCancelButton = function() {
  $('body').on('click', '#cancel', event => {
    event.preventDefault();
    store.adding = false;
    store.editing.editing = false;
    store.editing.id = '';
    render();
  });
}

// const handleRatingSystem = function() {


const bindEventListeners = function() {
  handleAddBookmarkButton();
  handleFilter();
  handleExpandButton();
  handleCollapseButton();
  handleEditButton();
  handleDeleteButton();
  handleNewBookmarkSubmit();
  handleUpdateBookmarkSubmit();
  handleCancelButton();
  handleCloseError();
}

export default {
  render,
  bindEventListeners,
}


// have the editing in the store contain the the bolean and the id of the object being edited