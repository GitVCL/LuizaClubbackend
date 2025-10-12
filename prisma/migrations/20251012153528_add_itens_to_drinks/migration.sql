/*
  Warnings:

  - Added the required column `itens` to the `Drinks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drinks" ADD COLUMN     "itens" JSONB NOT NULL;
