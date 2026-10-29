# Spec Delta

## ADDED Requirements

### Requirement: Ukuran kiriman survey dibatasi
Server SHALL menolak kiriman survey yang body-nya melebihi 8 KB dengan status 413 dan kode error `validation`, tanpa menyimpan apa pun. Kiriman yang mengisi nama dan saran sampai batas karakter form SHALL tetap berada di bawah batas ini.

#### Scenario: Body terlalu besar
- **WHEN** klien mengirim `POST /api/survey-kepuasan` dengan body 100 KB
- **THEN** server membalas 413 dengan `{"ok":false,"error":"validation"}` dan tidak ada baris baru di tabel survey

#### Scenario: Isian maksimal yang sah
- **WHEN** pengunjung mengirim survey dengan nama dan saran sepanjang batas karakter form
- **THEN** survey tersimpan dan layar sukses tampil

#### Scenario: Pesan di form
- **WHEN** server membalas 413
- **THEN** form menampilkan "Data survey tidak valid. Periksa kembali isian Anda lalu kirim ulang."

### Requirement: Kiriman survey tidak valid ditolak tanpa detail internal
Server SHALL membalas 400 dengan `{"ok":false,"error":"validation"}` untuk body yang bukan JSON atau tidak sesuai skema survey. Respons SHALL NOT memuat pesan validasi, stack trace atau detail database.

#### Scenario: Body bukan JSON
- **WHEN** klien mengirim `POST /api/survey-kepuasan` dengan body `bukan json`
- **THEN** server membalas 400 dengan `{"ok":false,"error":"validation"}`

#### Scenario: NPS di luar rentang
- **WHEN** klien mengirim survey dengan `nps` bernilai 11
- **THEN** server membalas 400 dengan `{"ok":false,"error":"validation"}` dan tidak ada baris baru di tabel survey

### Requirement: Rate limit kiriman survey per klien
Server SHALL menolak kiriman keenam dan seterusnya dari klien yang sama dalam satu jam dengan status 429 dan kode error `rate_limited`. Klien diidentifikasi dari hash ber-pepper atas IP-nya; IP mentah SHALL NOT disimpan atau dicatat di log.

#### Scenario: Kiriman keenam dalam satu jam
- **WHEN** klien yang sama sudah mengirim lima survey dalam satu jam terakhir lalu mengirim lagi
- **THEN** server membalas 429 dengan `{"ok":false,"error":"rate_limited"}` dan form menampilkan "Anda sudah mengirim terlalu sering. Coba lagi dalam sekitar satu jam."

#### Scenario: Klien berbeda
- **WHEN** klien A sudah mencapai batas dan klien B dengan IP berbeda mengirim survey pertamanya
- **THEN** kiriman klien B diterima

### Requirement: IP klien dibaca dari proxy tepercaya
Bila `TRUST_PROXY` aktif dengan N hop, server SHALL memakai entri ke-N dari kanan pada `X-Forwarded-For` sebagai IP klien. Nilai `1` dan `true` berarti satu hop. Entri yang ditambahkan klien di sisi kiri SHALL NOT memengaruhi IP yang dipakai. Bila `TRUST_PROXY` tidak aktif atau header tidak cukup panjang, server SHALL memakai alamat koneksi langsung.

#### Scenario: Klien memalsukan X-Forwarded-For
- **WHEN** `TRUST_PROXY=1`, klien mengirim `X-Forwarded-For: 1.2.3.4`, lalu proxy menambahkan IP aslinya sehingga header menjadi `1.2.3.4, 203.0.113.7`
- **THEN** rate limit dihitung untuk `203.0.113.7`, sehingga mengganti nilai palsu di setiap kiriman tidak melewati batas

#### Scenario: Proxy menimpa header
- **WHEN** `TRUST_PROXY=1` dan proxy mengirim `X-Forwarded-For: 203.0.113.7`
- **THEN** rate limit dihitung untuk `203.0.113.7`

#### Scenario: Dua hop proxy
- **WHEN** `TRUST_PROXY=2` dan header berisi `1.2.3.4, 203.0.113.7, 10.0.0.5`
- **THEN** rate limit dihitung untuk `203.0.113.7`

#### Scenario: TRUST_PROXY tidak aktif
- **WHEN** `TRUST_PROXY` kosong dan klien mengirim `X-Forwarded-For: 1.2.3.4`
- **THEN** header diabaikan dan rate limit dihitung dari alamat koneksi langsung

#### Scenario: Header lebih pendek dari jumlah hop
- **WHEN** `TRUST_PROXY=2` dan header hanya berisi satu entri
- **THEN** server memakai alamat koneksi langsung
