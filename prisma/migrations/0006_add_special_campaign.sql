-- AlterTable: inventory + spares — optional campaign tag for specials
-- (NULL = normal special; 'black-friday' = Black Friday campaign)
ALTER TABLE "inventory" ADD COLUMN IF NOT EXISTS "specialCampaign" TEXT;
ALTER TABLE "spares" ADD COLUMN IF NOT EXISTS "specialCampaign" TEXT;

-- NOTE: additive only. Apply to production BEFORE deploying any code that
-- selects "specialCampaign", otherwise those queries will fail.
