-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nombre_usuario` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `contrasenia` VARCHAR(191) NOT NULL,
    `ultimo_inicio_sesion` DATETIME(3) NULL,

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    INDEX `Usuario_nombre_usuario_idx`(`nombre_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Perfiles` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `fechaNacimiento` DATETIME(3) NOT NULL,
    `cedula` VARCHAR(191) NOT NULL,
    `rol` ENUM('Admin', 'Adulto', 'Voluntario', 'Socio') NOT NULL,
    `fotoURL` VARCHAR(191) NULL,
    `telefonoContacto` VARCHAR(191) NULL,
    `numeroCelular` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',

    UNIQUE INDEX `Perfiles_cedula_key`(`cedula`),
    INDEX `Perfiles_rol_idx`(`rol`),
    INDEX `Perfiles_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actividad` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `fechaActividad` DATETIME(3) NOT NULL,
    `horaInicio` DATETIME(3) NOT NULL,
    `duracion` INTEGER NOT NULL,
    `tipoActividad` ENUM('Pintar', 'Cognitivo', 'Baile', 'Quiting', 'Generales') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Actividad_fechaActividad_idx`(`fechaActividad`),
    INDEX `Actividad_tipoActividad_idx`(`tipoActividad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventario` (
    `id` VARCHAR(191) NOT NULL,
    `idCategoria` ENUM('Medicinas', 'Materiales', 'ActivosFijos') NOT NULL,
    `Nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Inventario_idCategoria_idx`(`idCategoria`),
    INDEX `Inventario_estado_idx`(`estado`),
    INDEX `Inventario_Nombre_idx`(`Nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialInventario` (
    `id` VARCHAR(191) NOT NULL,
    `idInventario` VARCHAR(191) NOT NULL,
    `idUsuario` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `descripcion` VARCHAR(191) NULL,
    `tipoMovimiento` ENUM('ADD', 'DELETE') NOT NULL,

    INDEX `HistorialInventario_idInventario_fecha_idx`(`idInventario`, `fecha`),
    INDEX `HistorialInventario_idUsuario_idx`(`idUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actas` (
    `id` VARCHAR(191) NOT NULL,
    `URL` VARCHAR(191) NOT NULL,
    `idUsuario` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Actas_fecha_idx`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActividadPerfil` (
    `id` VARCHAR(191) NOT NULL,
    `idPerfil` VARCHAR(191) NOT NULL,
    `idActividad` VARCHAR(191) NOT NULL,

    INDEX `ActividadPerfil_idActividad_idx`(`idActividad`),
    UNIQUE INDEX `ActividadPerfil_idPerfil_idActividad_key`(`idPerfil`, `idActividad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventarioActividad` (
    `id` VARCHAR(191) NOT NULL,
    `idInventario` VARCHAR(191) NOT NULL,
    `idActividad` VARCHAR(191) NOT NULL,

    INDEX `InventarioActividad_idActividad_idx`(`idActividad`),
    UNIQUE INDEX `InventarioActividad_idInventario_idActividad_key`(`idInventario`, `idActividad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActaPerfil` (
    `id` VARCHAR(191) NOT NULL,
    `idActa` VARCHAR(191) NOT NULL,
    `idPerfiles` VARCHAR(191) NOT NULL,

    INDEX `ActaPerfil_idPerfiles_idx`(`idPerfiles`),
    UNIQUE INDEX `ActaPerfil_idActa_idPerfiles_key`(`idActa`, `idPerfiles`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
