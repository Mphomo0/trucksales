-- CreateTable: ChatbotErrorLog
CREATE TABLE "ChatbotErrorLog" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "statusCode" INTEGER,
    "message" TEXT NOT NULL,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatbotErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE INDEX "ChatbotErrorLog_createdAt_idx" ON "ChatbotErrorLog"("createdAt");
CREATE INDEX "ChatbotErrorLog_model_createdAt_idx" ON "ChatbotErrorLog"("model", "createdAt");
CREATE INDEX "ChatbotErrorLog_errorType_createdAt_idx" ON "ChatbotErrorLog"("errorType", "createdAt");
