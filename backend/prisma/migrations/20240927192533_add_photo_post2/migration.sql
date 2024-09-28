/*
  Warnings:

  - You are about to drop the column `photo` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "photo",
ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'https://blog.snappymob.com/wp-content/uploads/2020/12/8-Tips-for-Designing-Empty-Placeholder-Pages-Leni-Featured.png';
