-- CreateTable
CREATE TABLE "Favorites" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);
