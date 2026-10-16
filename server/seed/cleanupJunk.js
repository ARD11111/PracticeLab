const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/practicelab').then(async () => {
  console.log('Connected to MongoDB');
  const Problem = mongoose.model('Problem', new mongoose.Schema({}, { strict: false }));
  
  const res1 = await Problem.deleteMany({ title: /a_d_i_t_i/i });
  console.log('Deleted a_d_i_t_i records:', res1.deletedCount);

  const res2 = await Problem.deleteMany({ title: /^test/i });
  console.log('Deleted test records:', res2.deletedCount);

  const remaining = await Problem.countDocuments();
  console.log('Total remaining problems:', remaining);

  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
