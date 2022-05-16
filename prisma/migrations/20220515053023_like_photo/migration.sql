-- CreateTable
CREATE TABLE "_LikedPhotos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikedPhotos_AB_unique" ON "_LikedPhotos"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedPhotos_B_index" ON "_LikedPhotos"("B");

-- AddForeignKey
ALTER TABLE "_LikedPhotos" ADD CONSTRAINT "_LikedPhotos_A_fkey" FOREIGN KEY ("A") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPhotos" ADD CONSTRAINT "_LikedPhotos_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
