-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Jul 2021 pada 17.02
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
  `time_chat` varchar(100) NOT NULL,
  `who` varchar(200) NOT NULL,
  `img` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cn_chat`
--

INSERT INTO `cn_chat` (`id_chat`, `message`, `user_id`, `id_group_chat`, `time_chat`, `who`, `img`) VALUES
(62, 'zakrsdsffs', 2, 'erwin_zake', '19:58 26/07/2021', 'zake', ''),
(85, 'erwin', 4, 'erwin_eren', '20:13 26/07/2021', 'erwin', ''),
(87, 'Yoo', 2, 'erwin_eren', '20:13 26/07/2021', 'erwin', ''),
(89, 'Eren Yeager send an image!', 4, 'erwin_eren', '20:14 26/07/2021', 'erwin', '/img/ss2v5/16273052480537e3382d49d71100d2f1796db404dd00f.jpg'),
(91, 'Okok', 2, 'erwin_eren', '20:14 26/07/2021', 'erwin', ''),
(93, 'Eren....', 2, 'erwin_eren', '20:15 26/07/2021', 'erwin', ''),
(94, 'Eren....', 2, 'erwin_eren', '20:15 26/07/2021', 'eren', ''),
(95, 'hhhh', 4, 'erwin_eren', '20:15 26/07/2021', 'erwin', ''),
(96, 'hhhh', 4, 'erwin_eren', '20:15 26/07/2021', 'eren', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cn_friend`
--

CREATE TABLE `cn_friend` (
  `id` int(11) NOT NULL,
  `id_friend` int(11) NOT NULL,
  `id_group_chat` varchar(200) NOT NULL,
  `id_user` int(11) NOT NULL,
  `who` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cn_friend`
--

INSERT INTO `cn_friend` (`id`, `id_friend`, `id_group_chat`, `id_user`, `who`) VALUES
(3, 4, 'erwin_eren', 2, 'erwin'),
(4, 4, 'erwin_eren', 2, 'eren'),
(5, 3, 'erwin_zake', 2, 'erwin'),
(6, 3, 'erwin_zake', 2, 'zake'),
(9, 2, 'eren_erwin', 4, 'eren'),
(11, 4, 'zake_eren', 3, 'zake'),
(12, 4, 'zake_eren', 3, 'eren');

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
  `last_online` varchar(50) NOT NULL,
  `information` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `cn_user`
--

INSERT INTO `cn_user` (`id_user`, `name`, `username`, `password`, `img_profile`, `last_online`, `information`) VALUES
(2, 'Erwin Smith', 'erwin', '123456', '/img/ak47/16273052863325010ebfa3d98235ef8afdbb02525d11a.png', '', ''),
(3, 'Zake Yeager', 'zake', '123456', '/img/ak47/162730407523248ee40b774037e8e3f7342fddc07c07f.jpg', '', ''),
(4, 'Eren Yeager', 'eren', '12345678', '/img/ak47/162721814472024b7778d9deb54556550ac2902c28a7f.jpg', '', 'i&#039;m not titan again');

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
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT untuk tabel `cn_friend`
--
ALTER TABLE `cn_friend`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `cn_user`
--
ALTER TABLE `cn_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
