const mongoose = require('mongoose');

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family:4
    };

    mongoose.connect('mongodb+srv://andreiv03:andrei123@omuletzu.t7kod.mongodb.net/Omuletzu?retryWrites=true&w=majority', dbOptions);
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
      console.log('Mongoose has successfully connected!');
    });
    mongoose.connection.on('err', error => {
      console.error(`Mongoose connection error: \n${error.stack}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose connection lost!');
    });
  }
}