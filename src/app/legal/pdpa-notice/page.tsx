"use client";

import { LegalPage } from "@/components/legal-page";

/**
 * PDPA Notice — drafted to match the seven items required by section 7(1) of
 * the Personal Data Protection Act 2010 (as amended by the PDPA (Amendment)
 * Act 2024). This is the "notice and choice" statement that users should be
 * given at or before the point personal data is collected.
 *
 * It intentionally overlaps with the Privacy Policy but is structured as a
 * formal notice (numbered items tracking s.7) rather than plain-English prose.
 */
export default function PDPANoticePage() {
  return (
    <LegalPage
      lastUpdatedISO="2026-04-24"
      content={{
        en: {
          title: "PDPA Notice",
          subtitle:
            "Notice under section 7 of the Personal Data Protection Act 2010 (as amended 2024).",
          body: (
            <>
              <h2>Purpose of this notice</h2>
              <p>
                This notice explains how SAHABAT.AI processes your personal
                data in accordance with the{" "}
                <strong>
                  Personal Data Protection Act 2010 (&ldquo;PDPA&rdquo;)
                </strong>{" "}
                as amended by the Personal Data Protection (Amendment) Act
                2024. Please read it before you register. By ticking the
                consent box at signup, you confirm you have read and accepted
                this notice, our <a href="/legal/privacy">Privacy Policy</a>,
                and our <a href="/legal/terms">Terms of Service</a>.
              </p>

              <h2>1. Personal data being processed</h2>
              <ul>
                <li>
                  <strong>Identifying data</strong>: email address, password
                  hash, anonymous display handle (optional), language
                  preference, account creation timestamp.
                </li>
                <li>
                  <strong>Sensitive personal data</strong> (as defined in s.4
                  PDPA): information about your mental or physical health,
                  derived from check-in mood scores, sleep hours, and the
                  substance of your chat messages with the AI.
                </li>
                <li>
                  <strong>Technical data</strong>: session cookies required for
                  login. We do not use advertising or analytics cookies.
                </li>
              </ul>

              <h2>2. Purposes of processing</h2>
              <ol>
                <li>
                  To authenticate you and maintain your account.
                </li>
                <li>
                  To generate AI companion replies tailored to your recent
                  check-ins and stated concerns.
                </li>
                <li>
                  To compute an aggregate wellbeing score and tier
                  (Green/Yellow/Orange/Red) so you can see your own trend.
                </li>
                <li>
                  To run a safety classifier on your messages and surface
                  Malaysian crisis helplines (Talian Kasih 15999, Befrienders
                  KL) when acute risk is detected.
                </li>
                <li>
                  To produce anonymised, aggregated statistics for service
                  improvement and public-good research — never containing
                  individually identifiable information.
                </li>
              </ol>

              <h2>3. Source of your personal data</h2>
              <p>
                All personal data is collected{" "}
                <strong>directly from you</strong> when you register, complete
                check-ins, or chat with Sahabat. We do not purchase, scrape,
                or acquire your data from any third party.
              </p>

              <h2>4. Rights of access and correction</h2>
              <p>Under Part II Division 3 of the PDPA you have the right to:</p>
              <ul>
                <li>
                  <strong>Request access</strong> to the personal data we hold
                  about you.
                </li>
                <li>
                  <strong>Request correction</strong> of data that is
                  inaccurate, incomplete, misleading, or out of date.
                </li>
                <li>
                  <strong>Withdraw your consent</strong> at any time.
                </li>
                <li>
                  <strong>Prevent processing</strong> likely to cause damage
                  or distress, and direct-marketing processing.
                </li>
                <li>
                  <strong>Lodge a complaint</strong> with the Jabatan
                  Perlindungan Data Peribadi (JPDP) at{" "}
                  <a
                    href="https://www.pdp.gov.my"
                    target="_blank"
                    rel="noopener"
                  >
                    pdp.gov.my
                  </a>
                  .
                </li>
              </ul>
              <p>
                Access and correction requests should be sent to{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                . We aim to respond within 21 days, as required by the PDPA.
              </p>

              <h2>5. Classes of third parties to whom data may be disclosed</h2>
              <p>
                Your personal data is disclosed only to the following classes
                of data processors acting on our written instruction:
              </p>
              <ul>
                <li>
                  <strong>AI inference provider</strong> — currently Groq,
                  Inc. (United States), to generate AI replies and run the
                  safety classifier.
                </li>
                <li>
                  <strong>Database and authentication provider</strong> —
                  currently Supabase, Inc. (European Union region), for
                  encrypted storage.
                </li>
                <li>
                  <strong>Hosting provider</strong> — currently Vercel, Inc.
                  (United States), for application delivery.
                </li>
                <li>
                  <strong>Law-enforcement or judicial authority</strong> —
                  only upon a valid Malaysian court order or where disclosure
                  is required by law.
                </li>
              </ul>
              <p>
                No other class of third party receives your data. In
                particular, we do not disclose to advertisers, insurers,
                employers, schools, universities, parents (unless you choose
                to share), or any government ministry.
              </p>

              <h2>6. Choices available and how to limit processing</h2>
              <p>
                Providing the data described in this notice is voluntary, but
                the service cannot function without it. Specifically:
              </p>
              <ul>
                <li>
                  Without an email, we cannot create an account.
                </li>
                <li>
                  Without chat content, we cannot generate companion replies.
                </li>
                <li>
                  Without check-ins, we cannot compute a wellbeing score.
                </li>
              </ul>
              <p>
                You may withdraw consent at any time by deleting your account
                at{" "}
                <a href="/app/settings">Settings &rarr; Delete account</a>,
                which triggers permanent removal within 30 days.
              </p>

              <h2>7. Transfers outside Malaysia</h2>
              <p>
                Because Groq and Vercel operate in the United States and
                Supabase stores data in the European Union, your personal
                data will be transferred outside Malaysia. We rely on section
                129 PDPA (as updated by the 2024 amendments) together with
                contractual processor agreements that require the recipients
                to apply a level of protection substantially similar to the
                PDPA. By ticking the consent box you expressly consent to
                this cross-border transfer.
              </p>

              <h2>8. Retention</h2>
              <p>
                Retention periods are set out in section 7 of our{" "}
                <a href="/legal/privacy">Privacy Policy</a>. In summary: chat
                messages 12 months; check-ins and wellbeing scores 24 months;
                anonymised crisis-event metadata 36 months; account profile
                for the life of the account.
              </p>

              <h2>9. Contact</h2>
              <p>
                Data Protection contact:{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                <br />
                SAHABAT.AI Project Team, Universiti Putra Malaysia, Serdang,
                Selangor.
              </p>

              <h2>Bilingual availability</h2>
              <p>
                As required by section 7(3) PDPA, this notice is available in
                both English and Bahasa Malaysia. In the event of any
                inconsistency, the English version prevails, save that
                consumer-protective interpretations under Malaysian law apply
                first.
              </p>
            </>
          ),
        },
        bm: {
          title: "Notis PDPA",
          subtitle:
            "Notis di bawah seksyen 7 Akta Perlindungan Data Peribadi 2010 (pindaan 2024).",
          body: (
            <>
              <h2>Tujuan notis ini</h2>
              <p>
                Notis ini menerangkan bagaimana SAHABAT.AI memproses data
                peribadi anda selaras dengan{" "}
                <strong>
                  Akta Perlindungan Data Peribadi 2010 (&ldquo;PDPA&rdquo;)
                </strong>{" "}
                seperti dipinda oleh Akta Perlindungan Data Peribadi (Pindaan)
                2024. Sila baca sebelum anda mendaftar. Dengan menandakan
                kotak persetujuan semasa pendaftaran, anda mengesahkan bahawa
                anda telah membaca dan menerima notis ini,{" "}
                <a href="/legal/privacy">Polisi Privasi</a>, dan{" "}
                <a href="/legal/terms">Terma Perkhidmatan</a> kami.
              </p>

              <h2>1. Data peribadi yang diproses</h2>
              <ul>
                <li>
                  <strong>Data pengenalan</strong>: alamat e-mel, hash kata
                  laluan, nama paparan samaran (pilihan), keutamaan bahasa,
                  cap masa penciptaan akaun.
                </li>
                <li>
                  <strong>Data peribadi sensitif</strong> (seperti ditakrifkan
                  dalam s.4 PDPA): maklumat tentang kesihatan mental atau
                  fizikal anda, diterbitkan daripada skor mood semakan, jam
                  tidur, dan kandungan mesej sembang anda dengan AI.
                </li>
                <li>
                  <strong>Data teknikal</strong>: kuki sesi yang diperlukan
                  untuk log masuk. Kami tidak menggunakan kuki pengiklanan
                  atau analitik.
                </li>
              </ul>

              <h2>2. Tujuan pemprosesan</h2>
              <ol>
                <li>
                  Untuk mengesahkan anda dan mengekalkan akaun anda.
                </li>
                <li>
                  Untuk menjana jawapan rakan AI yang disesuaikan kepada
                  semakan terkini dan kebimbangan anda.
                </li>
                <li>
                  Untuk mengira skor kesejahteraan teragregat dan tahap
                  (Hijau/Kuning/Jingga/Merah) supaya anda dapat melihat
                  trend anda.
                </li>
                <li>
                  Untuk menjalankan pengelas keselamatan pada mesej anda dan
                  memaparkan talian kecemasan Malaysia (Talian Kasih 15999,
                  Befrienders KL) apabila risiko akut dikesan.
                </li>
                <li>
                  Untuk menghasilkan statistik teragregat tanpa nama bagi
                  penambahbaikan perkhidmatan dan penyelidikan kepentingan
                  awam — tidak pernah mengandungi maklumat yang boleh
                  dikenal pasti secara individu.
                </li>
              </ol>

              <h2>3. Sumber data peribadi anda</h2>
              <p>
                Semua data peribadi dikumpul{" "}
                <strong>secara langsung daripada anda</strong> apabila anda
                mendaftar, melengkapkan semakan, atau bersembang dengan
                Sahabat. Kami tidak membeli, mengikis, atau memperoleh data
                anda daripada mana-mana pihak ketiga.
              </p>

              <h2>4. Hak akses dan pembetulan</h2>
              <p>
                Di bawah Bahagian II Bahagian 3 PDPA, anda berhak untuk:
              </p>
              <ul>
                <li>
                  <strong>Meminta akses</strong> kepada data peribadi yang
                  kami simpan tentang anda.
                </li>
                <li>
                  <strong>Meminta pembetulan</strong> data yang tidak tepat,
                  tidak lengkap, mengelirukan, atau lapuk.
                </li>
                <li>
                  <strong>Menarik balik kebenaran</strong> pada bila-bila
                  masa.
                </li>
                <li>
                  <strong>Mencegah pemprosesan</strong> yang berkemungkinan
                  menyebabkan kerosakan atau tekanan, serta pemprosesan
                  pemasaran langsung.
                </li>
                <li>
                  <strong>Failkan aduan</strong> dengan Jabatan Perlindungan
                  Data Peribadi (JPDP) di{" "}
                  <a
                    href="https://www.pdp.gov.my"
                    target="_blank"
                    rel="noopener"
                  >
                    pdp.gov.my
                  </a>
                  .
                </li>
              </ul>
              <p>
                Permintaan akses dan pembetulan hendaklah dihantar ke{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                . Kami bertujuan membalas dalam tempoh 21 hari seperti yang
                dikehendaki oleh PDPA.
              </p>

              <h2>
                5. Kelas pihak ketiga yang data mungkin didedahkan kepada
              </h2>
              <p>
                Data peribadi anda didedahkan hanya kepada kelas pemproses
                data berikut yang bertindak atas arahan bertulis kami:
              </p>
              <ul>
                <li>
                  <strong>Penyedia pemprosesan AI</strong> — kini Groq, Inc.
                  (Amerika Syarikat), untuk menjana jawapan AI dan
                  menjalankan pengelas keselamatan.
                </li>
                <li>
                  <strong>Penyedia pangkalan data dan pengesahan</strong> —
                  kini Supabase, Inc. (rantau Kesatuan Eropah), untuk
                  penyimpanan tersulit.
                </li>
                <li>
                  <strong>Penyedia pengehosan</strong> — kini Vercel, Inc.
                  (Amerika Syarikat), untuk penyampaian aplikasi.
                </li>
                <li>
                  <strong>Penguatkuasa undang-undang atau pihak kehakiman</strong>{" "}
                  — hanya atas perintah mahkamah Malaysia yang sah atau jika
                  pendedahan dikehendaki oleh undang-undang.
                </li>
              </ul>
              <p>
                Tiada kelas pihak ketiga lain menerima data anda. Secara
                khusus, kami tidak mendedahkan kepada pengiklan, syarikat
                insurans, majikan, sekolah, universiti, ibu bapa (melainkan
                anda memilih untuk berkongsi), atau mana-mana kementerian
                kerajaan.
              </p>

              <h2>6. Pilihan yang tersedia dan cara menghadkan pemprosesan</h2>
              <p>
                Memberi data yang dinyatakan dalam notis ini adalah sukarela,
                tetapi perkhidmatan tidak dapat berfungsi tanpa data
                tersebut. Secara khusus:
              </p>
              <ul>
                <li>
                  Tanpa e-mel, kami tidak dapat membuat akaun.
                </li>
                <li>
                  Tanpa kandungan sembang, kami tidak dapat menjana jawapan
                  rakan.
                </li>
                <li>
                  Tanpa semakan, kami tidak dapat mengira skor kesejahteraan.
                </li>
              </ul>
              <p>
                Anda boleh menarik balik kebenaran pada bila-bila masa
                dengan memadamkan akaun anda di{" "}
                <a href="/app/settings">Tetapan &rarr; Padam akaun</a>, yang
                mencetuskan penyingkiran kekal dalam tempoh 30 hari.
              </p>

              <h2>7. Pemindahan ke luar Malaysia</h2>
              <p>
                Oleh kerana Groq dan Vercel beroperasi di Amerika Syarikat
                dan Supabase menyimpan data di Kesatuan Eropah, data
                peribadi anda akan dipindahkan ke luar Malaysia. Kami
                bergantung pada seksyen 129 PDPA (seperti dikemas kini oleh
                pindaan 2024) bersama perjanjian pemproses kontrak yang
                memerlukan penerima menggunakan tahap perlindungan yang
                substansialnya serupa dengan PDPA. Dengan menandakan kotak
                persetujuan, anda menyetujui secara nyata pemindahan merentas
                sempadan ini.
              </p>

              <h2>8. Pengekalan</h2>
              <p>
                Tempoh pengekalan dinyatakan dalam seksyen 7{" "}
                <a href="/legal/privacy">Polisi Privasi</a> kami. Ringkasan:
                mesej sembang 12 bulan; semakan dan skor kesejahteraan 24
                bulan; metadata peristiwa krisis tanpa nama 36 bulan; profil
                akaun sepanjang hayat akaun.
              </p>

              <h2>9. Hubungi</h2>
              <p>
                Hubungan Perlindungan Data:{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                <br />
                Pasukan Projek SAHABAT.AI, Universiti Putra Malaysia, Serdang,
                Selangor.
              </p>

              <h2>Ketersediaan dwibahasa</h2>
              <p>
                Seperti yang dikehendaki oleh seksyen 7(3) PDPA, notis ini
                tersedia dalam Bahasa Inggeris dan Bahasa Malaysia. Jika
                terdapat ketidakselarasan, versi Bahasa Inggeris akan
                digunakan, melainkan tafsiran perlindungan pengguna di bawah
                undang-undang Malaysia digunakan terlebih dahulu.
              </p>
            </>
          ),
        },
      }}
    />
  );
}
