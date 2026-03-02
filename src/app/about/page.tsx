import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About – Rtn. Ashok Mahajan',
  description:
    'Born 23rd July 1947, Rtn. Ashok Mahajan is a Past R.I. Director (2007-2009), Trustee of The Rotary Foundation (2009-13), District Governor (1993-94), and champion of Polio eradication.',
};

const SERVICE_HIGHLIGHTS = [
  'Zonal Coordinator – Membership Task Force, (1995-96) and (1998-99)',
  'Member India National Polio Plus Committee (1996-2006)',
  'Zonal Coordinator – Avoidable Blindness Task Force, (2000-02)',
  'Campaign Associate Rotary UNF private sector campaign (2001-02) – Raised Rs. 1 crore for Polio Eradication programme.',
  'Member World Affair Committee-Asian (2003-05)',
  'Vice Chair Polio Summit in 2011 and 2014',
  "Chairman of Rotary International's Membership Development and Retention Committee, (2012-2013)",
  'Member of The Fund Development Committee of The Rotary Foundation, (2014-2017)',
  "Chairman, Rotary India's National Covid Task Force, since 2020",
  'Member, International Covid-19 Task Force 2021-22',
];

const AWARDS = [
  "Felicitated with Rotary Foundation's highest awards: Distinguished Service Award, Service above Self Award, Regional Service Award for a Polio Free World, International Service Award for Polio Free World, and Polio Plus Pioneer Award",
  'Invited by Amritsar Chapter of the FICCI Ladies Organisation (FICCI) as its Mentor',
  'Recipient of Rotary Cause Champion Award in RI District 3141 at the District conference in Mumbai',
  'Recipient of Exemplary Humanitarian Service Award from RI District 3142 (2019 district conference)',
  'Recipient of PRIDE OF ROTARY DISTRICT 3141 AWARD at the UNICORN DISCON, 30th May 2021',
  'Invited as an Honorary Member of Rotary Club of Thane Hills, RI District 3142',
  'Received Appreciation Certificate for Vaccination and Covid-19 Relief at the hands of Union Minister of Health and Family Welfare, Dr Bharati Pawar',
  'Received ROTARY HERO AWARD OF EXPERIENCE at the hands of Union Minister of State for Health and Family Welfare',
  'Invited as Leader / Ambassador of SDG Choupal initiative supported by Niti Aayog',
  'PRIDE OF DISTRICT 3141 Award at the District Conference of RI District 3141, June 2021',
  'RID 3142 HITACHINTAK AWARD',
  'Received appreciation for work in the medical field by the Government of Maharashtra',
  'Received appreciation for work in Cervical Cancer, Paediatric Heart Surgeries and TB-Free Thane by Thane Municipal Corporation',
  'Received appreciation from Jupiter Hospital for completing 750 Paediatric Heart Surgeries – presented at the hands of Chairman and MD Dr Ajay Thakkar',
  'Received "LIFE TIME ACHIEVEMENT AWARD" for work in Polio Eradication Program at the Rotary Zone Institute, New Delhi, at the hands of RI President Francisco Arezzo, 15th November 2025',
  'Presented during the Shukriya function of Rotary year 2019-20',
  'All members of his entire joint family are Paul Harris Fellows. He is a Major Donor Level-2',
];

export default function AboutPage() {
  return (
    <>
      {/* ── Banner ── */}
      <div className="page-banner" style={{ background: '#000f2b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px' }}>
          <h1
            style={{
              color: '#fff',
              fontFamily: 'var(--font-sarala), Sarala, sans-serif',
              fontWeight: 700,
              margin: '0 0 8px',
            }}
          >
            About Me
          </h1>
          <p style={{ color: '#9dca00', fontSize: '0.875rem', margin: 0 }}>
            <Link href="/" style={{ color: '#9dca00', textDecoration: 'none' }}>
              Home
            </Link>{' '}
            &rsaquo; About Me
          </p>
        </div>
      </div>

      {/* ── Biography ── */}
      <section className="about-section" style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>

          {/* Image + opening paragraphs */}
          <div
            className="about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'clamp(220px, 28%, 320px) 1fr',
              gap: '52px',
              alignItems: 'flex-start',
              marginBottom: '40px',
            }}
          >
            {/* Photo */}
            <div
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 6px 28px rgba(0,15,43,0.15)',
                lineHeight: 0,
              }}
            >
              <Image
                src="/uploads/2020/06/1.jpg"
                alt="Rtn. Ashok Mahajan"
                width={320}
                height={400}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
                priority
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: '#9dca00',
                }}
              />
            </div>

            {/* Bio text – first block */}
            <div
              style={{
                fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                fontSize: '0.97rem',
                color: '#3a3a3a',
                lineHeight: 1.85,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  color: '#000f2b',
                  margin: '0 0 4px',
                }}
              >
                Rtn. Ashok Mahajan
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#9dca00',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: '0 0 24px',
                }}
              >
                Past R.I. Director &nbsp;|&nbsp; Trustee, The Rotary Foundation
              </p>

              <p style={{ margin: '0 0 16px' }}>
                Born in the era of independence (23rd July, 1947), Mr. Mahajan always remembered the teaching of
                his parents about universal brotherhood. He passed his B.E. (Electrical) from Bombay University
                securing a merit position. He continued to excel in his career obtaining distinction in Diploma
                in Operation Management and Diploma in Business Management from Bombay University. While he
                excelled at academics, Mr. Mahajan&apos;s feet were firmly rooted with the social issues that
                dominated the community.
              </p>
              <p style={{ margin: '0 0 16px' }}>
                In 1973, he became a proud senior partner in Raj Industries, but he felt something missing. As
                he began to seek his purpose, he came across Rotary Club, Mulund and became a member of the
                same. Joining the Rotary Club took him one step further to discover the importance of living
                positively for others. With his dedication and compassion, he became the President of the Club
                (1982-83) and served RI as Dist. Governor (93-94) of Dist. 3140. He has been serving the club
                and the District since 1973 and has risen from an ordinary member to the coveted position of
                R.I. Director (2007-2009) and Trustee of The Rotary Foundation (2009-13) by commitment,
                compassion and consistency.
              </p>
              <p style={{ margin: 0 }}>
                As life kept unfolding challenges, Mr. Mahajan accomplished it with humility. While serving
                others, he didn&apos;t count on various success stories he had written.
              </p>
            </div>
          </div>

          {/* Service highlights list – spans full width below the grid */}
          <ul
            style={{
              listStyle: 'none',
              margin: '0 0 40px',
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '10px',
            }}
          >
            {SERVICE_HIGHLIGHTS.map((item, idx) => (
              <li
                key={idx}
                style={{
                  background: '#f5f7f0',
                  borderRadius: '7px',
                  padding: '13px 16px 13px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  borderLeft: '4px solid #9dca00',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#000f2b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3L3.5 5.5L8 1" stroke="#9dca00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: '#3a3a3a',
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Remaining bio paragraphs – full width */}
          <div
            style={{
              fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
              fontSize: '0.97rem',
              color: '#3a3a3a',
              lineHeight: 1.85,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <p style={{ margin: 0 }}>
              As a trustee, he represented the Trustee Chair of The Rotary Foundation at various Rotary zone
              institutes world over. Elected as the Trustee of the Rotary Foundation when he was the serving
              director of Rotary International — quite a rare fortune. Interviewed most of the Rotary
              leaders&apos; world over in person.
            </p>
            <p style={{ margin: 0 }}>
              Published booklets such as <em>Shooting Straight</em>, <em>Face to Face</em>,{' '}
              <em>From Where I Am</em> and <em>Psalms for Leadership</em>.
            </p>
            <p style={{ margin: 0 }}>
              Mr. Mahajan has made a big contribution in eradicating Polio from our country. He played a major
              role in bringing corporates in India to support the Rotary Foundation for Polio Eradication. He
              was instrumental in bringing Muslim religious leaders to support the Polio Eradication program in
              India and that made all the difference. His involvement in the Polio Plus Program has been
              widespread. He has been working with the National Polio Plus Committee for about 10 years now
              and has also served the International Polio Plus Committee from 2009-2013. He realized that he
              is in Rotary to handle the most important purpose of his life: Eradicate Polio and save the
              children of the world.
            </p>
            <p style={{ margin: 0 }}>
              He is a staunch devotee of Shree Shirdi Saibaba. Mr. Mahajan is blessed with a loving wife,
              Nayantara, who supported him in all his commitments. Nayantara is a Past President of Inner
              Wheel Club of Mulund. His family has taught him that everyday holds a new sunshine. His
              children, Nikhil with Monica and Namrata with Nitin, always inspire him about his role in
              Rotary. He is blessed with three grandchildren. All members of his entire joint family are Paul
              Harris Fellows. He is a Major Donor Level-2.
            </p>
            <p style={{ margin: 0 }}>
              Apart from his work, Mr. Mahajan enjoys reading, writing, cricket and social service. Outside
              Rotary too, he has served the society in many ways. Punjab Kesari Club, Council for Fair
              Business Practices and Civil Defence Advisory Committee are a few of his areas of interest.
            </p>
          </div>
        </div>
      </section>

      {/* ── Awards & Achievements ── */}
      <section className="about-section" style={{ background: '#f5f7f0', padding: '72px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ marginBottom: '44px' }}>
            <p
              style={{
                fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#9dca00',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                margin: '0 0 8px',
              }}
            >
              Recognitions
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sarala), Sarala, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: '#000f2b',
                margin: 0,
              }}
            >
              Awards &amp; Achievements
            </h2>
          </div>

          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '12px',
            }}
          >
            {AWARDS.map((item, idx) => (
              <li
                key={idx}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '16px 18px 16px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  borderLeft: '4px solid #9dca00',
                  boxShadow: '0 1px 6px rgba(0,15,43,0.06)',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#9dca00',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#000f2b',
                    fontFamily: 'Sarala, sans-serif',
                  }}
                >
                  {idx + 1}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-pt-sans), PT Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: '#3a3a3a',
                    lineHeight: 1.55,
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <style>{`
        @media (max-width: 680px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-section { padding: 48px 0 !important; }
        }
      `}</style>
    </>
  );
}
