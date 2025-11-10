-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityKey" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "performedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
