const { Destination } = require('../models');
const { testConnection } = require('../config/database');

const destinations = [
  {
    name: 'Candi Borobudur',
    description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9. Situs Warisan Dunia UNESCO yang terkenal dengan relief dan stupa-stupanya yang megah.',
    latitude: -7.6079,
    longitude: 110.2038,
    city: 'Magelang',
    image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'
  },
  {
    name: 'Candi Prambanan',
    description: 'Kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9. Terkenal dengan arsitektur menjulang tinggi dan relief Ramayana.',
    latitude: -7.7520,
    longitude: 110.4915,
    city: 'Yogyakarta',
    image_url: 'https://images.unsplash.com/photo-1598965675045-3c8e50e94cd9?w=800'
  },
  {
    name: 'Malioboro',
    description: 'Jalan utama di Yogyakarta yang terkenal dengan pusat perbelanjaan, kuliner, dan budaya. Tempat yang wajib dikunjungi untuk merasakan kehidupan malam Jogja.',
    latitude: -7.7928,
    longitude: 110.3658,
    city: 'Yogyakarta',
    image_url: 'https://images.unsplash.com/photo-1555899434-94d1eb5a5b7b?w=800'
  },
  {
    name: 'Pantai Parangtritis',
    description: 'Pantai terkenal di selatan Yogyakarta dengan pemandangan sunset yang indah dan legenda Ratu Kidul. Cocok untuk paralayang dan bermain ATV.',
    latitude: -8.0253,
    longitude: 110.3275,
    city: 'Yogyakarta',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
  },
  {
    name: 'Keraton Yogyakarta',
    description: 'Istana resmi Kesultanan Yogyakarta yang masih dihuni Sultan hingga saat ini. Museum hidup yang menampilkan budaya dan tradisi Jawa.',
    latitude: -7.8052,
    longitude: 110.3644,
    city: 'Yogyakarta',
    image_url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'
  },
  {
    name: 'Taman Sari',
    description: 'Bekas taman istana dan pemandian Kesultanan Yogyakarta. Kompleks bersejarah dengan arsitektur khas yang instagramable.',
    latitude: -7.8101,
    longitude: 110.3590,
    city: 'Yogyakarta',
    image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800'
  },
  {
    name: 'Goa Jomblang',
    description: 'Gua vertikal yang terkenal dengan cahaya surga (light of heaven). Destinasi petualangan yang menakjubkan untuk caving.',
    latitude: -7.9557,
    longitude: 110.6723,
    city: 'Gunung Kidul',
    image_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'
  },
  {
    name: 'Hutan Pinus Mangunan',
    description: 'Hutan pinus dengan spot foto instagramable dan pemandangan alam yang menenangkan. Cocok untuk piknik dan bersantai.',
    latitude: -7.9386,
    longitude: 110.4280,
    city: 'Bantul',
    image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800'
  },
  {
    name: 'Kalibiru',
    description: 'Wisata alam dengan spot foto di ketinggian dengan latar Waduk Sermo. Pemandangan hijau dan instagramable.',
    latitude: -7.7675,
    longitude: 110.1281,
    city: 'Kulon Progo',
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
  },
  {
    name: 'Museum Ullen Sentalu',
    description: 'Museum seni dan budaya Jawa yang menampilkan koleksi batik, keris, dan artefak kerajaan. Suasana tenang dan penuh sejarah.',
    latitude: -7.5906,
    longitude: 110.4325,
    city: 'Sleman',
    image_url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'
  }
];

const seedDestinations = async () => {
  try {
    console.log('🌱 Starting destination seeder...');

    await testConnection();

    await Destination.destroy({ where: {} });
    console.log('🗑️  Cleared existing destinations');

    // Insert new data
    const result = await Destination.bulkCreate(destinations);
    console.log(`✅ Successfully seeded ${result.length} destinations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding destinations:', error);
    process.exit(1);
  }
};


// Run seeder
seedDestinations();