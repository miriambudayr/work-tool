const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  due: {
    type: Date
  },
  archived: {
    type: Boolean,
    required: true
  }
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
