EJDER STUDIO — ÇALIŞAN TASARIM ÖN İZLEMESİ (v1, 02.11.2026)
================================================================

TÜRKÇE
-------
Bu ZIP bir TEST / DEMO web sitesidir. Mevcut EJDER Studio logo görseli,
bordo-siyah-altın tasarım, sekiz kişiselleştirme kategorisi,
Türkçe/Almanca menüler ve çalışan tarayıcı içi tasarım editörü içerir.

Kurulum / ön izleme:
1) ZIP dosyasını normal şekilde çıkarın.
2) Klasördeki index.html dosyasını modern bir tarayıcıda açın.
3) Telefon veya paylaşımlı test için dosyaları geçici bir statik web
   sunucusuna yükleyebilirsiniz. CANLI mağazaya otomatik yükleme yapılmadı.
4) Menüden Tasarım Stüdyosu'na girin; ürün seçin, fotoğraf veya yazı
   ekleyin, renk/şablon seçin, ön izleyin ve PNG indirin.

3D (tüm sayfalarda) — yalnızca GERÇEK içerik, temsili/taklit model YOK:
- 3D vitrin: Her sayfada sitenin gerçek ürün fotoğraflarından oluşan, fareyle /
  parmakla / oklarla döndürülebilen 3D vitrin (showcase3d.js). Fotoğraflar
  birebir gösterilir: gerdirme, kırpma veya filtre yoktur. Kartların arka
  yüzünde gerçek EJDER logosu vardır. Ürüne tıklayınca stüdyo açılır.
- 3D hediye deneyimi: Gerçek hediye kutusu fotoğrafı 3D sahnede; açılınca
  gerçek ürün fotoğrafları kutudan 3D yelpaze gibi çıkar.
- Tasarım Stüdyosu: Ön izleme 3D çevrilebilir bir karttır; ön yüzde senin
  tasarımın, arka yüzde seçilen ürünün gerçek fotoğrafı.
- 3D arka plan: Tüm sayfaların arkasında derinlikli (perspektifli) altın
  kor parçacıkları (ambient3d.js). Sitenin görsellerinin üzerine çizilmez.
- Harici kütüphane veya internet bağlantısı gerekmez; index.html doğrudan
  açıldığında da çalışır. "Hareketi azalt" ayarı açık cihazlarda animasyonlar
  durdurulur.

FOTOĞRAF GİZLİLİĞİ (önemli):
- Yalnızca JPG, PNG ve WebP; dosya başına 10 MB sınırı.
- En fazla üç geçici fotoğraf.
- Fotoğraf tarayıcının içinde en uzun kenar 900 piksel olacak şekilde
  küçültülür; WebP/JPEG ile sıkıştırılır (hedef ~350 KB veya daha az).
- Yeniden çizilen görüntünün EXIF / konum meta verileri dosyaya aktarılmaz.
- Fotoğraf hiçbir sunucuya yüklenmez; fotoğraf aktarımı için ağ isteği yoktur.
- Geçici küçültülmüş kopya düzenleme boyunca yalnızca tarayıcı belleğindedir.
- PNG indirildiğinde, tasarım kaydedildiğinde, 'İşlemi bitir' basıldığında
  veya editörden çıkıldığında geçici görseller ve URL referansları temizlenir.
- Tarayıcı güvenlik sınırları nedeniyle cihaz belleğinde fiziksel / adli
  yöntemlerle geri getirilemeyecek şekilde silinme GARANTİ EDİLEMEZ.
- PNG'yi indirmek kullanıcının kendi cihazına bilerek dosya kaydetmesidir;
  uygulama indirilen dosyayı silemez.
- Tasarımı tarayıcıya kaydetme YALNIZCA metin, renk ve konum bilgilerini
  saklar. Fotoğraflar kaydedilmez; bu nedenle kayıttan tekrar açılamaz.

SINIRLAR:
- Editördeki ürün çizimleri sitenin mevcut 2D tasarım maketleridir; üretime
  hazır teknik baskı dosyası yoktur.
- Tasarımın ürünün üzerine gerçek 3D olarak sarılması için ürünlerin GERÇEK
  3D model dosyaları (ör. tedarikçiden veya 3D tasarımcıdan .glb) gerekir.
  Bu dosyalar olmadığı için temsili 3D ürün modeli kullanılmamıştır.
- Hediye kutusu açılışı, gerçek ürün fotoğraflarıyla yapılan CSS 3D
  animasyonudur.
- Ödeme, gerçek sipariş, hesap girişleri, baskı tedarikçisi ve veri tabanı yoktur.
- Bu demo doğrudan ticari yayına alınmamalıdır. Almanya'da yasal sayfalar
  (Impressum/Datenschutz vb.) ve marka/domain kontrolü ayrıca tamamlanmalıdır.
- Bu sürümde fotoğraflar için kalıcı sunucu veya veri tabanı kurulmamıştır.

Dosyalar:
 index.html  — giriş
 styles.css  — tasarım / mobil uyumluluk
 app.js      — ürünler, sayfalar, editör ve fotoğraf işlemesi
 showcase3d.js — gerçek ürün fotoğraflarıyla 3D vitrin
 ambient3d.js  — tüm sayfalardaki 3D altın kor arka planı
 assets/     — ürün görselleri ve onaylı efektli logo

DEUTSCH
-------
Dies ist eine TEST-/DEMO-Webseite, kein betriebsbereiter Shop.
Sie umfasst acht anpassbare Produktkategorien, ein zweisprachiges Menü,
Vorschauen und einen browserbasierten Design-Editor.

Start: ZIP entpacken, index.html im modernen Browser öffnen.

3D (auf allen Seiten) — nur ECHTE Inhalte, KEINE Platzhalter-Modelle:
- 3D-Vitrine aus den echten Produktfotos auf jeder Seite (drehbar per Maus,
  Finger oder Pfeiltasten). Fotos werden unverändert gezeigt (kein Strecken,
  Zuschneiden oder Filtern); Rückseite: echtes EJDER-Logo.
- 3D-Geschenkerlebnis: echtes Geschenkbox-Foto; beim Öffnen fächern sich
  echte Produktfotos in 3D auf.
- Designstudio: drehbare 3D-Vorschaukarte – vorne dein Design, hinten das
  echte Produktfoto.
- 3D-Hintergrund mit goldenen Funken in räumlicher Tiefe.
- Keine externen Bibliotheken, funktioniert offline und direkt aus der Datei.
Für Tests auf einem Telefon können die statischen Dateien auf eine
separate Testumgebung hochgeladen werden. Keine Live-Veröffentlichung erfolgt.

FOTOS & DATENSCHUTZ:
- JPG / PNG / WebP, max. 10 MB pro Datei, maximal drei temporäre Fotos.
- Verkleinerung im Browser auf max. 900 Pixel an der längsten Kante.
- Komprimierung als WebP/JPEG, Zielgröße ca. 350 KB oder weniger.
- Kamera-/Standort-EXIF-Informationen werden nicht in das neue Bild kopiert.
- Kein Server-Upload von Benutzerfotos.
- Die verkleinerte Vorschau bleibt nur während der Bearbeitung im Speicher.
- Beim Herunterladen, lokalen Speichern, Beenden oder Verlassen des Editors
  werden temporäre Fotodaten und Objekt-URLs freigegeben.
- Eine forensisch sichere Löschung aus dem physischen Speicher ist technisch
  nicht gewährleistet. Heruntergeladene Dateien bleiben beim Benutzer.
- Gespeicherte Entwürfe enthalten ausschließlich Text, Farbe und Position;
  ursprünglich hochgeladene Fotos sind NICHT dauerhaft gespeichert.

HINWEIS: Keine echten Zahlungen, Bestellungen oder produktionsreifen Druckdaten.
Für ein echtes 3D-Aufziehen des Designs auf das Produkt werden die ECHTEN
3D-Modelldateien der Produkte (z. B. .glb) benötigt; Platzhalter-Modelle
werden bewusst nicht verwendet. Impressum, Datenschutz und Markenrecht
müssen vor einem echten Start geprüft und vervollständigt werden.
