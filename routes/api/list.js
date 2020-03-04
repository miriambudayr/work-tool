const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const List = require('../../models/List');
const Board = require('../../models/Board');

// Route:           POST api/list/:board_id
// Description:     Create a list by board id
// Access:          Private

router.post(
  '/:board_id',
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
      const board = await Board.findOne({ _id: req.params.board_id });

      const newList = {
        title: req.body.title,
        user: req.user.id,
        board: req.params.board_id,
        boardTitle: board.title
      };

      const list = new List(newList);
      await list.save();
      res.json(list);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

// Route:           DELETE api/list/:list_id
// Description:     Delete list by list id
// Access:          Private

router.delete('/:list_id', auth, async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.list_id });

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    await list.remove();

    return res.json({ msg: 'List deleted' });
  } catch (err) {
    console.error(message.err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route            POST api/list/update/:list_id
// Description      Update a list by list id
// Access           Private

router.post(
  '/update/:list_id',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('archived', 'Archived is required')
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
      let list = await List.findOne({ _id: req.params.list_id });

      if (!list) {
        return res.status(404).json({ msg: 'List not found' });
      }

      const { title, archived } = req.body;

      const listFields = { archived, title };

      list = await List.findOneAndUpdate(
        { _id: req.params.list_id },
        { $set: listFields },
        { new: true, upsert: true }
      );

      await list.save();

      res.json(list);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
