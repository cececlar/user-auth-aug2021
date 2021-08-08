const bookshelf = require('../bookshelf');

const User = bookshelf.model('User', {
  tableName: 'users',
  tasks: function () {
    return this.hasMany('task', 'user_id');
  }
});

module.exports = User;
