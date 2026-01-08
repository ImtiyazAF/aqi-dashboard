# Data Dictionary: ISPU Jakarta Monitoring

Dataset ini mencakup data kualitas udara DKI Jakarta yang terbagi menjadi data historis (cleaning) dan data live.

## 1. Dataset: ISPU_Long (Transformed Data)
Dataset ini digunakan untuk visualisasi tren dinamis di mana user bisa memfilter jenis polutan.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `tanggal` | Date | Tanggal pencatatan data. |
| `year` | Number | Tahun pencatatan (untuk filter tahunan). |
| `polutan` | Text | Jenis parameter (PM10, PM25, SO2, CO, O3, NO2). |
| `nilai` | Number | Konsentrasi polutan pada tanggal tersebut. |
| `kategori_ispu` | Text | Kategori kesehatan (Baik, Sedang, Tidak Sehat, dll). |
| `max_value` | Number | Nilai ISPU tertinggi pada hari tersebut (Max Daily). |
| `max_polutan` | Text | Polutan yang menjadi "Critical Parameter" hari itu. |

## 2. Dataset: Raw Data (Wide Format)
Ini adalah format asli data sebelum transformasi. Digunakan untuk validasi nilai atau jika ingin melihat korelasi antar polutan dalam satu baris tanggal yang sama.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `tanggal` | Date | Tanggal pencatatan. |
| `stasiun` | Text | (Jika ada) Kode stasiun pencatat. |
| `pm10` | Number | Nilai konsentrasi PM10. |
| `pm25` | Number | Nilai konsentrasi PM2.5. |
| `so2` | Number | Nilai konsentrasi Sulfur Dioksida. |
| `co` | Number | Nilai konsentrasi Karbon Monoksida. |
| `o3` | Number | Nilai konsentrasi Ozon. |
| `no2` | Number | Nilai konsentrasi Nitrogen Dioksida. |
| `max` | Number | Nilai tertinggi (Max) di antara semua parameter hari itu. |
| `critical` | Text | Parameter yang memiliki nilai tertinggi (penentu ISPU). |
| `categori` | Text | Kategori kesehatan harian. |

## 3. Dataset: ISPU_JAKARTA_HISTORIS & LIVE
Dataset agregat yang digunakan untuk menampilkan kartu ringkasan (Scorecard) dan status terkini.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `waktu` | Date & Time | Timestamp pengambilan data. |
| `waktu_text` | Text | Format teks dari waktu (untuk label). |
| `used_station` | Text | Nama stasiun SPKU yang aktif mengirim data. |
| `dominant_pollutant`| Text | Polutan dengan nilai tertinggi saat ini. |
| `kategori` | Text | Label kategori ISPU (e.g., "SEDANG", "BAIK"). |
| `kategori_color` | Text | Kode warna atau label warna untuk conditional formatting. |
| `t_pm10` | Number | Total/Rata-rata konsentrasi PM10. |
| `t_pm25` | Number | Total/Rata-rata konsentrasi PM2.5. |
| `t_so2` | Number | Total/Rata-rata konsentrasi SO2. |
| `t_co` | Number | Total/Rata-rata konsentrasi CO. |
| `t_o3` | Number | Total/Rata-rata konsentrasi O3. |
| `t_no2` | Number | Total/Rata-rata konsentrasi NO2. |
| `val_raw` | Number | Nilai mentah polutan dominan (Raw Value). |