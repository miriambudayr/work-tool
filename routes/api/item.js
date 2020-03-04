const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Item = require('../../models/Item');
const List = require('../../models/List');
const Board = require('../../models/Board');

// Route:           POST api/item/:list_id
// Description:     Create an item by list id
// Access:          Private

router.post(
  '/:list_id',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).send({ errors: validationErrors.array() });
    }

    try {
      const { title, description, due } = req.body;

      const newItem = {
        user: req.user.id,
        list: req.params.list_id,
        archived: false
      };
      // newItem.list = req.params.list_id;

      if (title) {
        newItem.title = title;
      }

      if (description) {
        newItem.description = description;
      }

      if (due) {
        newItem.due = due;
      }

      const item = new Item(newItem);
      const itemID = item._id;
      let list = await List.findOne({ _id: req.params.list_id });
      list.itemsOrder.push(itemID);
      await list.save();
      await item.save();
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

// Route:           GET api/item?list_id=:list_id
// Description:     Get all items for a list
// Access:          Private

router.get('/', auth, async (req, res) => {
  try {
    // const items = await Item.find({ list: req.params.list_id });
    const list = await List.findOne({ _id: req.query.list_id });
    const { itemsOrder } = list;
    const items = [];
    for (var i = 0; i < itemsOrder.length; i++) {
      let item = await Item.findOne({ _id: itemsOrder[i] });
      items.push(item);
    }

    // const items = await Item.find({ list: req.query.list_id });

    if (!items) {
      return res.status(404).json({ msg: 'Items not found' });
    }
    res.json(items);
  } catch (err) {
    console.error(message.err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route:           DELETE api/item/:item_id
// Description:     Delete item by item id
// Access:          Private

router.delete('/:item_id/:list_id', auth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.item_id });

    let list = await List.findOne({ _id: req.params.list_id });

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    let itemIndex = list.itemsOrder.indexOf(req.params.item_id);
    list.itemsOrder.splice(itemIndex, 1);
    await list.save();
    await item.remove();

    return res.json({ msg: 'Item deleted' });
  } catch (err) {
    console.error(message.err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route            POST api/item/update/:item_id
// Description      Update a item by item id
// Access           Private

router.post(
  '/update/:item_id',
  [
    auth,
    [
      // check('title', 'Title is required')
      //   .not()
      //   .isEmpty(),
      check('archived', 'Archived is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // const validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //   return res.status(400).send({ errors: validationErrors.array() });
    // }

    try {
      let item = await Item.findOne({ _id: req.params.item_id });
      if (!item) {
        return res.status(404).json({ msg: 'Item not found' });
      }

      const { description, title, due, archived } = req.body;

      const newItem = { archived };
      newItem.list = item.list;

      if (description) {
        newItem.description = description;
      }

      if (title) {
        newItem.title = title;
      }

      if (due || due === null) {
        newItem.due = due;
      }

      item = await Item.findOneAndUpdate(
        { _id: req.params.item_id },
        { $set: { ...newItem } },
        { new: true, upsert: true }
      );

      await item.save();

      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Route            PUT api/item/:old_list_id/:item_id/:new_list_id/:new_position_index
// Description      Move an item to another lsit
// Access           Private

router.put(
  '/:old_list_id/:item_id/:new_list_id/:new_position_index',
  auth,
  async (req, res) => {
    const {
      old_list_id,
      item_id,
      new_list_id,
      new_position_index
    } = req.params;

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).send({ errors: validationErrors.array() });
    }

    // Move item within same list.
    if (old_list_id === new_list_id) {
      try {
        let list = await List.findOne({ _id: old_list_id });
        if (!list) {
          return res.status(404).json({ msg: 'List not found' });
        }
        let oldPosition = list.itemsOrder.indexOf(item_id);
        let item = list.itemsOrder.splice(oldPosition, 1)[0];
        list.itemsOrder.splice(new_position_index, 0, item);
        await list.save();
        return res.json(list);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }

    // Move item from one list to another.
    try {
      let oldList = await List.findOne({ _id: old_list_id });
      let item = await Item.findOne({ _id: item_id });
      let newList = await List.findOne({ _id: new_list_id });

      if (!oldList) {
        return res.status(404).json({ msg: 'List not found' });
      }

      if (!item) {
        return res.status(404).json({ msg: 'Item not found' });
      }

      if (!newList) {
        return res.status(404).json({ msg: 'New list not found' });
      }

      let oldPosition = oldList.itemsOrder.indexOf(item_id);
      oldList.itemsOrder.splice(oldPosition, 1);
      item.list = new_list_id;
      newList.itemsOrder.splice(new_position_index, 0, item._id);

      await item.save();
      await oldList.save();
      await newList.save();

      res.json({ msg: 'Item successfully moved to new list and position' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Dev Utils

async function logItemsInOrder(listID) {
  let list = await List.findOne({ _id: listID });
  let itemsIDs = list.itemsOrder;

  for (var i = 0; i < itemsIDs.length; i++) {
    let item = await Item.findOne({ _id: itemsIDs[i] });
    console.log(item);
  }
}

module.exports = router;
