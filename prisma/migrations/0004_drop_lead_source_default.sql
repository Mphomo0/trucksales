-- Run this ONLY after the code that passes an explicit `source` is deployed.
--
-- Until then the live application relies on this default to fill the column,
-- so dropping it early makes every chatbot lead insert fail a NOT NULL check.

-- Defensive: nothing should be NULL while the default still exists.
UPDATE "ChatLead" SET "source" = 'chatbot' WHERE "source" IS NULL;

-- The default silently labelled every lead "chatbot" whatever the actual
-- origin. Inserts must now state the form explicitly.
ALTER TABLE "ChatLead" ALTER COLUMN "source" DROP DEFAULT;
