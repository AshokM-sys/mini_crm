const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Lead = require('./models/Lead');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Company.deleteMany(),
      Lead.deleteMany(),
      Task.deleteMany(),
    ]);

    console.log('Creating sample users...');
    const users = await User.create([
      {
        name: 'John',
        email: 'john@crm.com',
        password: 'password123',
      },
      {
        name: 'Ravi',
        email: 'ravi@crm.com',
        password: 'password123',
      },
      {
        name: 'Sarah',
        email: 'sarah@crm.com',
        password: 'password123',
      },
    ]);

    const [john, raviUser, sarah] = users;

    console.log('Creating sample companies...');
    const companies = await Company.create([
      {
        name: 'Iaaxin Tech Labs',
        industry: 'IT',
        location: 'Karur',
      },
      {
        name: 'Tata Consultancy Services',
        industry: 'IT',
        location: 'Chennai',
      },
      {
        name: 'Zenith Infotech',
        industry: 'IT',
        location: 'Coimbatore',
      },
      {
        name: 'Cloudflare',
        industry: 'IT',
        location: 'Bangalore',
      },
    ]);

    const [iaaxin, tata, zenith, cloudflare] = companies;

    console.log('Creating sample leads...');
    const leads = await Lead.create([
      {
        name: 'Prakash K',
        email: 'prakash@mail.com',
        phone: '+91 9876543210',
        status: 'New',
        assignedTo: john._id,
        company: iaaxin._id,
      },
      {
        name: 'Praveen S',
        email: 'praveen@mail.com',
        phone: '+91 9812345678',
        status: 'Qualified',
        assignedTo: john._id,
        company: tata._id,
      },
      {
        name: 'Vikram Patel',
        email: 'vikram@zenith.org',
        phone: '+91 9823456789',
        status: 'Contacted',
        assignedTo: raviUser._id,
        company: zenith._id,
      },
      {
        name: 'Priya Sundaram',
        email: 'priya@cloud.com',
        phone: '+91 9834567890',
        status: 'Qualified',
        assignedTo: sarah._id,
        company: cloudflare._id,
      },
      {
        name: 'Karthik Rao',
        email: 'karthik@cloudsolutions.io',
        phone: '+91 9845678901',
        status: 'Lost',
        assignedTo: john._id,
        company: iaaxin._id,
      },
      {
        name: 'Meera Nambiar',
        email: 'meera@healthgroup.in',
        phone: '+91 9856789012',
        status: 'Qualified',
        assignedTo: raviUser._id,
        company: zenith._id,
      },
      {
        name: 'Arjun Das',
        email: 'arjun@fastdeliveries.com',
        phone: '+91 9867890123',
        status: 'Contacted',
        assignedTo: sarah._id,
        company: cloudflare._id,
      },
      {
        name: 'Deepa Menon',
        email: 'deepa@itconsult.com',
        phone: '+91 9878901234',
        status: 'New',
        assignedTo: john._id,
        company: tata._id,
      },
    ]);

    console.log('Creating sample tasks...');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    await Task.create([
      {
        title: 'Call',
        lead: leads[0]._id,
        assignedTo: john._id,
        dueDate: today,
        status: 'Pending',
      },
      {
        title: 'Send initial pricing proposal to Praveen',
        lead: leads[1]._id,
        assignedTo: john._id,
        dueDate: today,
        status: 'Completed',
      },
      {
        title: 'Schedule technical discovery call',
        lead: leads[2]._id,
        assignedTo: raviUser._id,
        dueDate: today,
        status: 'Pending',
      },
      {
        title: 'Conduct product demonstration',
        lead: leads[3]._id,
        assignedTo: sarah._id,
        dueDate: tomorrow,
        status: 'Pending',
      },
      {
        title: 'Review enterprise compliance checklist',
        lead: leads[5]._id,
        assignedTo: raviUser._id,
        dueDate: tomorrow,
        status: 'Completed',
      },
    ]);

    console.log('Database seeded successfully!');
    console.log('--- Demo Accounts ---');
    console.log('User 1: john@crm.com | password123');
    console.log('User 2: ravi@crm.com | password123');
    console.log('User 3: sarah@crm.com | password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
