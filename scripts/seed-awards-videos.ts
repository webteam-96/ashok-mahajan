/**
 * seed-awards-videos.ts
 * Inserts the 82 award images and 54 videos that were skipped in seed-static-data.ts
 * because the tables already had seed data.
 * Run: npx tsx scripts/seed-awards-videos.ts
 */

import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

const AWARD_IMAGES = [
  'IMG_1580.jpg', 'bc15af16-dd86-44b1-a17e-550c8efd0c4c.jpg', 'IMG_0808-scaled.jpg', 'IMG_0362-scaled.jpg',
  '103c7e9a-493a-4cb4-9030-12781e27078f.jpg', 'award-jupitar1.jpg', 'award-jupitar.jpg', 'award-1.jpg',
  'award-5.jpg', 'award-6.jpg', 'award-2.jpg', 'award-3.jpg', 'award-4.jpg', '114958.jpg',
  '9a9d2988-52b8-44bd-adbe-b14335d06fef-2.jpg', '1936adf5-c537-4bcd-a261-83741738ec9b-1.jpg',
  'IMG_7603.jpg', '091a9036-0898-402c-beda-1ec2659d311b.jpg', '007dd358-34c0-4db5-8fe0-f281d65aa914-1.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-002.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-003.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-004-scaled.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-005.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-006.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-007.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-008.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-009.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-010.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-011.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-012.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-013.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-014.jpg', 'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-015-scaled.jpg',
  'Award_Padma-Awards_AAB221007419_AAB221007419_2-page-016-scaled.jpg', '873ccf3d-813f-46a9-9d7d-3dbbf83f626a.jpg',
  'KBsir-letter-Scan-page-001.jpg', 'KBsir-letter-Scan-page-002.jpg', 'KBsir-letter-Scan-page-003.jpg',
  'picu-page-001.jpg', '83fbb70e-8294-40bd-a4fc-68d561285204.jpg', '98fff66b-1037-41ce-bf09-43eec5ce0356.jpg',
  'as-page-001.jpg', 'a8b9e5da-049f-41b0-9df0-939497d12546.jpg', 'IMG_20220907_0001-1.jpg',
  'Ashok-Mahajan-s-Artcile-on-Muslim-Ulema-page-002.jpg', 'Ashok-Mahajan-s-Artcile-on-Muslim-Ulema-page-003.jpg',
  'Mr-A-Mahajan-1.jpg', 'Letter-to-Ashok-Mahajan-1.jpg', 'IMG_7078-1-1.jpg', 'IMG_6443.jpg',
  'IMG_6329-1-scaled.jpg', 'IMG_6332-1-scaled.jpg', 'Ashok-Mahajan-s-Artcile-on-Muslim-Ulema-page-001.jpg',
  'IMG_6262-1-scaled.jpg', 'IMG_5467.png', '0e714d93-e5e1-488b-923d-84c0626321a5.jpg',
  'IMG_5447-1-scaled.jpg', 'sdd.png', 'f882ba20-a732-45a4-8817-0ebab84318d7.jpg', 'award1.png',
  '1-2.jpg', '02.png', '03.jpg', '05.jpg', '06.jpg',
  'award-01.jpg', 'award-02.jpg', 'award-03.jpg', 'award-04.jpg', 'award-05.jpg',
  'award-06.jpg', 'award-07.jpg', 'award-08.jpg', 'award-09.jpg', 'award-10.jpg',
  'award-11.jpg', 'award-12.jpg', 'award-13.jpg', 'award-14.jpg', 'award-15.png',
  '1-1.jpg', '0-1.jpg',
];

const YOUTUBE_IDS = [
  'xgMXSinX2No', 'c2Jc4CPcnDg', 'pieJoewQ6P8', '8ahsvPCKz-Q', 'UbLPdsLCAVw',
  'VZVtZyAtjbk', 'HqjLmt0sYkQ', 'xLKxQbv8PxQ', 'sQJ92UgETjw', '9DRR_0aYgGc',
  'n4xZmZmTTyg', '8hkFmNmp_oo', '7w3QZwf74o4', 'fwqpaZMnNvM', 'iB8sQj-ceDc',
  'WyZjQ2CmNO4', 'lNX0p7RMowo', 'g51g1OCeW_M', 'ISFT6MkDV28', '_D9apx4GSJs',
  'pJQoj8g2Z5M', 'vZVG32tcgj0', '1oz7ZLYyYCE', 'k_7gaPmHpp4', 'fDKFG3ADsFA',
  'ZKPEqlYS2GA', 'P1ebWh1YoFA', 'ffa_ZGxOE6s', 'SLakVC7H2-M', 'D_wkY074AoQ',
  'hox7q7Kj6cI', 'rzs6MzcoOIQ', 'M5o5AMnKnz4', 'hDycsyRqr84', '_QJR9XegdNs',
  'WrlCPT_j68g', '10g0eyWjke0', '_ABZy_PlGYs', 'X48tRz8Fpp4', 'TtGx0w0q4Yc',
  '5FbONVEcYMM', 'KJ2dWKxl_JI', 'Fgby35uHW3Q', 'KJlL_XGEq8w', 'omEMbaK6qk4',
  '4NN7KcC3oZw', '4yJ5VFyTYs8', 'afgpkK9c-pE', '0PR_yrIzySA',
];
const MP4_URLS = [
  'https://www.ashokmahajan.in/wp-content/uploads/2025/06/f05b44af-caee-46fb-b626-9e371aa805de-1.mp4',
  'https://www.ashokmahajan.in/wp-content/uploads/2025/06/WhatsApp-Video-2025-06-06-at-11.51.25-AM-1-1.mp4',
  'https://www.ashokmahajan.in/wp-content/uploads/2023/07/Rtn-Ashok-mahajan-and-manish-motwani.mp4',
  'https://www.ashokmahajan.in/wp-content/uploads/2021/05/am1-1.mp4',
  'https://www.ashokmahajan.in/wp-content/uploads/2021/06/PRID-Ashok-Mahajan-and-PDG-Deepak-Kapur-1.mp4',
];

async function main() {
  console.log('Seeding awards and videos...\n');

  // Get existing award image paths to avoid duplicates
  const existingAwards = await prisma.award.findMany({ select: { image: true } });
  const existingAwardImages = new Set(existingAwards.map((a) => a.image));

  const newAwards = AWARD_IMAGES
    .map((filename, i) => ({
      title: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      image: `/awards/${filename}`,
      order: i + 1000, // place after any existing seed data
      published: true,
    }))
    .filter((a) => !existingAwardImages.has(a.image));

  if (newAwards.length > 0) {
    await prisma.award.createMany({ data: newAwards });
    console.log(`✓ Inserted ${newAwards.length} award images`);
  } else {
    console.log('⏭ All award images already exist — skipping');
  }

  // Get existing YouTube URLs to avoid duplicates
  const existingVideos = await prisma.video.findMany({ select: { youtubeUrl: true, videoFile: true } });
  const existingYouTube = new Set(existingVideos.map((v) => v.youtubeUrl).filter(Boolean));
  const existingMp4 = new Set(existingVideos.map((v) => v.videoFile).filter(Boolean));

  const ytCount = await prisma.video.count();
  const newYoutube = YOUTUBE_IDS
    .filter((id) => !existingYouTube.has(`https://www.youtube.com/watch?v=${id}`))
    .map((id, i) => ({
      title: `Video ${ytCount + i + 1}`,
      youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
      videoFile: null as string | null,
      thumbnail: null as string | null,
      date: null as Date | null,
      published: true,
    }));

  const newMp4 = MP4_URLS
    .filter((url) => !existingMp4.has(url))
    .map((url, i) => ({
      title: `Video ${ytCount + newYoutube.length + i + 1}`,
      youtubeUrl: null as string | null,
      videoFile: url,
      thumbnail: null as string | null,
      date: null as Date | null,
      published: true,
    }));

  if (newYoutube.length + newMp4.length > 0) {
    await prisma.video.createMany({ data: [...newYoutube, ...newMp4] });
    console.log(`✓ Inserted ${newYoutube.length} YouTube + ${newMp4.length} MP4 videos`);
  } else {
    console.log('⏭ All videos already exist — skipping');
  }

  console.log('\n✅ Done!');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
