function updateISPU_Jakarta() {

    // ============================
    // 1. Daftar stasiun fallback
    // ============================
    var STATIONS_PRIORITY = [
        "KBN_MARUNDA",
        "JAKARTA_TIMUR_BONAS",
        "DKI1",
        "DKI5",
        "DKI3",
        "DKI2",
        "JAKARTA"
    ];

    var url = "https://ispu.kemenlh.go.id/apimobile/v1/getStations";
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var json = JSON.parse(response.getContentText());

    if (!json.rows || !Array.isArray(json.rows)) {
        throw new Error("Field 'rows' tidak ditemukan.");
    }

    // ============================
    // 2. Cari stasiun aktif sesuai prioritas
    // ============================
    var chosen = null;
    for (var id of STATIONS_PRIORITY) {
        chosen = json.rows.find(r => r.id_stasiun === id);
        if (chosen) break;
    }
    if (!chosen) throw new Error("Tidak ada stasiun Jakarta yang aktif!");

    var r = chosen;

    // ============================
    // 3. Convert nilai polutan → Number
    // ============================
    function toNum(v) {
        return (v === "" || v == null) ? 0 : Number(v);
    }

    var polutans = {
        PM10: toNum(r.t_pm10),
        PM25: toNum(r.t_pm25),
        SO2: toNum(r.t_so2),
        CO: toNum(r.t_co),
        O3: toNum(r.t_o3),
        NO2: toNum(r.t_no2)
    };

    // ============================
    // 4. Hitung nilai ISPU tertinggi
    // ============================
    var val_raw = Math.max(...Object.values(polutans));
    var dominantPollutant = Object.keys(polutans)
        .find(key => polutans[key] === val_raw);

    // ============================
    // 5. Kategori ISPU
    // ============================
    function kategoriISPU(v) {
        if (v <= 50) return "BAIK";
        if (v <= 100) return "SEDANG";
        if (v <= 200) return "TIDAK SEHAT";
        if (v <= 300) return "SANGAT TIDAK SEHAT";
        return "BERBAHAYA";
    }

    var kategori = kategoriISPU(val_raw);
    var kategori_color = {
        "BAIK": "#00cc00",
        "SEDANG": "#0000cc",
        "TIDAK SEHAT": "#cccc00",
        "SANGAT TIDAK SEHAT": "#ff6600",
        "BERBAHAYA": "#cc0000"
    }[kategori];

    // ============================
    // 6. Prepare Output Row
    // ============================
    var output = [
        r.waktu,
        polutans.PM10, polutans.PM25, polutans.SO2, polutans.CO, polutans.O3, polutans.NO2,
        val_raw,
        dominantPollutant,
        kategori,
        kategori_color,
        r.waktu_text,
        r.id_stasiun
    ];

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ============================
    // 7. UPDATE LIVE SHEET
    // ============================
    var liveSheet = ss.getSheetByName("ISPU_JAKARTA_LIVE") || ss.insertSheet("ISPU_JAKARTA_LIVE");
    liveSheet.clear();
    liveSheet.appendRow([
        "waktu", "t_pm10", "t_pm25", "t_so2", "t_co", "t_o3", "t_no2",
        "val_raw", "dominant_pollutant", "kategori", "kategori_color", "waktu_text", "used_station"
    ]);
    liveSheet.appendRow(output);

    // ============================
    // 8. UPDATE HISTORICAL SHEET
    // ============================
    var histSheet = ss.getSheetByName("ISPU_JAKARTA_HISTORIS") || ss.insertSheet("ISPU_JAKARTA_HISTORIS");

    // Buat header jika sheet masih kosong
    if (histSheet.getLastRow() === 0) {
        histSheet.appendRow([
            "waktu", "t_pm10", "t_pm25", "t_so2", "t_co", "t_o3", "t_no2",
            "val_raw", "dominant_pollutant", "kategori", "kategori_color", "waktu_text", "used_station"
        ]);
    }

    var lastRow = histSheet.getLastRow();

    // CEGAH DUPLIKASI: cek apakah waktu sudah ada
    if (lastRow > 1) {
        var lastTimes = histSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
        if (lastTimes.includes(r.waktu)) {
            Logger.log("Skipped: waktu " + r.waktu + " sudah ada.");
            return;
        }
    }

    // Append data terbaru
    histSheet.appendRow(output);

    // ============================
    // 9. BATASI HISTORIS KE 24 JAM TERAKHIR
    // ============================
    var maxRows = 24 + 1; // header + 24 data
    var totalRows = histSheet.getLastRow();

    if (totalRows > maxRows) {
        var delCount = totalRows - maxRows;
        histSheet.deleteRows(2, delCount);
    }
}
