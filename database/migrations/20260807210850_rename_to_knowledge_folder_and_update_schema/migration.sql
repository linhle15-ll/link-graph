/*
  Warnings:

  - You are about to drop the column `knowledgeFileId` on the `Edge` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Edge` table. All the data in the column will be lost.
  - You are about to drop the column `knowledgeFileId` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the `KnowledgeFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EdgeToNode` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstNodeId` to the `Edge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `knowledgeFolderId` to the `Edge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondNodeId` to the `Edge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `knowledgeFolderId` to the `Node` table without a default value. This is not possible if the table is not empty.
  - Made the column `link` on table `Node` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Edge" DROP CONSTRAINT "Edge_knowledgeFileId_fkey";

-- DropForeignKey
ALTER TABLE "KnowledgeFile" DROP CONSTRAINT "KnowledgeFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_knowledgeFileId_fkey";

-- DropForeignKey
ALTER TABLE "_EdgeToNode" DROP CONSTRAINT "_EdgeToNode_A_fkey";

-- DropForeignKey
ALTER TABLE "_EdgeToNode" DROP CONSTRAINT "_EdgeToNode_B_fkey";

-- AlterTable
ALTER TABLE "Edge" DROP COLUMN "knowledgeFileId",
DROP COLUMN "reason",
ADD COLUMN     "firstNodeId" INTEGER NOT NULL,
ADD COLUMN     "knowledgeFolderId" INTEGER NOT NULL,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "secondNodeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "knowledgeFileId",
ADD COLUMN     "isOnGraph" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "knowledgeFolderId" INTEGER NOT NULL,
ADD COLUMN     "posX" DOUBLE PRECISION,
ADD COLUMN     "posY" DOUBLE PRECISION,
ALTER COLUMN "authors" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "link" SET NOT NULL;

-- DropTable
DROP TABLE "KnowledgeFile";

-- DropTable
DROP TABLE "_EdgeToNode";

-- CreateTable
CREATE TABLE "KnowledgeFolder" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeFolder_title_key" ON "KnowledgeFolder"("title");

-- AddForeignKey
ALTER TABLE "KnowledgeFolder" ADD CONSTRAINT "KnowledgeFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_knowledgeFolderId_fkey" FOREIGN KEY ("knowledgeFolderId") REFERENCES "KnowledgeFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_firstNodeId_fkey" FOREIGN KEY ("firstNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_secondNodeId_fkey" FOREIGN KEY ("secondNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_knowledgeFolderId_fkey" FOREIGN KEY ("knowledgeFolderId") REFERENCES "KnowledgeFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
