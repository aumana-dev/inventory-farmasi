import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { name: 'Dr. C. Tuna Tea Tree Oil', category: 'skincare', quantity: 15, price: 12.99, description: 'Natural tea tree oil for skin purification' },
  { name: 'Keratin Therapy Shampoo', category: 'haircare', quantity: 8, price: 18.99, description: 'Intensive keratin restoration shampoo' },
  { name: 'BB Cream SPF 15', category: 'makeup', quantity: 12, price: 24.99, description: 'Natural coverage with sun protection' },
  { name: 'Sensational Lipstick', category: 'makeup', quantity: 25, price: 9.99, description: 'Long-lasting matte finish' },
  { name: 'VFX Pro Camera Ready Foundation', category: 'makeup', quantity: 6, price: 29.99, description: 'Professional HD foundation' },
  { name: 'Nutriplus Vitamin C', category: 'nutrition', quantity: 20, price: 22.99, description: 'Daily vitamin C supplement' },
  { name: 'Fitocomplex Hair Mask', category: 'haircare', quantity: 4, price: 15.99, description: 'Deep conditioning treatment' },
  { name: 'Mr. Wipes Cleaning Set', category: 'bodycare', quantity: 10, price: 34.99, description: 'Eco-friendly cleaning products' },
  { name: 'Perfume Bella', category: 'fragrance', quantity: 7, price: 45.99, description: 'Elegant floral fragrance for women' },
  { name: 'Shower Gel Tropical', category: 'bodycare', quantity: 18, price: 8.99, description: 'Refreshing tropical scented shower gel' }
];

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing products
    await prisma.product.deleteMany();
    console.log('🗑️  Cleared existing products');

    // Create new products
    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    console.log(`✅ Created ${products.length} products successfully!`);
    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
