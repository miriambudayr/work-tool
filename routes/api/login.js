const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// Route:           GET api/login
// Description:     Authenticate the route and get token
// Access:          Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server error');
  }
});

// Route:           POST api/login
// Description:     Authenticate the user and get token
// Access:          Public
router.post(
  '/',
  [
    check('email', 'A valid email is required').isEmail(),
    check('password', 'A valid password is required').exists({ min: 6 })
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // User doesn't exist
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid login credentials' }] });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid login credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // Note: revert experiesIn property to 3600 after development
      jwt.sign(
        payload,
        config.get('jwtPass'),
        {
          expiresIn: 360000
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
