"use client";

import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      lastUpdatedISO="2026-04-24"
      content={{
        en: {
          title: "Privacy Policy",
          subtitle:
            "How SAHABAT.AI collects, uses, and protects your personal data — written in plain English.",
          body: (
            <>
              <h2>The short version</h2>
              <p>
                SAHABAT.AI is built for your wellbeing. We only collect what we
                need to listen, learn, and connect you to real Malaysian help.
                You own your data. You can delete your account anytime. We
                never sell your data. We never show ads.
              </p>

              <h2>Who we are</h2>
              <p>
                SAHABAT.AI is a student-led project at Universiti Putra Malaysia
                (UPM), submitted to ICYOUTH 2026. Data controller of record
                until a registered legal entity is formed:{" "}
                <strong>SAHABAT.AI Project Team, UPM Serdang</strong>. Contact:{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                .
              </p>

              <h2>What we collect</h2>
              <h3>You give us directly</h3>
              <ul>
                <li>
                  <strong>Account info</strong>: email, password hash,
                  optional anonymous handle, language preference.
                </li>
                <li>
                  <strong>Chat messages</strong> with Sahabat — what you write
                  and what Sahabat replies.
                </li>
                <li>
                  <strong>Check-ins</strong>: mood score (1–9), sleep hours,
                  optional note.
                </li>
                <li>
                  <strong>Buddy opt-in state</strong> — whether you opted in
                  to anonymous peer matching (stored locally in your browser
                  until a real backend is live).
                </li>
              </ul>
              <h3>We derive from your use</h3>
              <ul>
                <li>
                  <strong>Wellbeing score</strong> (0–100) + tier
                  (Green/Yellow/Orange/Red), computed from your recent
                  check-ins and chat signals.
                </li>
                <li>
                  <strong>Safety signals</strong> — a lightweight AI classifier
                  flags messages that mention self-harm or acute crisis, so we
                  can surface Talian Kasih and Befrienders KL in real time.
                </li>
              </ul>

              <h2>What we do NOT collect</h2>
              <ul>
                <li>Your IC (MyKad) or any government ID.</li>
                <li>Your phone number.</li>
                <li>Your precise location.</li>
                <li>Your contacts, photos, or microphone.</li>
                <li>Any tracking cookies or analytics pixels from third
                  parties (no Google Analytics, no Meta Pixel).</li>
              </ul>

              <h2>Why we collect what we collect (lawful basis)</h2>
              <p>
                Under the{" "}
                <strong>
                  Personal Data Protection Act 2010 (as amended 2024)
                </strong>
                , we rely on two grounds:
              </p>
              <ol>
                <li>
                  <strong>Your explicit consent</strong>, given when you sign
                  up and tick the PDPA consent box. Your mental-health-related
                  data is <em>sensitive personal data</em> and we will never
                  process it without that tick.
                </li>
                <li>
                  <strong>Legitimate interest</strong> in keeping you safe —
                  limited to running the safety classifier on your chat
                  messages and surfacing crisis helplines when the model
                  detects risk. See our{" "}
                  <a href="/legal/crisis-policy">Crisis Policy</a>.
                </li>
              </ol>

              <h2>Who sees your data</h2>
              <h3>Inside the team</h3>
              <p>
                A small team of student developers and (in future) licensed
                Malaysian counsellors. Access is restricted by Supabase
                row-level-security so engineers only see aggregated,
                anonymised signals — never the raw text of your chats — unless
                you explicitly request data access under PDPA.
              </p>
              <h3>Third-party processors</h3>
              <ul>
                <li>
                  <strong>Groq, Inc.</strong> (United States) — runs the
                  open-weight Llama language model that powers Sahabat&rsquo;s
                  replies and the safety classifier. Your chat text is sent to
                  Groq for inference. Groq states it does not store prompts
                  for training. Your chat still reaches servers outside
                  Malaysia — please factor this into your consent decision.
                </li>
                <li>
                  <strong>Supabase, Inc.</strong> (European Union region) —
                  our database + authentication provider. Stores your account
                  + check-ins + chat logs at rest, encrypted.
                </li>
                <li>
                  <strong>Vercel, Inc.</strong> (United States) — hosts the
                  website. Does not read your chat content; only delivers the
                  app to your browser.
                </li>
              </ul>
              <p>
                We do not share your data with any other party — no
                advertisers, no researchers, no government entity except under
                a valid Malaysian court order.
              </p>

              <h2>How long we keep it</h2>
              <ul>
                <li>
                  <strong>Account + profile</strong>: for as long as your
                  account exists.
                </li>
                <li>
                  <strong>Chat messages</strong>: 12 months rolling, then
                  automatically deleted.
                </li>
                <li>
                  <strong>Check-ins + wellbeing scores</strong>: 24 months
                  rolling, then automatically deleted.
                </li>
                <li>
                  <strong>Crisis event logs</strong>: 36 months, kept for
                  safety auditing. These are anonymised — no chat content is
                  retained, only timestamps and helpline-surfacing decisions.
                </li>
              </ul>

              <h2>Your rights under PDPA</h2>
              <p>You can, at any time:</p>
              <ul>
                <li>
                  <strong>Access</strong> a copy of your data — email{" "}
                  <a href="mailto:privacy@sahabat-ai.example">
                    privacy@sahabat-ai.example
                  </a>
                  .
                </li>
                <li>
                  <strong>Correct</strong> inaccurate data from your settings
                  page.
                </li>
                <li>
                  <strong>Delete</strong> your account + all associated data
                  from <a href="/app/settings">Settings &rarr; Delete account</a>
                  . One click, irreversible, takes effect within 30 days.
                </li>
                <li>
                  <strong>Withdraw consent</strong> — same flow as deletion;
                  withdrawing consent means we can no longer operate the
                  service for you.
                </li>
                <li>
                  <strong>Lodge a complaint</strong> with the Jabatan
                  Perlindungan Data Peribadi (JPDP) if you feel your rights
                  were violated.
                </li>
              </ul>

              <h2>If you are under 18</h2>
              <p>
                You can use Sahabat, but Malaysian law requires parental
                consent for processing the personal data of minors. Please ask
                a parent or guardian to read this policy and the{" "}
                <a href="/legal/pdpa-notice">PDPA Notice</a> with you before
                signing up. If you are already using SAHABAT.AI and are under
                18 without parental knowledge, that is okay — but please do
                involve a trusted adult when you can.
              </p>

              <h2>Security</h2>
              <p>
                All traffic is encrypted in transit (HTTPS). Your password is
                stored as a salted hash — not in plain text. Supabase
                row-level-security policies ensure one user cannot read
                another user&rsquo;s check-ins or chats, even at the database
                level. We follow the principle of least privilege for every
                internal API.
              </p>
              <p>
                We are a small team. We do not yet carry cyber insurance. If a
                breach occurs, we will notify affected users within 72 hours
                and report to JPDP as required.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                When we change this policy, we will update the &ldquo;Last
                updated&rdquo; date above and notify you by email for material
                changes. Continued use after the change constitutes acceptance.
              </p>

              <h2>Contact</h2>
              <p>
                Privacy questions, access requests, or concerns:{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                .
              </p>
            </>
          ),
        },
        bm: {
          title: "Polisi Privasi",
          subtitle:
            "Bagaimana SAHABAT.AI mengumpul, menggunakan, dan melindungi data peribadi anda — dalam bahasa yang mudah difahami.",
          body: (
            <>
              <h2>Ringkasnya</h2>
              <p>
                SAHABAT.AI dibina untuk kesejahteraan anda. Kami hanya kumpul
                apa yang perlu untuk mendengar, belajar, dan menghubungkan
                anda kepada bantuan sebenar di Malaysia. Data adalah milik
                anda. Anda boleh padam akaun pada bila-bila masa. Kami tidak
                jual data. Kami tidak paparkan iklan.
              </p>

              <h2>Siapa kami</h2>
              <p>
                SAHABAT.AI adalah projek pelajar di Universiti Putra Malaysia
                (UPM) untuk ICYOUTH 2026. Pengawal data sehingga entiti
                perundangan rasmi didaftarkan:{" "}
                <strong>
                  Pasukan Projek SAHABAT.AI, UPM Serdang
                </strong>
                . Hubungi:{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                .
              </p>

              <h2>Apa yang kami kumpul</h2>
              <h3>Dari anda secara langsung</h3>
              <ul>
                <li>
                  <strong>Maklumat akaun</strong>: e-mel, hash kata laluan,
                  nama samaran (pilihan), dan keutamaan bahasa.
                </li>
                <li>
                  <strong>Mesej sembang</strong> dengan Sahabat — apa yang
                  anda tulis dan jawapan Sahabat.
                </li>
                <li>
                  <strong>Semakan harian</strong>: skor mood (1–9), jam
                  tidur, nota (pilihan).
                </li>
                <li>
                  <strong>Status padanan rakan</strong> — sama ada anda
                  memilih untuk padanan rakan tanpa nama (disimpan secara
                  tempatan pada pelayar anda buat masa ini).
                </li>
              </ul>
              <h3>Kami terbitkan daripada penggunaan anda</h3>
              <ul>
                <li>
                  <strong>Skor kesejahteraan</strong> (0–100) + tahap
                  (Hijau/Kuning/Jingga/Merah), dikira daripada semakan dan
                  isyarat sembang terkini.
                </li>
                <li>
                  <strong>Isyarat keselamatan</strong> — pengelas AI ringan
                  akan menandakan mesej yang menyebut mencederakan diri atau
                  krisis akut, supaya kami dapat paparkan Talian Kasih dan
                  Befrienders KL secara segera.
                </li>
              </ul>

              <h2>Apa yang kami TIDAK kumpul</h2>
              <ul>
                <li>Nombor KP (MyKad) atau ID kerajaan.</li>
                <li>Nombor telefon.</li>
                <li>Lokasi tepat.</li>
                <li>Senarai kenalan, foto, atau mikrofon.</li>
                <li>
                  Kuki penjejakan atau piksel analitik pihak ketiga (tiada
                  Google Analytics, tiada Meta Pixel).
                </li>
              </ul>

              <h2>Mengapa kami kumpul (asas sah)</h2>
              <p>
                Di bawah{" "}
                <strong>
                  Akta Perlindungan Data Peribadi 2010 (pindaan 2024)
                </strong>
                , kami bergantung pada dua asas:
              </p>
              <ol>
                <li>
                  <strong>Kebenaran nyata anda</strong>, diberi apabila anda
                  menandakan kotak persetujuan PDPA semasa pendaftaran. Data
                  berkaitan kesihatan mental anda adalah{" "}
                  <em>data peribadi sensitif</em> dan tidak akan diproses
                  tanpa tanda ini.
                </li>
                <li>
                  <strong>Kepentingan sah</strong> untuk menjaga keselamatan
                  anda — terhad kepada menjalankan pengelas keselamatan pada
                  mesej anda dan memaparkan talian kecemasan apabila model
                  mengesan risiko. Lihat{" "}
                  <a href="/legal/crisis-policy">Polisi Krisis</a> kami.
                </li>
              </ol>

              <h2>Siapa yang lihat data anda</h2>
              <h3>Dalam pasukan</h3>
              <p>
                Pasukan kecil pelajar pembangun dan (pada masa depan)
                kaunselor berlesen Malaysia. Akses dihadkan oleh RLS Supabase
                supaya jurutera hanya melihat isyarat teragregat dan tanpa
                nama — tidak pernah teks sembang mentah — melainkan anda
                memohon akses di bawah PDPA.
              </p>
              <h3>Pemproses pihak ketiga</h3>
              <ul>
                <li>
                  <strong>Groq, Inc.</strong> (Amerika Syarikat) — menjalankan
                  model bahasa Llama yang menggerakkan Sahabat dan pengelas
                  keselamatan. Teks sembang dihantar ke Groq untuk pemprosesan.
                  Groq menyatakan bahawa mereka tidak menyimpan prompt untuk
                  latihan. Sila ambil kira bahawa data anda sampai ke pelayan
                  di luar Malaysia.
                </li>
                <li>
                  <strong>Supabase, Inc.</strong> (rantau Kesatuan Eropah) —
                  pangkalan data + pengesahan kami. Menyimpan akaun + semakan
                  + log sembang dalam keadaan tersulit.
                </li>
                <li>
                  <strong>Vercel, Inc.</strong> (Amerika Syarikat) — hos
                  laman web. Tidak membaca kandungan sembang; hanya
                  menyampaikan aplikasi kepada pelayar anda.
                </li>
              </ul>
              <p>
                Kami tidak berkongsi data dengan pihak lain — tiada pengiklan,
                tiada penyelidik, tiada entiti kerajaan melainkan di bawah
                perintah mahkamah Malaysia yang sah.
              </p>

              <h2>Berapa lama kami simpan</h2>
              <ul>
                <li>
                  <strong>Akaun + profil</strong>: selagi akaun anda wujud.
                </li>
                <li>
                  <strong>Mesej sembang</strong>: 12 bulan berguling,
                  kemudian dipadamkan secara automatik.
                </li>
                <li>
                  <strong>Semakan + skor kesejahteraan</strong>: 24 bulan
                  berguling, kemudian dipadamkan secara automatik.
                </li>
                <li>
                  <strong>Log peristiwa krisis</strong>: 36 bulan, disimpan
                  untuk audit keselamatan. Ini tanpa nama — tiada kandungan
                  sembang, hanya cap masa dan keputusan talian.
                </li>
              </ul>

              <h2>Hak anda di bawah PDPA</h2>
              <p>Anda boleh, pada bila-bila masa:</p>
              <ul>
                <li>
                  <strong>Akses</strong> salinan data anda — e-mel{" "}
                  <a href="mailto:privacy@sahabat-ai.example">
                    privacy@sahabat-ai.example
                  </a>
                  .
                </li>
                <li>
                  <strong>Betulkan</strong> data tidak tepat dari halaman
                  tetapan anda.
                </li>
                <li>
                  <strong>Padam</strong> akaun + semua data berkaitan dari{" "}
                  <a href="/app/settings">Tetapan &rarr; Padam akaun</a>.
                  Satu klik, tidak boleh diundur, berkuat kuasa dalam masa
                  30 hari.
                </li>
                <li>
                  <strong>Tarik balik kebenaran</strong> — aliran sama dengan
                  pemadaman; menarik balik kebenaran bermakna kami tidak
                  boleh lagi menjalankan perkhidmatan untuk anda.
                </li>
                <li>
                  <strong>Failkan aduan</strong> dengan Jabatan Perlindungan
                  Data Peribadi (JPDP) jika anda merasakan hak anda
                  dilanggar.
                </li>
              </ul>

              <h2>Jika anda di bawah 18 tahun</h2>
              <p>
                Anda boleh menggunakan Sahabat, tetapi undang-undang Malaysia
                memerlukan kebenaran ibu bapa untuk memproses data peribadi
                kanak-kanak. Sila minta ibu bapa atau penjaga membaca polisi
                ini dan{" "}
                <a href="/legal/pdpa-notice">Notis PDPA</a> bersama anda
                sebelum mendaftar. Jika anda sudah menggunakan SAHABAT.AI dan
                di bawah 18 tanpa pengetahuan ibu bapa, tidak mengapa — tetapi
                sila libatkan orang dewasa yang anda percayai apabila anda
                boleh.
              </p>

              <h2>Keselamatan</h2>
              <p>
                Semua trafik disulitkan semasa penghantaran (HTTPS). Kata
                laluan anda disimpan sebagai hash bergaram — bukan teks biasa.
                Polisi RLS Supabase memastikan seorang pengguna tidak boleh
                membaca semakan atau sembang pengguna lain, walaupun pada
                peringkat pangkalan data. Kami mengikut prinsip keistimewaan
                minimum untuk setiap API dalaman.
              </p>
              <p>
                Kami pasukan kecil. Kami belum memegang insurans siber. Jika
                berlaku pelanggaran, kami akan maklumkan pengguna yang
                terjejas dalam masa 72 jam dan melaporkan kepada JPDP seperti
                yang diperlukan.
              </p>

              <h2>Perubahan kepada polisi ini</h2>
              <p>
                Apabila kami mengubah polisi ini, kami akan mengemas kini
                tarikh &ldquo;Kemas kini terakhir&rdquo; di atas dan
                memberitahu anda melalui e-mel untuk perubahan besar.
                Penggunaan berterusan selepas perubahan dianggap penerimaan.
              </p>

              <h2>Hubungi kami</h2>
              <p>
                Soalan privasi, permintaan akses, atau kebimbangan:{" "}
                <a href="mailto:privacy@sahabat-ai.example">
                  privacy@sahabat-ai.example
                </a>
                .
              </p>
            </>
          ),
        },
      }}
    />
  );
}
