-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Mar 2021 pada 16.08
-- Versi server: 10.4.16-MariaDB
-- Versi PHP: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cn_chat`
--

CREATE TABLE `cn_chat` (
  `id_chat` int(11) NOT NULL,
  `message` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `id_group_chat` varchar(100) NOT NULL,
  `time_chat` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cn_chat`
--

INSERT INTO `cn_chat` (`id_chat`, `message`, `user_id`, `id_group_chat`, `time_chat`) VALUES
(31, 'Cek aldi', 9, 'ali_aldi', '08:10 24/03/2021'),
(32, 'yoo', 1, 'ali_aldi', '08:10 24/03/2021'),
(33, 'Nek POD nya yg ascp week jg jadi dah bener datanya, cuma ini dia minta kumulatif, jd nek skrg m2, haruse yg tmpil m1+m2, nek skrg m3, yg tampil haruse m1+m2+m3. Nah ini lg ta cb ubah dr query nya aja dlu.', 9, 'ali_aldi', '08:10 24/03/2021'),
(34, 'ok', 1, 'ali_aldi', '08:11 24/03/2021'),
(35, 'if you upload the next sketch to your ESP8266 board, it should automatically assign the fixed IP address 192.168.1.184', 9, 'ali_aldi', '08:12 24/03/2021'),
(36, 'Anggaran Bantuan Usaha Mikro Tembus Rp15,36 T pada 2021', 1, 'ali_aldi', '08:13 24/03/2021'),
(37, 'Try to be better tech', 9, 'ali_aldi', '08:14 24/03/2021'),
(38, 'Keep your passion', 9, 'ali_aldi', '08:14 24/03/2021'),
(39, 'Andi..', 9, 'ali_andi', '08:16 24/03/2021'),
(40, 'Mbd 1 cek', 9, 'ali_aldi', '06:26 25/03/2021'),
(41, 'cek', 1, 'ali_aldi', '06:26 25/03/2021'),
(42, '', 1, 'andi_aldi', '20:16 28/03/2021'),
(43, 'cek', 9, 'ali_aldi', '21:07 28/03/2021');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cn_friend`
--

CREATE TABLE `cn_friend` (
  `id` int(11) NOT NULL,
  `id_friend` int(11) NOT NULL,
  `id_group_chat` varchar(200) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cn_friend`
--

INSERT INTO `cn_friend` (`id`, `id_friend`, `id_group_chat`, `id_user`) VALUES
(3, 1, 'andi_aldi', 2),
(4, 1, 'alex_aldi', 3),
(6, 2, 'alex_andi', 3),
(7, 1, 'ali_aldi', 9),
(14, 3, 'aldi_alex', 1),
(15, 9, 'aldi_ali', 1),
(16, 1, 'enjel_aldi', 22),
(17, 22, 'aldi_enjel', 1),
(31, 2, 'aldi_andi', 1),
(32, 21, 'ali_kirana', 9);

-- --------------------------------------------------------

--
-- Struktur dari tabel `cn_user`
--

CREATE TABLE `cn_user` (
  `id_user` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `img_profile` varchar(100) NOT NULL,
  `last_online` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cn_user`
--

INSERT INTO `cn_user` (`id_user`, `name`, `username`, `password`, `img_profile`, `last_online`) VALUES
(1, 'Aldi Pradana', 'aldi', '123456', '', ''),
(2, 'Andi Salahuddin Ahmad', 'andi', '12345', '', ''),
(3, 'Alexander GG', 'alex', '123456', '', ''),
(9, 'aliyosa', 'ali', '12345', '', ''),
(21, 'kiranaaja', 'kirana', '123456', '', ''),
(22, 'enjel Lina Novita Sari', 'enjel', 'enjel', '', '');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `cn_chat`
--
ALTER TABLE `cn_chat`
  ADD PRIMARY KEY (`id_chat`);

--
-- Indeks untuk tabel `cn_friend`
--
ALTER TABLE `cn_friend`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `cn_user`
--
ALTER TABLE `cn_user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `cn_chat`
--
ALTER TABLE `cn_chat`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT untuk tabel `cn_friend`
--
ALTER TABLE `cn_friend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT untuk tabel `cn_user`
--
ALTER TABLE `cn_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
