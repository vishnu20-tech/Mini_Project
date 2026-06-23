import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await FriendRequest.deleteMany({});

    console.log('Creating sample users...');
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Software engineer and coffee enthusiast',
        profilePicture: null,
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Designer and photographer',
        profilePicture: null,
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        bio: 'Product manager interested in startups',
        profilePicture: null,
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: 'password123',
        bio: 'Data scientist and machine learning enthusiast',
        profilePicture: null,
      },
      {
        name: 'Emma Brown',
        email: 'emma@example.com',
        password: 'password123',
        bio: 'Marketing specialist and content creator',
        profilePicture: null,
      },
      {
        name: 'Frank Miller',
        email: 'frank@example.com',
        password: 'password123',
        bio: 'DevOps engineer and open source contributor',
        profilePicture: null,
      },
      {
        name: 'Grace Lee',
        email: 'grace@example.com',
        password: 'password123',
        bio: 'Frontend developer passionate about UX',
        profilePicture: null,
      },
      {
        name: 'Henry Taylor',
        email: 'henry@example.com',
        password: 'password123',
        bio: 'Backend engineer and database expert',
        profilePicture: null,
      },
      {
        name: 'Iris Martinez',
        email: 'iris@example.com',
        password: 'password123',
        bio: 'Mobile app developer and gaming enthusiast',
        profilePicture: null,
      },
      {
        name: 'Jack Anderson',
        email: 'jack@example.com',
        password: 'password123',
        bio: 'Cloud architect and security specialist',
        profilePicture: null,
      },
      {
        name: 'Karen White',
        email: 'karen@example.com',
        password: 'password123',
        bio: 'QA engineer and testing expert',
        profilePicture: null,
      },
      {
        name: 'Leo Thomas',
        email: 'leo@example.com',
        password: 'password123',
        bio: 'Full stack developer and tech writer',
        profilePicture: null,
      },
    ]);

    console.log(`Created ${users.length} users`);

    console.log('Building friendship network...');
    const addFriendship = async (user1Index, user2Index) => {
      users[user1Index].friends.push(users[user2Index]._id);
      users[user2Index].friends.push(users[user1Index]._id);
    };

    await addFriendship(0, 1);
    await addFriendship(0, 2);
    await addFriendship(0, 3);
    await addFriendship(1, 2);
    await addFriendship(1, 4);
    await addFriendship(2, 5);
    await addFriendship(3, 5);
    await addFriendship(3, 6);
    await addFriendship(4, 6);
    await addFriendship(5, 7);
    await addFriendship(6, 7);
    await addFriendship(6, 8);
    await addFriendship(7, 8);
    await addFriendship(7, 9);
    await addFriendship(8, 10);
    await addFriendship(9, 10);
    await addFriendship(10, 11);
    await addFriendship(9, 11);

    await Promise.all(users.map((user) => user.save()));

    console.log('Adding some friend requests...');
    await FriendRequest.create([
      {
        sender: users[0]._id,
        receiver: users[4]._id,
        status: 'pending',
      },
      {
        sender: users[2]._id,
        receiver: users[6]._id,
        status: 'pending',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Email: alice@example.com, Password: password123');
    console.log('Email: bob@example.com, Password: password123');
    console.log('Email: carol@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
