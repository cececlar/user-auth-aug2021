const bookshelf = require('../bookshelf');

const Task = bookshelf.model('Task', {
  tableName: 'tasks',
  user: function () {
    return this.belongsTo('user');
  }
});

module.exports = Task;
