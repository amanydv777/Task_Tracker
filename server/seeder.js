const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createSampleData = async () => {
  try {
    await User.deleteMany();
    await Task.deleteMany();

    console.log('Data cleared...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    console.log('Test user created...');

    const tasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish the project proposal for the client meeting',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000), 
        user: user._id
      },
      {
        title: 'Schedule team meeting',
        description: 'Set up a team meeting to discuss project timeline',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(Date.now() - 86400000), 
        user: user._id
      },
      {
        title: 'Research new technologies',
        description: 'Look into new frameworks for upcoming projects',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 172800000), 
        user: user._id
      }
    ];

    await Task.insertMany(tasks);

    console.log('Sample tasks created...');
    console.log('Sample data created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Task.deleteMany();

    console.log('All data deleted...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  createSampleData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide proper command: -i (import) or -d (delete)');
  process.exit();
}
