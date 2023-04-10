# Tucil3_13521122_13521166
<h2 align="center">
Algoritma UCS dan A* untuk Menentukan Lintasan 
Terpendek<br/>
</h2>
<hr>

## Table of Contents
1. [General Info](#general-information)
2. [Creator Info](#creator-information)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [Setup](#setup)
6. [Usage](#usage)
7. [Video Captures](#video-captures)
8. [Screenshots](#screenshots)
9. [Structure](#structure)
10. [Project Status](#project-status)
11. [Room for Improvement](#room-for-improvement)
12. [Acknowledgements](#acknowledgements)
13. [Contact](#contact)

<a name="general-information"></a>

## General Information\
Program ini dibuat untuk memenuhi tugas kecil 3 IF2211 Strategi Algoritma. Program ini akan menentukan lintasan terpendek dari suatu titik ke titik lainnya dengan menggunakan algoritma UCS dan A*. Kode program ditulis dalam bentuk Web Based Application dengan bahasa pemrograman HTML (pembuatan kerangka program), CSS (mempercantik tampilan program), dan JavaScript (menulis algoritma-algoritma yang digunakan serta fungsi-fungsi antara lainnya). Program akan terlebih dahulu menerima masukan berupa file config ber-ekstensi *.json; pengguna kemudian memilih algoritma yang akan digunakan, titik awal dan titik akhir, serta view yang akan ditampilkan pada peta. Setelah itu, program akan menampilkan peta yang telah ditentukan oleh pengguna beserta lintasan terpendek yang telah ditemukan oleh program. Jarak lintasan terpendek akan ditampilkan pada bagian bawah peta serta rute yang dilalui akan berwarna merah.

<a name="creator-information"></a>

## Creator Information

| Nama                        | NIM      | E-Mail                      |
| --------------------------- | -------- | --------------------------- |
| Ulung Adi Putra             | 13521122 | 13521122@std.stei.itb.ac.id |
| Mohammad Rifqi Farhansyah   | 13521166 | 13521166@std.stei.itb.ac.id |

<a name="features"></a>

## Features
- Program dapat menerima input file config ber-ekstensi `json`
- Menampilkan `peta` untuk visualisasi rute
- Membuat `node` untuk tiap instansiasi titik-titik pada peta
- Menampilkan `edge` untuk tiap instansiasi jalan pada peta
- Pengguna dapat memilih `algoritma` yang akan digunakan serta `view` yang akan ditampilkan pada peta
- Pengguna juga dapat memilih `titik awal` dan `titik akhir` yang akan digunakan
- `Jarak lintasan terpendek` akan ditampilkan pada bagian bawah peta
- Pewarnaan `rute` berbeda tergantung jalur yang dilalui oleh algoritma UCS dan A*

<a name="technologies-used"></a>

## Technologies Used
- leaflet.js - version 1.7.1
- HTML - version 5
- CSS - version 3
- JavaScript - version ES6

> Note: The version of the libraries above is the version that we used in this project. You can use the latest version of the libraries.

<a name="setup"></a>

## Setup
1. Install ekstensi Live Server pada Visual Studio Code
2. Clone repository ini ke lokal dengan command berikut
```bash
git clone https://github.com/Ulung32/Tucil3_13521122_13521166.git
```

<a name="usage"></a>

## Usage
1. Masuk ke direktori lokal dimana hasil clone dari repository ini disimpan
2. Jalankan file `index.html` dengan Live Server
3. Jika muncul dialog untuk memilih browser, pilih browser yang akan digunakan
4. Jika tidak muncul dialog, klik kanan pada file `index.html` dan pilih `Open with Live Server`
5. Alternatif lain, tekan tombol `Go Live` pada bagian bawah Visual Studio Code
6. Setelah itu, program akan terbuka di browser yang telah dipilih
7. Pilih `file config, algoritma, serta view` yang akan digunakan
8. Masukkan `titik awal dan titik akhir` yang akan dicari rute terpendeknya
9. Program akan menampilkan peta yang telah ditentukan oleh pengguna beserta lintasan terpendek yang telah ditemukan oleh program
10. `Jarak lintasan terpendek` akan ditampilkan pada bagian bawah peta serta `rute` yang dilalui akan berwarna merah

<a name="video-captures"></a>

## Video Captures

![TUCIL3 GIF](https://github.com/Ulung32/Tucil3_13521122_13521166/blob/main/image/TUCIL3.gif?raw=true)

<a name="screenshots"></a>

## Screenshots
ON GOING

<a name="structure"></a>

## Structure
```bash
│   README.md
│
├───bin
│       CR7isTheBest.txt
│
├───doc
│       Tucil3-Stima-2023.pdf
│
├───image
│       TUCIL3.gif
│
├───src
│       index.html
│       index.js
│       leaflet.textpath.js
│       map.png
│       style.css
│
└───test
        ITB.json
        Magelang.json
        Purworejo.json
```

<a name="project-status">

## Project Status
Project is: _uncomplete_

<a name="room-for-improvement">

## Room for Improvement
Room for Improvement:
- Meningkatkan performa program
- Menambahkan fitur-fitur lainnya

<a name="acknowledgements">

## Acknowledgements
- Terima kasih untuk seluruh pihak yang telah membantu kami dalam mengerjakan tugas ini

<a name="contact"></a>

## Contact
<h4 align="center">
  Contact Us : Ulung & Rifqi<br/>
  2023
</h4>
<hr>
