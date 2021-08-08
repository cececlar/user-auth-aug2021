const userData = require('./seed_data/users');
const taskData = require('./seed_data/tasks');

exports.seed = function (knex) {
  //DELETE all the users
  return knex('users')
    .del()
    .then(() => {
      //Insert users
      return knex('users').insert(userData);
    })
    .then(() => {
      //DELETE all tasks
      return knex('tasks').del();
    })
    .then(() => {
      //PLUCK IDs from users
      return knex('users')
        .pluck('id')
        .then((userIds) => {
          return userIds;
        });
    })
    .then((userIds) => {
      //Attach the userId's to a task
      const tasksWithUserIds = taskData.map((task) => {
        task.user_id = userIds[Math.floor(Math.random() * userIds.length)];
        return task;
      });
      //INSERT the data to the tasks table
      return knex('tasks').insert(tasksWithUserIds);
    });
};
