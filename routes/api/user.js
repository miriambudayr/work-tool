const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// Route:           GET api/user?searchTerm=:searchTerm
// Description:     Get a user by email or name
// Access:          Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: req.query.searchTerm } },
        { email: { $regex: req.query.searchTerm } }
      ]
    }).select('-password');
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server error');
  }
});

// Route:           POST api/user
// Description:     Register user
// Access           Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'A valid email is required').isEmail(),
    check(
      'password',
      'A password with seven or more characters is required'
    ).isLength({ min: 7 })
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtPass'),
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) {
            throw err;
          }

          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
