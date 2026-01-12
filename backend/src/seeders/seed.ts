import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { sequelize } from '../config/database';
import { User } from '../models/User';
import { UserStop } from '../models/UserStop';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');

    // Create test user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Test123!', salt);

    const testUser = await User.create({
      username: 'testuser',
      email: 'test@urbanflow.pl',
      passwordHash,
    });
    console.log(`✅ Created test user: ${testUser.email}`);

    // Create sample stops for test user
    const sampleStops = [
      { stopId: 2019, stopName: 'Miszewskiego' },
      { stopId: 1001, stopName: 'Brama Wyżynna' },
      { stopId: 1095, stopName: 'Dworzec Główny' },
      { stopId: 1280, stopName: 'Politechnika' },
      { stopId: 2050, stopName: 'Oliwa PKP' },
    ];

    for (const stop of sampleStops) {
      await UserStop.create({
        userId: testUser.id,
        stopId: stop.stopId,
        stopName: stop.stopName,
      });
      console.log(`  ✅ Added stop: ${stop.stopName} (${stop.stopId})`);
    }

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📋 Test credentials:');
    console.log('   Email: test@urbanflow.pl');
    console.log('   Password: Test123!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
