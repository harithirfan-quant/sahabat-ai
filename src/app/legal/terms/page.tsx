"use client";

import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      lastUpdatedISO="2026-04-24"
      content={{
        en: {
          title: "Terms of Service",
          subtitle:
            "The rules of using SAHABAT.AI — what we promise, what you agree to, and (most importantly) what Sahabat is NOT.",
          body: (
            <>
              <h2>1. What Sahabat is — and what it is NOT</h2>
              <p>
                <strong>Sahabat is a supportive companion, not a therapist.</strong>{" "}
                Sahabat is an AI chat designed to listen, reflect your feelings
                back to you in a warm way, and point you toward real help when
                you need it. Sahabat is built by students at UPM as a
                wellbeing-first project — not a clinical service.
              </p>
              <div className="rounded-xl border border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5 p-4 my-4">
                <p className="mb-2">
                  <strong>Sahabat is NOT:</strong>
                </p>
                <ul className="!mb-0">
                  <li>a licensed therapist, psychiatrist, or counsellor;</li>
                  <li>
                    a replacement for real medical or mental-health care;
                  </li>
                  <li>a diagnostic tool — it does not diagnose depression,
                    anxiety, or any condition;</li>
                  <li>a crisis line — if you are in danger, see Section 4;</li>
                  <li>a record that goes to your parents, school, employer,
                    or the government.</li>
                </ul>
              </div>
              <p>
                AI can get things wrong, miss context, and give advice that
                does not fit your situation. Always use your own judgement and
                speak to a qualified human when stakes are high.
              </p>

              <h2>2. Who can use Sahabat</h2>
              <p>
                You may use SAHABAT.AI if you are{" "}
                <strong>15 years of age or older</strong> and resident in
                Malaysia. If you are under 18, you confirm that a parent or
                legal guardian has reviewed these Terms and the{" "}
                <a href="/legal/privacy">Privacy Policy</a> with you and agrees
                to your use of the service. (This reflects s.10 of the
                Contracts Act 1950, which limits the capacity of minors to
                enter binding contracts, together with the parental-consent
                expectation for processing a minor&rsquo;s sensitive personal
                data under PDPA 2010.)
              </p>

              <h2>3. Your account</h2>
              <ul>
                <li>
                  Keep your password secret. You are responsible for activity
                  on your account.
                </li>
                <li>
                  Give us a working email so we can reach you about security
                  incidents.
                </li>
                <li>
                  You may use an anonymous handle — in fact, we encourage it.
                </li>
                <li>
                  One person, one account. Shared accounts defeat the
                  personalisation and the safety signals.
                </li>
              </ul>

              <h2>4. In an emergency</h2>
              <p>
                If you are thinking of harming yourself, or someone else is in
                immediate danger, <strong>Sahabat is not enough</strong>.
                Please contact, in this order:
              </p>
              <ol>
                <li>
                  <strong>Talian Kasih 15999</strong> — 24/7, confidential,
                  free, available in Bahasa Malaysia + English.
                </li>
                <li>
                  <strong>Befrienders KL</strong> — +603-7627 2929 (24/7
                  emotional support).
                </li>
                <li>
                  <strong>MERS 999</strong> — for immediate medical emergency.
                </li>
              </ol>
              <p>
                We will surface these numbers inside the app whenever our
                safety model detects a crisis signal. See our{" "}
                <a href="/legal/crisis-policy">Crisis Policy</a> for how this
                works.
              </p>

              <h2>5. What you may do</h2>
              <ul>
                <li>
                  Use Sahabat for your own personal wellbeing, journalling,
                  and reflection.
                </li>
                <li>
                  Share your wellbeing score with a friend, a counsellor, or a
                  parent if <em>you</em> choose to — it&rsquo;s your data.
                </li>
                <li>
                  Delete your data and walk away, any time, no questions
                  asked.
                </li>
              </ul>

              <h2>6. What you may NOT do</h2>
              <ul>
                <li>
                  Use Sahabat to harm, harass, or threaten another person.
                </li>
                <li>
                  Impersonate someone else or create an account on behalf of
                  someone without their knowledge.
                </li>
                <li>
                  Try to manipulate Sahabat into generating harmful content
                  (drugs, weapons, self-harm instructions, sexual content
                  involving minors). We log attempts to bypass safety filters.
                </li>
                <li>
                  Scrape, crawl, reverse-engineer, or overload the service.
                </li>
                <li>
                  Use Sahabat for commercial advice, clinical decisions, or
                  any purpose outside personal wellbeing.
                </li>
                <li>
                  Repost other users&rsquo; chats or identifying information
                  (if you meet them through any peer feature).
                </li>
              </ul>
              <p>
                We may suspend or delete accounts that violate these rules,
                without refund (the service is free during ICYOUTH 2026).
              </p>

              <h2>7. Your content</h2>
              <p>
                You own what you write. By sending a message, you give us a
                limited licence to process, store, and display it so we can
                provide the service. We do not train any AI model on your
                personal chat content. We do not sell it. We do not publish
                it.
              </p>
              <p>
                For aggregated, anonymised research (e.g. &ldquo;how many
                Malaysian youth mentioned exam stress this month&rdquo;), we
                may use statistical summaries that cannot be traced back to
                any single person.
              </p>

              <h2>8. AI outputs</h2>
              <p>
                Sahabat&rsquo;s replies are generated by large language models
                and can be wrong, outdated, or culturally off. <strong>Do not
                rely on Sahabat for medical, legal, financial, academic, or
                safety decisions.</strong> If Sahabat says something that
                feels off, trust your gut, not the model.
              </p>

              <h2>9. Service availability</h2>
              <p>
                We run this as a student project on best-effort infrastructure
                (Vercel + Supabase + Groq). We do not promise 100% uptime. We
                may change, pause, or discontinue features — if we shut the
                whole service down, we will give you at least 30 days&rsquo;
                notice and an export of your data.
              </p>

              <h2>10. Limits of our liability</h2>
              <p>
                To the maximum extent permitted by Malaysian law:
              </p>
              <ul>
                <li>
                  SAHABAT.AI is provided &ldquo;as is&rdquo; without warranty
                  of any kind.
                </li>
                <li>
                  We are not liable for indirect, incidental, or consequential
                  damages arising from your use of Sahabat.
                </li>
                <li>
                  We are not liable for decisions you make based on
                  Sahabat&rsquo;s outputs. Sahabat does not replace a
                  professional.
                </li>
              </ul>
              <p>
                Nothing in these Terms excludes liability for death or
                personal injury caused by our proven negligence, fraud, or
                anything else that cannot be limited by Malaysian law.
              </p>

              <h2>11. Termination</h2>
              <p>
                You may end this agreement at any time by deleting your
                account from{" "}
                <a href="/app/settings">Settings &rarr; Delete account</a>. We
                may terminate or suspend your account if you breach these
                Terms, if we are required to by law, or if we reasonably
                believe you are putting yourself or another user at risk.
              </p>

              <h2>12. Changes to these Terms</h2>
              <p>
                We will post updates on this page and update the &ldquo;Last
                updated&rdquo; date. For material changes we will email you
                and ask you to re-confirm consent.
              </p>

              <h2>13. Governing law</h2>
              <p>
                These Terms are governed by the laws of Malaysia. Any dispute
                shall be resolved in the courts of Malaysia, preferably
                through mediation at the Asian International Arbitration
                Centre (AIAC) in the first instance.
              </p>

              <h2>14. Contact</h2>
              <p>
                Questions about these Terms:{" "}
                <a href="mailto:hello@sahabat-ai.example">
                  hello@sahabat-ai.example
                </a>
                .
              </p>
            </>
          ),
        },
        bm: {
          title: "Terma Perkhidmatan",
          subtitle:
            "Peraturan menggunakan SAHABAT.AI — apa yang kami janjikan, apa yang anda setujui, dan (yang paling penting) apa yang Sahabat BUKAN.",
          body: (
            <>
              <h2>1. Apa itu Sahabat — dan apa yang BUKAN</h2>
              <p>
                <strong>
                  Sahabat adalah rakan penyokong, bukan ahli terapi.
                </strong>{" "}
                Sahabat adalah sembang AI yang direka untuk mendengar,
                memantulkan perasaan anda dengan mesra, dan menunjukkan anda
                ke arah bantuan sebenar apabila diperlukan. Sahabat dibina
                oleh pelajar UPM sebagai projek kesejahteraan — bukan
                perkhidmatan klinikal.
              </p>
              <div className="rounded-xl border border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5 p-4 my-4">
                <p className="mb-2">
                  <strong>Sahabat BUKAN:</strong>
                </p>
                <ul className="!mb-0">
                  <li>
                    ahli terapi, psikiatri, atau kaunselor berlesen;
                  </li>
                  <li>
                    pengganti penjagaan perubatan atau kesihatan mental
                    sebenar;
                  </li>
                  <li>
                    alat diagnosis — ia tidak mendiagnosis kemurungan,
                    kebimbangan, atau sebarang keadaan;
                  </li>
                  <li>
                    talian krisis — jika anda dalam bahaya, lihat Bahagian 4;
                  </li>
                  <li>
                    rekod yang sampai kepada ibu bapa, sekolah, majikan, atau
                    kerajaan anda.
                  </li>
                </ul>
              </div>
              <p>
                AI boleh silap, terlepas konteks, dan memberi nasihat yang
                tidak sesuai dengan keadaan anda. Sentiasa guna pertimbangan
                anda sendiri dan bercakap dengan manusia berkelayakan apabila
                situasi serius.
              </p>

              <h2>2. Siapa boleh guna Sahabat</h2>
              <p>
                Anda boleh menggunakan SAHABAT.AI jika anda berumur{" "}
                <strong>15 tahun ke atas</strong> dan bermastautin di
                Malaysia. Jika anda bawah 18 tahun, anda mengesahkan bahawa
                ibu bapa atau penjaga sah telah menyemak Terma ini dan{" "}
                <a href="/legal/privacy">Polisi Privasi</a> bersama anda dan
                bersetuju dengan penggunaan perkhidmatan ini. (Ini
                mencerminkan s.10 Akta Kontrak 1950, yang menghadkan
                keupayaan kanak-kanak untuk memeterai kontrak yang mengikat,
                bersama jangkaan kebenaran ibu bapa untuk memproses data
                peribadi sensitif kanak-kanak di bawah PDPA 2010.)
              </p>

              <h2>3. Akaun anda</h2>
              <ul>
                <li>
                  Rahsiakan kata laluan. Anda bertanggungjawab untuk
                  aktiviti akaun anda.
                </li>
                <li>
                  Beri e-mel yang sah supaya kami boleh menghubungi anda
                  tentang insiden keselamatan.
                </li>
                <li>
                  Anda boleh guna nama samaran — malah, kami menggalakkan.
                </li>
                <li>
                  Satu orang, satu akaun. Akaun yang dikongsi mengganggu
                  pemperibadian dan isyarat keselamatan.
                </li>
              </ul>

              <h2>4. Dalam kecemasan</h2>
              <p>
                Jika anda berfikir untuk mencederakan diri, atau seseorang
                dalam bahaya segera, <strong>Sahabat tidak mencukupi</strong>.
                Sila hubungi, mengikut susunan ini:
              </p>
              <ol>
                <li>
                  <strong>Talian Kasih 15999</strong> — 24/7, sulit, percuma,
                  Bahasa Malaysia + Bahasa Inggeris.
                </li>
                <li>
                  <strong>Befrienders KL</strong> — +603-7627 2929 (sokongan
                  emosi 24/7).
                </li>
                <li>
                  <strong>MERS 999</strong> — untuk kecemasan perubatan
                  segera.
                </li>
              </ol>
              <p>
                Kami akan memaparkan nombor-nombor ini di dalam aplikasi
                setiap kali model keselamatan kami mengesan isyarat krisis.
                Lihat <a href="/legal/crisis-policy">Polisi Krisis</a> kami
                untuk maklumat lanjut.
              </p>

              <h2>5. Apa yang anda boleh buat</h2>
              <ul>
                <li>
                  Gunakan Sahabat untuk kesejahteraan peribadi, jurnal, dan
                  renungan anda.
                </li>
                <li>
                  Kongsi skor kesejahteraan anda dengan rakan, kaunselor,
                  atau ibu bapa jika <em>anda</em> yang pilih — ia data anda.
                </li>
                <li>
                  Padam data anda dan berhenti, bila-bila masa, tanpa perlu
                  memberi alasan.
                </li>
              </ul>

              <h2>6. Apa yang anda TIDAK boleh buat</h2>
              <ul>
                <li>
                  Guna Sahabat untuk mencederakan, mengganggu, atau mengugut
                  orang lain.
                </li>
                <li>
                  Menyamar sebagai orang lain atau membuat akaun bagi pihak
                  seseorang tanpa pengetahuan mereka.
                </li>
                <li>
                  Cuba memanipulasi Sahabat untuk menjana kandungan
                  berbahaya (dadah, senjata, arahan mencederakan diri,
                  kandungan seksual melibatkan kanak-kanak). Kami log
                  percubaan memintas penapis keselamatan.
                </li>
                <li>
                  Mengikis, merangkak, terbalikkan jurutera, atau membebankan
                  perkhidmatan.
                </li>
                <li>
                  Guna Sahabat untuk nasihat komersil, keputusan klinikal,
                  atau sebarang tujuan di luar kesejahteraan peribadi.
                </li>
                <li>
                  Siarkan semula sembang atau maklumat pengenalan pengguna
                  lain (jika anda bertemu mereka melalui mana-mana ciri rakan
                  sebaya).
                </li>
              </ul>
              <p>
                Kami mungkin menggantung atau memadamkan akaun yang
                melanggar peraturan ini, tanpa bayaran balik (perkhidmatan
                ini percuma sepanjang ICYOUTH 2026).
              </p>

              <h2>7. Kandungan anda</h2>
              <p>
                Anda memiliki apa yang anda tulis. Dengan menghantar mesej,
                anda memberikan kami lesen terhad untuk memproses, menyimpan,
                dan memaparkannya supaya kami boleh menyediakan
                perkhidmatan. Kami tidak melatih sebarang model AI pada
                kandungan sembang peribadi anda. Kami tidak menjualnya. Kami
                tidak menyiarkannya.
              </p>
              <p>
                Untuk penyelidikan teragregat tanpa nama (cth. &ldquo;berapa
                ramai belia Malaysia menyebut tekanan peperiksaan bulan
                ini&rdquo;), kami mungkin menggunakan ringkasan statistik
                yang tidak boleh dikesan kembali kepada mana-mana individu.
              </p>

              <h2>8. Output AI</h2>
              <p>
                Jawapan Sahabat dihasilkan oleh model bahasa besar dan boleh
                salah, lapuk, atau tidak sesuai dari segi budaya.{" "}
                <strong>
                  Jangan bergantung pada Sahabat untuk keputusan perubatan,
                  undang-undang, kewangan, akademik, atau keselamatan.
                </strong>{" "}
                Jika Sahabat mengatakan sesuatu yang terasa pelik, percayai
                naluri anda, bukan model.
              </p>

              <h2>9. Ketersediaan perkhidmatan</h2>
              <p>
                Kami menjalankan ini sebagai projek pelajar di atas
                infrastruktur best-effort (Vercel + Supabase + Groq). Kami
                tidak menjanjikan masa operasi 100%. Kami mungkin mengubah,
                menjeda, atau menghentikan ciri — jika kami menutup
                keseluruhan perkhidmatan, kami akan memberi sekurang-kurangnya
                30 hari notis dan eksport data anda.
              </p>

              <h2>10. Had liabiliti kami</h2>
              <p>
                Setakat maksimum yang dibenarkan oleh undang-undang Malaysia:
              </p>
              <ul>
                <li>
                  SAHABAT.AI disediakan &ldquo;sebagaimana adanya&rdquo;
                  tanpa sebarang jaminan.
                </li>
                <li>
                  Kami tidak bertanggungjawab untuk kerosakan tidak
                  langsung, sampingan, atau berbangkit daripada penggunaan
                  Sahabat.
                </li>
                <li>
                  Kami tidak bertanggungjawab untuk keputusan yang anda buat
                  berdasarkan output Sahabat. Sahabat tidak menggantikan
                  profesional.
                </li>
              </ul>
              <p>
                Tiada apa-apa dalam Terma ini mengecualikan liabiliti untuk
                kematian atau kecederaan peribadi disebabkan oleh kecuaian
                kami yang terbukti, penipuan, atau apa-apa yang tidak boleh
                dihadkan oleh undang-undang Malaysia.
              </p>

              <h2>11. Penamatan</h2>
              <p>
                Anda boleh menamatkan perjanjian ini pada bila-bila masa
                dengan memadamkan akaun anda dari{" "}
                <a href="/app/settings">Tetapan &rarr; Padam akaun</a>. Kami
                mungkin menamatkan atau menggantung akaun anda jika anda
                melanggar Terma ini, jika dikehendaki oleh undang-undang,
                atau jika kami percaya secara munasabah anda meletakkan diri
                atau pengguna lain dalam risiko.
              </p>

              <h2>12. Perubahan kepada Terma ini</h2>
              <p>
                Kami akan memaparkan kemas kini pada halaman ini dan
                mengemas kini tarikh &ldquo;Kemas kini terakhir&rdquo;. Untuk
                perubahan besar, kami akan e-mel anda dan meminta anda
                mengesahkan semula persetujuan.
              </p>

              <h2>13. Undang-undang yang terpakai</h2>
              <p>
                Terma ini tertakluk kepada undang-undang Malaysia. Sebarang
                pertikaian akan diselesaikan di mahkamah Malaysia, lebih
                baik melalui pengantaraan di Pusat Timbang Tara Antarabangsa
                Asia (AIAC) pada peringkat pertama.
              </p>

              <h2>14. Hubungi kami</h2>
              <p>
                Soalan tentang Terma ini:{" "}
                <a href="mailto:hello@sahabat-ai.example">
                  hello@sahabat-ai.example
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
