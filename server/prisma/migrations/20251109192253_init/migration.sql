/*
  Warnings:

  - The primary key for the `actaperfil` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `actaperfil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idActa` on the `actaperfil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idPerfiles` on the `actaperfil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `actas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `actas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idUsuario` on the `actas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `actividad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `actividad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `actividadperfil` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `actividadperfil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idPerfil` on the `actividadperfil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idActividad` on the `actividadperfil` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `historialinventario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `historialinventario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idInventario` on the `historialinventario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idUsuario` on the `historialinventario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `inventario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `inventario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `inventarioactividad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `inventarioactividad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idInventario` on the `inventarioactividad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `idActividad` on the `inventarioactividad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `perfiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `perfiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `actaperfil` DROP FOREIGN KEY `ActaPerfil_idActa_fkey`;

-- DropForeignKey
ALTER TABLE `actaperfil` DROP FOREIGN KEY `ActaPerfil_idPerfiles_fkey`;

-- DropForeignKey
ALTER TABLE `actas` DROP FOREIGN KEY `Actas_idUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `actividadperfil` DROP FOREIGN KEY `ActividadPerfil_idActividad_fkey`;

-- DropForeignKey
ALTER TABLE `actividadperfil` DROP FOREIGN KEY `ActividadPerfil_idPerfil_fkey`;

-- DropForeignKey
ALTER TABLE `historialinventario` DROP FOREIGN KEY `HistorialInventario_idInventario_fkey`;

-- DropForeignKey
ALTER TABLE `historialinventario` DROP FOREIGN KEY `HistorialInventario_idUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `inventarioactividad` DROP FOREIGN KEY `InventarioActividad_idActividad_fkey`;

-- DropForeignKey
ALTER TABLE `inventarioactividad` DROP FOREIGN KEY `InventarioActividad_idInventario_fkey`;

-- DropIndex
DROP INDEX `Actas_idUsuario_fkey` ON `actas`;

-- AlterTable
ALTER TABLE `actaperfil` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `idActa` INTEGER NOT NULL,
    MODIFY `idPerfiles` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `actas` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `idUsuario` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `actividad` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `actividadperfil` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `idPerfil` INTEGER NOT NULL,
    MODIFY `idActividad` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `historialinventario` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `idInventario` INTEGER NOT NULL,
    MODIFY `idUsuario` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `inventario` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `inventarioactividad` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `idInventario` INTEGER NOT NULL,
    MODIFY `idActividad` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `perfiles` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `usuario` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `HistorialInventario` ADD CONSTRAINT `HistorialInventario_idInventario_fkey` FOREIGN KEY (`idInventario`) REFERENCES `Inventario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialInventario` ADD CONSTRAINT `HistorialInventario_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Actas` ADD CONSTRAINT `Actas_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActividadPerfil` ADD CONSTRAINT `ActividadPerfil_idPerfil_fkey` FOREIGN KEY (`idPerfil`) REFERENCES `Perfiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActividadPerfil` ADD CONSTRAINT `ActividadPerfil_idActividad_fkey` FOREIGN KEY (`idActividad`) REFERENCES `Actividad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventarioActividad` ADD CONSTRAINT `InventarioActividad_idInventario_fkey` FOREIGN KEY (`idInventario`) REFERENCES `Inventario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventarioActividad` ADD CONSTRAINT `InventarioActividad_idActividad_fkey` FOREIGN KEY (`idActividad`) REFERENCES `Actividad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActaPerfil` ADD CONSTRAINT `ActaPerfil_idActa_fkey` FOREIGN KEY (`idActa`) REFERENCES `Actas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActaPerfil` ADD CONSTRAINT `ActaPerfil_idPerfiles_fkey` FOREIGN KEY (`idPerfiles`) REFERENCES `Perfiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
