-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2024 at 03:55 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_2205477_farrelsetiapratama_uas`
--

-- --------------------------------------------------------

--
-- Table structure for table `inventory_farrelsetiapratama`
--

CREATE TABLE `inventory_farrelsetiapratama` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(25) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga_satuan` int(10) UNSIGNED NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `deskripsi` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_farrelsetiapratama`
--

INSERT INTO `inventory_farrelsetiapratama` (`id`, `nama_barang`, `jumlah`, `harga_satuan`, `lokasi`, `deskripsi`) VALUES
(9, 'Mouse', 10, 300000, 'Bandung', 'Razer'),
(11, 'Baju', 100, 65000, 'Jakarta', 'Kaos Polos');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory_farrelsetiapratama`
--
ALTER TABLE `inventory_farrelsetiapratama`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory_farrelsetiapratama`
--
ALTER TABLE `inventory_farrelsetiapratama`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
