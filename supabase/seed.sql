-- ============================================================
--  SEED DATA — optional starter content for a live Supabase project.
--  Run AFTER schema.sql. Mirrors the built-in sample dataset so a
--  freshly-connected project isn't empty.
--
--  Images use Unsplash for convenience — replace with your own
--  uploads (Storage) once you're live.
-- ============================================================

-- Artist profile
insert into profiles (display_name, tagline, bio, avatar_url, location, email, instagram, twitter, behance)
values (
  'Nagibu Semwanga',
  'Kampala-based artist drawing quiet worlds & the characters who wander them.',
  E'I''m an illustrator and digital painter working between traditional graphite and digital light. My work lives at the seam between memory and invention.\n\nI take on a limited number of commissions each season and sell both originals and archival prints.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'Kampala, Uganda',
  'studio@nagibusemwanga.art',
  'nagibu.draws', 'nagibudraws', 'nagibusemwanga'
)
on conflict do nothing;

-- Categories
insert into artwork_categories (name, slug, description, sort_order) values
  ('Featured Art',     'featured-art',     'Signature pieces, hand-picked.',        1),
  ('Character Art',    'character-art',    'Original characters and design work.',  2),
  ('Sketches',         'sketches',         'Raw studies and quick captures.',       3),
  ('Digital Painting', 'digital-painting', 'Painterly digital compositions.',       4),
  ('Illustration',     'illustration',     'Narrative and editorial illustration.', 5)
on conflict (slug) do nothing;

-- Artworks (category resolved by slug)
insert into artworks (title, slug, description, category_id, price, currency, status, medium, dimensions, year_created, featured_image_url, is_new)
select v.title, v.slug, v.description,
       (select id from artwork_categories where slug = v.cat),
       v.price, 'UGX', v.status::artwork_status, v.medium, v.dimensions, v.year, v.img, v.is_new
from (values
  ('Ember Requiem','ember-requiem','A lone figure suspended in a field of dying light.','digital-painting',5200000,'available','Digital painting','5400 × 7200 px',2026,'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80',true),
  ('The Cartographer''s Dream','cartographers-dream','An imagined city folded from paper and starlight.','illustration',3600000,'available','Ink & digital','4000 × 5000 px',2026,'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=1200&q=80',true),
  ('Saffron','saffron','Character study of a desert wanderer.','character-art',2300000,'sold','Digital','3600 × 4800 px',2025,'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80',false),
  ('Grey Morning Study','grey-morning-study','A twenty-minute graphite study.','sketches',680000,'available','Graphite on paper','A4',2026,'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',true),
  ('Neon Hymn','neon-hymn','The city breathes in magenta.','digital-painting',4100000,'reserved','Digital painting','6000 × 4000 px',2025,'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',false),
  ('Foxglove','foxglove','A woodland spirit in soft botanical tones.','character-art',2750000,'available','Digital','4000 × 5200 px',2026,'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1200&q=80',false),
  ('Marigold Procession','marigold-procession','Festival illustration bursting with warmth.','illustration',3800000,'available','Digital','6000 × 4000 px',2026,'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80',false),
  ('Quiet Machines','quiet-machines','Mechanical study in graphite.','sketches',780000,'available','Graphite on paper','A3',2026,'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=1200&q=80',true)
) as v(title, slug, description, cat, price, status, medium, dimensions, year, img, is_new)
on conflict (slug) do nothing;

-- Animations
insert into animations (title, slug, description, thumbnail_url, video_url, duration, status) values
  ('Lantern','lantern','A 12-second loop following a paper lantern.','https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1200&q=80','https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','0:12','published'),
  ('First Light','first-light','Animated study of dawn breaking over water.','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80','https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4','0:20','published')
on conflict (slug) do nothing;

-- Collections
insert into collections (title, slug, description, cover_image_url) values
  ('The Wanderers','the-wanderers','Original characters who travel between imagined worlds.','https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80'),
  ('Nocturnes','nocturnes','Paintings made after dark, about the dark.','https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80')
on conflict (slug) do nothing;

-- Sample commission request
insert into commission_requests (client_name, client_email, commission_type, budget, description, status)
values ('Priya Anand','priya@example.com','Character Design','3,000,000–4,500,000 UGX','Two original characters for a tabletop campaign.','new')
on conflict do nothing;

-- Courses + lessons
insert into courses (title, slug, description, thumbnail_url, price, currency, level, status) values
  ('Digital Painting: Light & Mood','digital-painting-light-mood','A hands-on course on building atmosphere with light — value, colour temperature, edges and glazing.','https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80',120000,'UGX','Beginner → Intermediate','published'),
  ('Character Design Foundations','character-design-foundations','Developing original characters — silhouette, shape language, expression sheets and turnarounds.','https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80',95000,'UGX','All levels','published')
on conflict (slug) do nothing;

insert into course_lessons (course_id, title, description, video_url, duration, sort_order, is_preview)
select c.id, v.title, v.descr, v.url, v.dur, v.ord, v.preview
from (values
  ('digital-painting-light-mood','Welcome & setup','Brushes, canvas and how the course works.','https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','6:20',1,true),
  ('digital-painting-light-mood','Thinking in values','Blocking light and shadow before colour.','https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4','18:04',2,false),
  ('digital-painting-light-mood','Colour temperature','Warm light, cool shadow, and why it reads.','https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4','22:11',3,false),
  ('character-design-foundations','Shape language','Reading personality from silhouette.','https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','14:50',1,true),
  ('character-design-foundations','Expression sheets','Giving a character range.','https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4','19:22',2,false)
) as v(cslug, title, descr, url, dur, ord, preview)
join courses c on c.slug = v.cslug
on conflict do nothing;
