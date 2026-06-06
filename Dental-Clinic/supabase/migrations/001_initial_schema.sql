-- Harborline Dental — initial production schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Enums
CREATE TYPE appointment_status AS ENUM (
  'pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show', 'rescheduled'
);
CREATE TYPE appointment_type AS ENUM ('standard', 'emergency', 'follow_up');
CREATE TYPE appointment_source AS ENUM ('website', 'admin', 'phone');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'booked', 'closed_won', 'closed_lost');
CREATE TYPE lead_source AS ENUM ('contact_form', 'appointment_form', 'service_page', 'emergency', 'phone_callback', 'chat', 'referral');
CREATE TYPE review_status AS ENUM ('pending', 'published', 'hidden', 'flagged');
CREATE TYPE review_source AS ENUM ('google', 'website', 'manual', 'imported');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE admin_role AS ENUM ('super_admin', 'practice_manager', 'front_desk', 'clinician', 'marketing', 'read_only');
CREATE TYPE notification_channel AS ENUM ('email', 'sms');
CREATE TYPE notification_type AS ENUM ('confirmation', 'reminder_24h', 'reminder_2h', 'rescheduled', 'cancelled', 'admin_alert');
CREATE TYPE notification_status AS ENUM ('scheduled', 'sent', 'failed', 'cancelled');
CREATE TYPE day_of_week AS ENUM ('monday','tuesday','wednesday','thursday','friday','saturday','sunday');

-- Site settings (key-value)
CREATE TABLE site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(80) UNIQUE NOT NULL,
  street      VARCHAR(200) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  state       CHAR(2) NOT NULL,
  zip         VARCHAR(10) NOT NULL,
  timezone    VARCHAR(50) NOT NULL DEFAULT 'America/Los_Angeles',
  phone       VARCHAR(20) NOT NULL,
  latitude    DECIMAL(10,7),
  longitude   DECIMAL(10,7),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  VARCHAR(80) UNIQUE NOT NULL,
  name                  VARCHAR(150) NOT NULL,
  duration_minutes      INT NOT NULL DEFAULT 60,
  buffer_minutes        INT NOT NULL DEFAULT 10,
  price_from            DECIMAL(10,2),
  is_emergency_eligible BOOLEAN NOT NULL DEFAULT false,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  sort_order            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE service_content (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id        UUID UNIQUE NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  seo_title         VARCHAR(70),
  meta_description  VARCHAR(160),
  hero_eyebrow      VARCHAR(100),
  hero_headline     VARCHAR(200),
  hero_subheadline  TEXT,
  explanation_title VARCHAR(200),
  explanation_body  JSONB NOT NULL DEFAULT '[]',
  benefits          JSONB NOT NULL DEFAULT '[]',
  process_steps     JSONB NOT NULL DEFAULT '[]',
  local_seo_title   VARCHAR(200),
  local_seo_body    JSONB DEFAULT '[]',
  cta_headline      VARCHAR(200),
  cta_subheadline   TEXT,
  cta_primary_label VARCHAR(100),
  related_slugs     JSONB DEFAULT '[]',
  is_published      BOOLEAN NOT NULL DEFAULT true,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE service_faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE staff_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(80) UNIQUE NOT NULL,
  full_name       VARCHAR(150) NOT NULL,
  job_title       VARCHAR(120) NOT NULL,
  credentials     VARCHAR(100),
  bio_short       TEXT,
  bio_long        TEXT,
  photo_url       VARCHAR(500),
  email           VARCHAR(255),
  specialties     JSONB DEFAULT '[]',
  display_order   INT NOT NULL DEFAULT 0,
  show_on_website BOOLEAN NOT NULL DEFAULT true,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE doctors (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_profile_id      UUID UNIQUE REFERENCES staff_profiles(id),
  location_id           UUID REFERENCES locations(id),
  slug                  VARCHAR(80) UNIQUE NOT NULL,
  full_name             VARCHAR(150) NOT NULL,
  default_slot_minutes  INT NOT NULL DEFAULT 30,
  accepts_emergency     BOOLEAN NOT NULL DEFAULT false,
  is_active             BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE doctor_services (
  doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, service_id)
);

CREATE TABLE doctor_schedules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id    UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week  day_of_week NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE doctor_time_off (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  reason      VARCHAR(255),
  CHECK (ends_at > starts_at)
);

CREATE TABLE patients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) NOT NULL,
  phone             VARCHAR(20) NOT NULL,
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  date_of_birth     DATE,
  is_new_patient    BOOLEAN NOT NULL DEFAULT true,
  insurance_provider VARCHAR(120),
  sms_opt_in        BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE appointments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_code   VARCHAR(10) UNIQUE NOT NULL,
  patient_id          UUID NOT NULL REFERENCES patients(id),
  doctor_id           UUID REFERENCES doctors(id),
  service_id          UUID NOT NULL REFERENCES services(id),
  location_id         UUID REFERENCES locations(id),
  starts_at           TIMESTAMPTZ NOT NULL,
  ends_at             TIMESTAMPTZ NOT NULL,
  status              appointment_status NOT NULL DEFAULT 'pending',
  type                appointment_type NOT NULL DEFAULT 'standard',
  source              appointment_source NOT NULL DEFAULT 'website',
  patient_notes       TEXT,
  internal_notes      TEXT,
  cancelled_at        TIMESTAMPTZ,
  cancelled_by        VARCHAR(20),
  cancellation_reason TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

ALTER TABLE appointments
  ADD CONSTRAINT no_doctor_overlap
  EXCLUDE USING gist (
    doctor_id WITH =,
    tstzrange(starts_at, ends_at) WITH &&
  ) WHERE (status IN ('pending', 'confirmed', 'checked_in') AND doctor_id IS NOT NULL);

CREATE TABLE appointment_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  actor_type      VARCHAR(20) NOT NULL,
  action          VARCHAR(50) NOT NULL,
  old_values      JSONB,
  new_values      JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  UUID REFERENCES appointments(id) ON DELETE CASCADE,
  channel         notification_channel NOT NULL,
  type            notification_type NOT NULL,
  status          notification_status NOT NULL DEFAULT 'scheduled',
  recipient       VARCHAR(255) NOT NULL,
  scheduled_for   TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at         TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contact_leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name       VARCHAR(100),
  last_name        VARCHAR(100),
  email            VARCHAR(255),
  phone            VARCHAR(20),
  message          TEXT,
  service_interest VARCHAR(80),
  source           lead_source NOT NULL DEFAULT 'contact_form',
  source_page      VARCHAR(500),
  status           lead_status NOT NULL DEFAULT 'new',
  assigned_to      UUID,
  patient_id       UUID REFERENCES patients(id),
  appointment_id   UUID REFERENCES appointments(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name     VARCHAR(150) NOT NULL,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body            TEXT NOT NULL,
  treatment_tag   VARCHAR(80),
  doctor_id       UUID REFERENCES doctors(id),
  source          review_source NOT NULL DEFAULT 'website',
  external_id     VARCHAR(120),
  status          review_status NOT NULL DEFAULT 'pending',
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  admin_reply     TEXT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blog_categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug  VARCHAR(80) UNIQUE NOT NULL,
  name  VARCHAR(100) NOT NULL
);

CREATE TABLE blog_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              VARCHAR(200) UNIQUE NOT NULL,
  title             VARCHAR(200) NOT NULL,
  excerpt           TEXT,
  content           TEXT NOT NULL,
  featured_image_url VARCHAR(500),
  category_id       UUID REFERENCES blog_categories(id),
  author_id         UUID REFERENCES staff_profiles(id),
  related_service_slug VARCHAR(80),
  status            post_status NOT NULL DEFAULT 'draft',
  published_at      TIMESTAMPTZ,
  seo_title         VARCHAR(70),
  meta_description  VARCHAR(160),
  view_count        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gallery_cases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200) NOT NULL,
  category    VARCHAR(80),
  before_url  VARCHAR(500) NOT NULL,
  after_url   VARCHAR(500) NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE faq_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    VARCHAR(80),
  sort_order  INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE seo_pages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path              VARCHAR(500) UNIQUE NOT NULL,
  page_type         VARCHAR(30) NOT NULL,
  seo_title         VARCHAR(70),
  meta_description  VARCHAR(160),
  h1_override       VARCHAR(200),
  canonical_url     VARCHAR(500),
  robots_index      BOOLEAN NOT NULL DEFAULT true,
  og_image_url      VARCHAR(500),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admin_users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           VARCHAR(255) UNIQUE NOT NULL,
  full_name       VARCHAR(150) NOT NULL,
  role            admin_role NOT NULL DEFAULT 'front_desk',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_starts_at ON appointments(starts_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_leads_status ON contact_leads(status, created_at DESC);
CREATE INDEX idx_blog_posts_status ON blog_posts(status, published_at DESC);
CREATE INDEX idx_reviews_status ON reviews(status);
