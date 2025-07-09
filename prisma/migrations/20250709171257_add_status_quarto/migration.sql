/*
  Warnings:

  - You are about to drop the column `encerradaEm` on the `Quarto` table. All the data in the column will be lost.
  - You are about to drop the column `observacao` on the `Quarto` table. All the data in the column will be lost.
  - Added the required column `observacoes` to the `Quarto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quarto" DROP COLUMN "encerradaEm",
DROP COLUMN "observacao",
ADD COLUMN     "encerradoEm" TIMESTAMP(3),
ADD COLUMN     "observacoes" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ativo';
