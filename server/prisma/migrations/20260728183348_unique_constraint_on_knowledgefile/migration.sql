/*
  Warnings:

  - You are about to drop the column `tags` on the `Edge` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the `NodeEdge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `KnowledgeFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Edge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `KnowledgeFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `KnowledgeFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NodeEdge" DROP CONSTRAINT "NodeEdge_edgeId_fkey";

-- DropForeignKey
ALTER TABLE "NodeEdge" DROP CONSTRAINT "NodeEdge_nodeId_fkey";

-- DropIndex
DROP INDEX "Edge_knowledgeFileId_key";

-- DropIndex
DROP INDEX "Node_knowledgeFileId_key";

-- AlterTable
ALTER TABLE "Edge" DROP COLUMN "tags",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "KnowledgeFile" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "author",
DROP COLUMN "site",
DROP COLUMN "tags",
DROP COLUMN "text",
ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "source" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "link" DROP NOT NULL,
ALTER COLUMN "contentSummary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "NodeEdge";

-- CreateTable
CREATE TABLE "_EdgeToNode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EdgeToNode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EdgeToNode_B_index" ON "_EdgeToNode"("B");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeFile_title_key" ON "KnowledgeFile"("title");

-- AddForeignKey
ALTER TABLE "KnowledgeFile" ADD CONSTRAINT "KnowledgeFile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EdgeToNode" ADD CONSTRAINT "_EdgeToNode_A_fkey" FOREIGN KEY ("A") REFERENCES "Edge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EdgeToNode" ADD CONSTRAINT "_EdgeToNode_B_fkey" FOREIGN KEY ("B") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
