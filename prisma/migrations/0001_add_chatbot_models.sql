-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');

-- CreateTable: WebsiteContentChunk
CREATE TABLE "WebsiteContentChunk" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WebsiteContentChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ChatSession
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ChatMessage
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ChatLead
CREATE TABLE "ChatLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "interestedVehicle" TEXT,
    "vehicleId" TEXT,
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'chatbot',
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChatLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable: IndexingLog
CREATE TABLE "IndexingLog" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "pagesIndexed" INTEGER,
    "chunksCreated" INTEGER,
    "chunksUpdated" INTEGER,
    "chunksDeleted" INTEGER,
    "chunksSkipped" INTEGER,
    "error" TEXT,
    CONSTRAINT "IndexingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE INDEX "WebsiteContentChunk_url_idx" ON "WebsiteContentChunk"("url");
CREATE INDEX "WebsiteContentChunk_contentHash_idx" ON "WebsiteContentChunk"("contentHash");
CREATE INDEX "WebsiteContentChunk_pageType_idx" ON "WebsiteContentChunk"("pageType");

CREATE UNIQUE INDEX "ChatSession_sessionId_key" ON "ChatSession"("sessionId");
CREATE INDEX "ChatSession_expiresAt_idx" ON "ChatSession"("expiresAt");

CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
CREATE INDEX "ChatMessage_expiresAt_idx" ON "ChatMessage"("expiresAt");

CREATE INDEX "ChatLead_status_idx" ON "ChatLead"("status");
CREATE INDEX "ChatLead_createdAt_idx" ON "ChatLead"("createdAt");
CREATE INDEX "ChatLead_expiresAt_idx" ON "ChatLead"("expiresAt");
CREATE INDEX "ChatLead_emailSent_idx" ON "ChatLead"("emailSent");

CREATE INDEX "IndexingLog_status_idx" ON "IndexingLog"("status");
CREATE INDEX "IndexingLog_startedAt_idx" ON "IndexingLog"("startedAt");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
