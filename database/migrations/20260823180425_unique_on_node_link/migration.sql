/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Node` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Node_link_key" ON "Node"("link");
