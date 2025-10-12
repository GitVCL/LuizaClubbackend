-- CreateTable
CREATE TABLE "Drinks" (
    "id" TEXT NOT NULL,
    "funcionaria" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "comissao" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "meta" INTEGER NOT NULL DEFAULT 20,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFim" TIMESTAMP(3) NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Drinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drinks" ADD CONSTRAINT "Drinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
