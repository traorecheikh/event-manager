const Event = require('./Event');
const User = require('./User');

// Set up associations if associate function exists
if (typeof Event.associate === 'function') {
  Event.associate({ User });
}
if (typeof User.associate === 'function') {
  User.associate({ Event });
}

module.exports = {
  Event,
  User,
};

