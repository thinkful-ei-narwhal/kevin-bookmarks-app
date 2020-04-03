const bookmarks = [];
let expanded = 2;
let adding = false;
let error = null;
let filter = 0;
const editing = {
  editing: false,
  id: '',
}

function findById(id) {
  return this.bookmarks.find(bookmark => bookmark.id === id);
}

function addBookmark(bookmark) {
  this.bookmarks.push(bookmark);
}

function findAndUpdate(id, newData) {
  let oldData = this.findById(id);
  Object.assign(oldData, newData);
}

const findAndDelete = function (id) {
  this.items = this.items.filter(currentItem => currentItem.id !== id);
};

export default {
  expanded,
  bookmarks,
  adding,
  error,
  filter,
  editing,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
}