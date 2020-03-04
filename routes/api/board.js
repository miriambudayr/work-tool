const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const utils = require('./utils');
const { getMembers, getItems } = utils;

const Board = require('../../models/Board');
const User = require('../../models/User');
const List = require('../../models/List');

// Route:           POST api/board
// Description:     Create a board
// Access:          Private
router.post(
  '/',
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
      const newBoard = {
        title: req.body.title,
        user: req.user.id
      };

      const board = new Board(newBoard);
      await board.save();
      res.json(board);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

// Route:           GET api/board
// Description:     Get all boards for a user
// Access:          Private

router.get('/all', auth, async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id });
    const user = await User.findOne({ _id: req.user.id });

    const guestBoards = await Promise.all(
      user.guestBoards.map(async boardID => {
        let board = await Board.findOne({ _id: boardID });
        return board;
      })
    );

    if (!boards) {
      return res.status(404).json({ msg: 'Boards not found' });
    }
    res.json([...boards, ...guestBoards]);
  } catch (err) {
    console.error(message.err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route:           GET api/board?board_id=:board_id
// Description:     Get a board including lists and items
// Access:          Private

router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ board: req.query.board_id });
    const board = await Board.findOne({ _id: req.query.board_id });
    const members = await getMembers(board.members);

    if (!lists) {
      return res.status(404).json({ msg: 'Lists not found' });
    }

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    const { title, archived, color } = board;

    const boardFields = { title, archived, color, members };
    const listsArray = await getItems(lists);

    res.json({
      lists: listsArray,
      ...boardFields
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route:           DELETE api/board/:board_id
// Description:     Delete board by board id
// Access:          Private

router.delete('/:board_id', auth, async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.board_id });

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    await board.remove();
    return res.json({ msg: 'Board deleted' });
  } catch (err) {
    console.error(message.err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server error');
  }
});

// Route            POST api/board/:board_id
// Description      Update a board by board id
// Access           Private

router.post(
  '/:board_id',
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
      let board = await Board.findOne({ _id: req.params.board_id });

      if (!board) {
        return res.status(404).json({ msg: 'Board not found' });
      }

      const { title, archived, color } = req.body;

      const boardFields = { title, archived, color };

      board = await Board.findOneAndUpdate(
        { _id: req.params.board_id },
        { $set: boardFields },
        { new: true, upsert: true }
      );

      await board.save();
      const members = await getMembers(board.members);

      res.json({
        _id: board._id,
        title: board.title,
        archived: board.archived,
        color: board.color,
        members
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Route            POST api/board/member/:board_id/:member_email
// Description      Add member to a board
// Access           Private

router.post('/member/:board_id/:member_email', auth, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.board_id });
    const user = await User.findOne({ email: req.params.member_email });

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (board.members.includes(user._id)) {
      return res
        .status(400)
        .json({ errors: [{ message: 'User already a member of this board' }] });
    }

    board.members.push(user);
    await board.save();
    user.guestBoards.push(board);
    await user.save();

    const members = await getMembers(board.members);

    res.json({
      _id: board._id,
      title: board.title,
      archived: board.archived,
      color: board.color,
      members
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route            DELETE api/board/member/:board_id/:member_id
// Description      Delete member from a board
// Access           Private

router.delete('/member/:board_id/:member_id', auth, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.board_id });
    const user = await User.findOne({ _id: req.params.member_id });

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const memberIndex = board.members.indexOf(user._id);
    board.members.splice(memberIndex, 1);
    await board.save();

    const boardIndex = user.guestBoards.indexOf(board);
    user.guestBoards.splice(boardIndex, 1);
    await user.save();
    const members = await getMembers(board.members);

    res.json({
      _id: board._id,
      title: board.title,
      archived: board.archived,
      color: board.color,
      members
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
