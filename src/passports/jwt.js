// Import Modules
const flaverr = require('flaverr');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return next(flaverr('E_FORBIDDEN', Error('forbidden')));
    }

    const token = header.split(' ')[1];
    const { user_id } = jwt.decode(token);

    if (user_id) {
      try {
        const user = await User.findOne({
          where: { id: user_id },
        });

        if (!user) {
          throw new Error('token invalid');
        }
      } catch (err) {
        return next(flaverr('E_FORBIDDEN', Error(err.message)));
      }
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      throw new Error('token invalid');
    }

    req.user = verified;
    return next();
  } catch (err) {
    return next(flaverr('E_FORBIDDEN', Error(err.message)));
  }
};

module.exports = verifyToken;
