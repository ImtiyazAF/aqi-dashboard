# Calculated Fields Documentation: ISPU Jakarta Dashboard

This document details the custom formulas (Calculated Fields) created in Looker Studio to transform raw data into visual insights.

---

## 📂 Dataset: ISPU_Long
*Used for historical analysis and trend visualization (Data has been unpivoted).*

### 1. Date Fixer
**Field Name:** `tanggal_fix`
**Field ID:** `calc_u9lg4qouyd`
**Description:** Converts the date column from Text format (CSV default) to a valid Date object to allow time-series plotting.
**Formula:**
```sql
PARSE_DATE("%Y-%m-%d", tanggal)

### 2. Month Number Extraction
**Field Name:** `MonthNum`
**Field ID:** `calc_4kl06tpvyd`
**Description:** CExtracts the month integer (1-12) from the date. This is used to sort the chart axis chronologically (Jan, Feb, Mar) instead of alphabetically (Apr, Aug, Dec).
**Formula:**
```sql
EXTRACT(MONTH FROM tanggal_fix)

### 3. Month Label (Abbreviation)
**Field Name:** `Bulan`
**Field ID:** `calc_yky3qupvyd`
**Description:** Converts month numbers into 3-letter Indonesian abbreviations for cleaner chart visualization.
**Formula:**
```sql
CASE 
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 1 THEN "Jan"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 2 THEN "Feb"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 3 THEN "Mar"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 4 THEN "Apr"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 5 THEN "Mei"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 6 THEN "Jun"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 7 THEN "Jul"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 8 THEN "Agu"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 9 THEN "Sep"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 10 THEN "Okt"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 11 THEN "Nov"
  WHEN EXTRACT(MONTH FROM tanggal_fix) = 12 THEN "Des"
END

### 4. Max Value Flag
**Field Name:** `is_max`
**Field ID:** `calc_b4tgu9pvyd`
**Description:** A binary flag (1 or 0) used to identify if a specific row contains the maximum pollution value for that day. Useful for highlighting critical pollutants.
**Formula:**
```sql
CASE 
  WHEN nilai = max_value THEN 1 
  ELSE 0 
END

### 4. Dynamic Pollutant Switcher
**Field Name:** `Polutan_Value`
**Field ID:** `calc_1c756p2wyd`
**Description:** Dynamically selects the column value based on the "Polutan" parameter context. This allows a single chart to switch metrics (e.g., showing PM10 vs SO2) without creating multiple charts.
**Formula:**
```sql
CASE 
  WHEN Polutan = "PM10" THEN t_pm10
  WHEN Polutan = "PM25" THEN t_pm25
  WHEN Polutan = "SO2" THEN t_so2
  WHEN Polutan = "CO" THEN t_co
  WHEN Polutan = "O3" THEN t_o3
  WHEN Polutan = "NO2" THEN t_no2
  ELSE NULL
END

### 5. Time Formatting
**Field Name:** `Waktu_Format`
**Field ID:** `calc_8inest2wyd`
**Description:** Formats the timestamp to show only Hour and Minute ("HH:MM") for granular hourly trend analysis.
**Formula:**
```sql
FORMAT_DATETIME("%H:%M", waktu)