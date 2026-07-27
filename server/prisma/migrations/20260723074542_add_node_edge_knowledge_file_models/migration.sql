/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "KnowledgeFile" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "contentSummary" TEXT NOT NULL,
    "text" TEXT,
    "tags" TEXT[],
    "author" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "knowledgeFileId" INTEGER NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" SERIAL NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "knowledgeFileId" INTEGER NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeEdge" (
    "nodeId" INTEGER NOT NULL,
    "edgeId" INTEGER NOT NULL,

    CONSTRAINT "NodeEdge_pkey" PRIMARY KEY ("nodeId","edgeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_knowledgeFileId_key" ON "Node"("knowledgeFileId");

-- CreateIndex
CREATE UNIQUE INDEX "Edge_knowledgeFileId_key" ON "Edge"("knowledgeFileId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_knowledgeFileId_fkey" FOREIGN KEY ("knowledgeFileId") REFERENCES "KnowledgeFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_knowledgeFileId_fkey" FOREIGN KEY ("knowledgeFileId") REFERENCES "KnowledgeFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEdge" ADD CONSTRAINT "NodeEdge_edgeId_fkey" FOREIGN KEY ("edgeId") REFERENCES "Edge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
