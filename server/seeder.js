const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Task = require('./models/Task');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create sample data
const createSampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();

    console.log('Data cleared...');

    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    console.log('Test user created...');

    // Create sample tasks
    const tasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish the project proposal for the client meeting',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        user: user._id
      },
      {
        title: 'Schedule team meeting',
        description: 'Set up a team meeting to discuss project timeline',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        user: user._id
      },
      {
        title: 'Research new technologies',
        description: 'Look into new frameworks for upcoming projects',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
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

// Delete all data
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

// Check command line args
if (process.argv[2] === '-i') {
  createSampleData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide proper command: -i (import) or -d (delete)');
  process.exit();
}
