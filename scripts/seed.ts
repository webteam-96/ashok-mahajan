/**
 * Seed script — creates the default admin user and initial site settings.
 * Run with:  npx tsx scripts/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import path from 'path';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = dbUrl.replace(/^file:/, '');
const absolutePath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile);
const adapter = new PrismaLibSql({ url: `file:${absolutePath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ─────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || 'admin@ashokmahajan.in';
  const password = process.env.ADMIN_PASSWORD || 'Admin@2024';
  const hash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, name: 'Admin', role: 'admin' },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Site Settings ──────────────────────────────────────────────────────────
  const settings = [
    { key: 'site_title', value: 'Rtn. Ashok Mahajan' },
    { key: 'site_description', value: 'Past R.I. Director' },
    { key: 'phone_office', value: '+91 22 41313832' },
    { key: 'phone_mobile', value: '+91 9820183481' },
    { key: 'email', value: 'ashokmahajan883@gmail.com' },
    {
      key: 'address',
      value:
        '1001, Marathon Galaxy 1, LBS Marg, Mulund(W), Mumbai - 400080, Maharashtra, India',
    },
    { key: 'facebook_url', value: 'https://www.facebook.com/ashokmahajan.rotary' },
    { key: 'twitter_url', value: 'https://twitter.com/ashokmahajan_ri' },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/in/ashokmahajan' },
    { key: 'footer_text', value: '© 2024 Rtn. Ashok Mahajan. All Rights Reserved.' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ Site settings seeded (${settings.length} entries)`);

  // ── Sample Award (so the home page shows something) ──────────────────────
  const awardCount = await prisma.award.count();
  if (awardCount === 0) {
    await prisma.award.createMany({
      data: [
        {
          title: 'Rotary International Director Award',
          image: '/uploads/placeholder-award.svg',
          description: 'Awarded for outstanding service as R.I. Director 2018-2019',
          year: 2019,
          order: 1,
        },
        {
          title: 'Distinguished Service Award',
          image: '/uploads/placeholder-award.svg',
          description: 'Distinguished Service Award from Rotary District 3140',
          year: 2018,
          order: 2,
        },
        {
          title: 'Polio Eradication Champion',
          image: '/uploads/placeholder-award.svg',
          description: 'Recognized for exceptional contribution to Polio Eradication',
          year: 2020,
          order: 3,
        },
      ],
    });
    console.log('✅ Sample awards created');
  } else {
    console.log(`ℹ️  Awards already exist (${awardCount}), skipping sample data`);
  }

  // ── Page Content ───────────────────────────────────────────────────────────
  const covidLifeline = await prisma.pageContent.upsert({
    where: { slug: 'covid-lifeline' },
    update: {},
    create: {
      slug: 'covid-lifeline',
      title: 'Covid Lifeline',
      content: `<h2>Covid Lifeline Initiative</h2>
<p>The Covid Lifeline initiative was launched in response to the devastating second wave of COVID-19 in India (April–June 2021). Rtn. Ashok Mahajan mobilized Rotary's vast network to provide life-saving support — distributing oxygen concentrators, medicines, PPE kits, and organizing vaccination drives across India.</p>
<h3>Key Activities</h3>
<ul>
  <li>Distribution of 5,000+ oxygen concentrators to hospitals and home patients</li>
  <li>COVID Care Centers set up across multiple districts</li>
  <li>Mass vaccination drives in collaboration with health authorities</li>
  <li>24/7 helplines for hospital beds, oxygen, and critical medicines</li>
</ul>
<blockquote>
  "When humanity faces its darkest hours, it is the light of service that leads the way." — Rtn. Ashok Mahajan
</blockquote>`,
    },
  });
  console.log(`✅ Page content: ${covidLifeline.slug}`);

  console.log('\n🎉 Seeding complete!');
  console.log(`\n👤 Login credentials:`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   URL:      http://localhost:3000/admin`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
