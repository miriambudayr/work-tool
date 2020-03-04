const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  },
  title: {
    type: String,
    required: true
  },
  itemsOrder: [
    {
      type: String,
      required: true
    }
  ],
  boardTitle: {
    type: String,
    required: true
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  }
});

const List = mongoose.model('list', ListSchema);

module.exports = List;
