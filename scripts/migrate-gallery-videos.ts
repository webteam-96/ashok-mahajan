/**
 * Migrate gallery images and YouTube videos from WordPress data
 * - Gallery: 21 NGG (NextGen Gallery) photos from ashok-mahajan_1
 * - Videos: 22 YouTube videos from the Smash Balloon channel feed cache
 */
import { prisma } from '../src/lib/prisma';

// ─── Gallery Images (from Uig_ngg_pictures, gallery ashok-mahajan_1) ─────────
const GALLERY_IMAGES = [
  { filename: '0-1.jpg',  title: 'Photo 1',  order: 1 },
  { filename: '0-2.jpg',  title: 'Photo 2',  order: 2 },
  { filename: '0-3.jpg',  title: 'Photo 3',  order: 3 },
  { filename: '0-4.jpg',  title: 'Photo 4',  order: 4 },
  { filename: '0-9.jpg',  title: 'Photo 5',  order: 5 },
  { filename: '01.jpg',   title: 'Photo 6',  order: 6 },
  { filename: '02.jpg',   title: 'Photo 7',  order: 7 },
  { filename: '03.jpg',   title: 'Photo 8',  order: 8 },
  { filename: '04.jpg',   title: 'Photo 9',  order: 9 },
  { filename: '05.jpg',   title: 'Photo 10', order: 10 },
  { filename: '1_01.jpg', title: 'Photo 11', order: 11 },
  { filename: '1_02.jpg', title: 'Photo 12', order: 12 },
  { filename: '1_03.jpg', title: 'Photo 13', order: 13 },
  { filename: '1_04.jpg', title: 'Photo 14', order: 14 },
  { filename: '2_01.jpg', title: 'Photo 15', order: 15 },
  { filename: '2_02.jpg', title: 'Photo 16', order: 16 },
  { filename: '2_03.jpg', title: 'Photo 17', order: 17 },
  { filename: '3_01.jpg', title: 'Photo 18', order: 18 },
  { filename: '3_02.jpg', title: 'Photo 19', order: 19 },
  { filename: '4_01.jpg', title: 'Photo 20', order: 20 },
  { filename: '4_02.jpg', title: 'Photo 21', order: 21 },
];

// ─── YouTube Videos (from Smash Balloon channel feed cache) ──────────────────
// Channel: PRID Ashok Mahajan (UCdyM5XXoJpOOHYIvJIPaWXw)
const YOUTUBE_VIDEOS = [
  { id: 'pieJoewQ6P8', title: 'Rotary and National Character',                                                    date: '2025-12-12' },
  { id: 'c2Jc4CPcnDg', title: 'Installation function of Seema Joshi in 2024-25',                                 date: '2025-12-12' },
  { id: 'UbLPdsLCAVw', title: "PRID Ashok Mahajan's Response to Life Time Achievement Award",                     date: '2025-11-25' },
  { id: '5p14-ltvS-4', title: 'PRID Ashok Mahajan Introduced Before Receiving Lifetime Achievement Award',        date: '2025-11-17' },
  { id: 'VZVtZyAtjbk', title: 'Speech of PRID Ashok Mahajan in District 3120 at Varanasi on Foundation',         date: '2025-11-17' },
  { id: '8ahsvPCKz-Q', title: 'PRID Addressing Institute While Receiving Life Time Achievement Award in New Delhi', date: '2025-11-17' },
  { id: 'HqjLmt0sYkQ', title: 'A Legacy of Leadership and Contribution in India by PRID Ashok Mahajan',          date: '2025-11-17' },
  { id: 'kMwph4T6iDo', title: 'The Light of the Ganga',                                                          date: '2025-11-05' },
  { id: 'tY1AmtvnJz4', title: 'Rotary Programme – November 2025',                                                 date: '2025-11-05' },
  { id: 'xLKxQbv8PxQ', title: 'PRID Ashok Mahajan – Special Address',                                            date: '2025-10-31' },
  { id: 'sQJ92UgETjw', title: 'World Polio Day',                                                                  date: '2025-10-31' },
  { id: '7w3QZwf74o4', title: 'TB-Free Thane Initiative – Ni-Kshay Mitra Food Kit Distribution',                  date: '2025-10-15' },
  { id: 'ISFT6MkDV28', title: 'End Polio Now – PRID Ashok Mahajan, Past Trustee Advisor, National Polio Plus Committee', date: '2025-10-07' },
  { id: '8hkFmNmp_oo', title: 'Dr. Tvacha – Clip 3',                                                              date: '2025-10-07' },
  { id: 'n4xZmZmTTyg', title: 'Dr. Tvacha – Clip 2',                                                              date: '2025-10-07' },
  { id: 'WyZjQ2CmNO4', title: 'Dr. Tvacha – Clip 1',                                                              date: '2025-10-07' },
  { id: 'iB8sQj-ceDc', title: 'KIMS Hospital',                                                                    date: '2025-10-01' },
  { id: 'E8AgIrRamo0', title: 'Birthday Celebration',                                                             date: '2025-09-01' },
  { id: 'aiBiIadMyQ8', title: 'Speech – September 2025',                                                          date: '2025-09-01' },
  { id: '_D9apx4GSJs', title: 'Joint Meeting with Rotary Clubs in Jakarta, Indonesia',                            date: '2025-09-01' },
  { id: 'lNX0p7RMowo', title: 'Community Foundation Programme',                                                   date: '2025-08-07' },
  { id: 'g51g1OCeW_M', title: 'PRID Ashok Mahajan – Address',                                                     date: '2025-07-31' },
];

async function main() {
  console.log('─── Migrating Gallery Images ───');
  const existingGallery = await prisma.galleryImage.count();
  if (existingGallery > 0) {
    console.log(`Skipping: ${existingGallery} gallery images already in database.`);
  } else {
    const galleryData = GALLERY_IMAGES.map((img) => ({
      title: img.title,
      image: `/uploads/gallery/${img.filename}`,
      album: 'Ashok Mahajan',
      order: img.order,
      published: true,
    }));
    await prisma.galleryImage.createMany({ data: galleryData });
    console.log(`✓ Inserted ${galleryData.length} gallery images`);
  }

  console.log('\n─── Migrating YouTube Videos ───');
  const existingVideos = await prisma.video.count();
  if (existingVideos > 0) {
    console.log(`Skipping: ${existingVideos} videos already in database.`);
  } else {
    const videoData = YOUTUBE_VIDEOS.map((v) => ({
      title: v.title,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
      thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
      date: new Date(v.date),
      published: true,
    }));
    await prisma.video.createMany({ data: videoData });
    console.log(`✓ Inserted ${videoData.length} YouTube videos`);
  }

  console.log('\n─── Final counts ───');
  const [posts, awards, gallery, pubs, speeches, videos] = await Promise.all([
    prisma.blogPost.count(),
    prisma.award.count(),
    prisma.galleryImage.count(),
    prisma.publication.count(),
    prisma.speech.count(),
    prisma.video.count(),
  ]);
  console.log(`  BlogPosts:    ${posts}`);
  console.log(`  Awards:       ${awards}`);
  console.log(`  Gallery:      ${gallery}`);
  console.log(`  Publications: ${pubs}`);
  console.log(`  Speeches:     ${speeches}`);
  console.log(`  Videos:       ${videos}`);

  await prisma.$disconnect();
}

main().catch(console.error);
