-- Leads inherited the 30-day chat-session TTL, so the cleanup job would delete
-- them -- and the marketing attribution attached to them -- a month after
-- capture, while a truck deal can still be in progress.
--
-- Application code now stamps a 730-day expiry (LEAD_RETENTION_DAYS in
-- lib/services/lead-management.ts). Bring rows captured before that change into
-- line, so no existing lead is lost to the old TTL.

UPDATE "ChatLead"
SET "expiresAt" = "createdAt" + INTERVAL '730 days'
WHERE "expiresAt" < "createdAt" + INTERVAL '730 days';
