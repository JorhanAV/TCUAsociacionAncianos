/*
  Warnings:

  - Added the required column `rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `rol` ENUM('Admin', 'Adulto', 'Voluntario', 'Socio') NOT NULL;

-- CreateIndex
CREATE INDEX `Usuario_rol_idx` ON `Usuario`(`rol`);
