-- AlterTable: ChatLead — marketing attribution + contact-form fields
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "subject" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "branch" TEXT;

ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "channel" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "utmSource" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "utmMedium" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "utmTerm" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "utmContent" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "gclid" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "fbclid" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "referrer" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "referrerDomain" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "landingPath" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "firstTouchAt" TIMESTAMP(3);
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "heardAboutUs" TEXT;
ALTER TABLE "ChatLead" ADD COLUMN IF NOT EXISTS "distinctId" TEXT;

-- NOTE: additive only, so it is safe to run against a database whose
-- application code has not been deployed yet. Removing the "source" default
-- happens in 0004, which must run only AFTER the new code is live.

-- CreateIndexes
CREATE INDEX IF NOT EXISTS "ChatLead_source_idx" ON "ChatLead"("source");
CREATE INDEX IF NOT EXISTS "ChatLead_channel_idx" ON "ChatLead"("channel");
