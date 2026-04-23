"use client";

import { LegalPage } from "@/components/legal-page";

/**
 * Crisis Policy — operational document describing what Sahabat does when the
 * safety classifier detects acute risk. Public-facing so users know exactly
 * what happens to their chat when they write something alarming.
 *
 * Deliberately concrete: states the helplines, the thresholds, what is logged
 * and what is NOT logged, and the honest limits of a student project.
 */
export default function CrisisPolicyPage() {
  return (
    <LegalPage
      lastUpdatedISO="2026-04-24"
      content={{
        en: {
          title: "Crisis Policy",
          subtitle:
            "What Sahabat does when you write something that worries us — and what you should do when Sahabat is not enough.",
          body: (
            <>
              <div className="rounded-2xl border border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5 p-5">
                <p className="!mb-2">
                  <strong>If you are in immediate danger right now:</strong>
                </p>
                <ul className="!mb-0">
                  <li>
                    <strong>Talian Kasih 15999</strong> — call or WhatsApp,
                    24/7, free, BM + EN.
                  </li>
                  <li>
                    <strong>Befrienders KL</strong> — +603-7627 2929, 24/7
                    emotional support.
                  </li>
                  <li>
                    <strong>MERS 999</strong> — medical / police emergency.
                  </li>
                </ul>
              </div>

              <h2>Our promise to you</h2>
              <p>
                Sahabat is a student-built project, not a crisis service. But
                because young Malaysians do open up to chat first, we take
                our duty of care seriously. This policy states what Sahabat
                will do, what it will not do, and where the human help lives.
              </p>

              <h2>How Sahabat listens for risk</h2>
              <p>
                Every message you send to Sahabat is passed through a
                lightweight AI safety classifier (Llama 3.1 8B) that
                estimates the likelihood of acute distress. The classifier
                returns one of four signals:
              </p>
              <ul>
                <li>
                  <strong>Green</strong> — ordinary conversation, no
                  intervention.
                </li>
                <li>
                  <strong>Yellow</strong> — mild distress (stress, sadness,
                  lonely). Sahabat replies more warmly and may ask
                  open-ended questions.
                </li>
                <li>
                  <strong>Orange</strong> — meaningful distress or
                  hopelessness. Sahabat gently names what it heard, validates
                  you, and offers to share helpline info if you want it.
                </li>
                <li>
                  <strong>Red</strong> — explicit self-harm, suicidal
                  ideation, or imminent danger to you or another person.
                  Sahabat <em>stops its normal companion reply</em> and
                  instead surfaces a red-banner crisis card with the
                  helplines above, a clear &ldquo;you are not alone&rdquo;
                  message, and a prompt to contact a real human.
                </li>
              </ul>

              <h2>What happens when Red is triggered</h2>
              <ol>
                <li>
                  The crisis card appears immediately in the chat. It is not
                  dismissible until you confirm you have seen it.
                </li>
                <li>
                  Your wellbeing tier is recomputed and displayed as{" "}
                  <em>Red</em> for at least 24 hours.
                </li>
                <li>
                  A <strong>crisis-event log entry</strong> is written with:
                  the timestamp, the tier change, and the helplines that were
                  surfaced.{" "}
                  <strong>
                    The original message text is NOT written to this log.
                  </strong>{" "}
                  We log that a crisis was handled, not what you said.
                </li>
                <li>
                  On your next visit, Sahabat will check in gently (&ldquo;hey,
                  glad you&rsquo;re back — how are you holding on&rdquo;) and
                  re-offer helpline info. We will not ignore the event, and
                  we will not make you relive it in detail either.
                </li>
              </ol>

              <h2>What Sahabat does NOT do</h2>
              <ul>
                <li>
                  Sahabat does not contact emergency services on your behalf.
                </li>
                <li>
                  Sahabat does not contact your parents, school, counsellor,
                  or any third party.
                </li>
                <li>
                  Sahabat does not use your location. It cannot and will not
                  dispatch help to your physical address.
                </li>
                <li>
                  Sahabat does not keep the raw text of crisis messages in
                  long-term logs. After the 12-month rolling chat retention
                  expires, the message is deleted along with the rest of
                  your chat history.
                </li>
              </ul>

              <h2>Human review</h2>
              <p>
                During the ICYOUTH 2026 prototype phase, the project team
                periodically reviews{" "}
                <strong>anonymised, aggregated</strong> crisis-event metadata
                (counts, timestamps, helpline-surfacing success) to check the
                classifier is working. Individual chat text is{" "}
                <em>not</em> reviewed unless you yourself request a data
                access report under PDPA.
              </p>
              <p>
                After the hackathon and before real public launch, we intend
                to partner with a licensed Malaysian counselling service so a
                trained human can, with your consent, follow up on Red
                events. That relationship is not yet in place. We will
                update this page (and email existing users) before that
                changes.
              </p>

              <h2>False positives and how to correct them</h2>
              <p>
                The classifier is not perfect. If Sahabat surfaces the crisis
                card when you were joking, quoting lyrics, or discussing a
                fictional character, just tell Sahabat &ldquo;I&rsquo;m
                okay&rdquo; — it will return to normal conversation. We log
                the correction (anonymised) so we can tune the model.
              </p>
              <p>
                If you feel Sahabat reacted wrongly or harmed you in any
                way, please email{" "}
                <a href="mailto:safety@sahabat-ai.example">
                  safety@sahabat-ai.example
                </a>
                . Every complaint is read by a human on the team within 72
                hours.
              </p>

              <h2>If you are worried about a friend on Sahabat</h2>
              <p>
                We do not disclose any user&rsquo;s account, activity, or
                wellbeing data to anyone — not even parents, not even
                friends. If you are worried about someone:
              </p>
              <ul>
                <li>
                  Reach out to them directly. A &ldquo;hey, I thought of
                  you&rdquo; text matters.
                </li>
                <li>
                  If you believe they are in immediate danger, call{" "}
                  <strong>Talian Kasih 15999</strong> or{" "}
                  <strong>MERS 999</strong>.
                </li>
                <li>
                  Befrienders KL also takes calls from people worried about
                  someone else.
                </li>
              </ul>

              <h2>Honest limits</h2>
              <p>
                This is a student project. We can lose internet, our AI
                provider can go down, and the classifier can miss a
                low-volume signal. Please do not rely on Sahabat as your
                primary safety net. The helplines above run on national
                infrastructure and are available whether our app is working
                or not.
              </p>

              <h2>Contact</h2>
              <p>
                Safety and crisis-handling questions:{" "}
                <a href="mailto:safety@sahabat-ai.example">
                  safety@sahabat-ai.example
                </a>
                .
              </p>
            </>
          ),
        },
        bm: {
          title: "Polisi Krisis",
          subtitle:
            "Apa yang Sahabat lakukan apabila anda menulis sesuatu yang merisaukan kami — dan apa yang anda perlu buat apabila Sahabat tidak mencukupi.",
          body: (
            <>
              <div className="rounded-2xl border border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5 p-5">
                <p className="!mb-2">
                  <strong>Jika anda dalam bahaya segera sekarang:</strong>
                </p>
                <ul className="!mb-0">
                  <li>
                    <strong>Talian Kasih 15999</strong> — panggil atau
                    WhatsApp, 24/7, percuma, BM + EN.
                  </li>
                  <li>
                    <strong>Befrienders KL</strong> — +603-7627 2929, sokongan
                    emosi 24/7.
                  </li>
                  <li>
                    <strong>MERS 999</strong> — kecemasan perubatan / polis.
                  </li>
                </ul>
              </div>

              <h2>Janji kami kepada anda</h2>
              <p>
                Sahabat adalah projek pelajar, bukan perkhidmatan krisis.
                Tetapi kerana belia Malaysia sering meluahkan hati dalam
                sembang dahulu, kami memikul tanggungjawab menjaga anda
                dengan serius. Polisi ini menyatakan apa yang Sahabat akan
                buat, apa yang Sahabat tidak akan buat, dan di mana bantuan
                manusia berada.
              </p>

              <h2>Bagaimana Sahabat mendengar risiko</h2>
              <p>
                Setiap mesej yang anda hantar kepada Sahabat melalui pengelas
                keselamatan AI ringan (Llama 3.1 8B) yang menganggar
                kebarangkalian tekanan akut. Pengelas mengembalikan salah
                satu daripada empat isyarat:
              </p>
              <ul>
                <li>
                  <strong>Hijau</strong> — perbualan biasa, tiada campur
                  tangan.
                </li>
                <li>
                  <strong>Kuning</strong> — tekanan ringan (stres, sedih,
                  sunyi). Sahabat menjawab lebih mesra dan mungkin bertanya
                  soalan terbuka.
                </li>
                <li>
                  <strong>Jingga</strong> — tekanan ketara atau rasa tiada
                  harapan. Sahabat dengan lembut menamakan apa yang
                  didengari, mengesahkan perasaan anda, dan menawarkan
                  maklumat talian jika anda mahu.
                </li>
                <li>
                  <strong>Merah</strong> — menyebut mencederakan diri, niat
                  bunuh diri, atau bahaya segera kepada anda atau orang
                  lain. Sahabat <em>berhenti membalas secara biasa</em> dan
                  sebaliknya memaparkan kad krisis berpalang merah dengan
                  talian di atas, mesej jelas &ldquo;anda tidak bersendirian&rdquo;,
                  dan dorongan untuk menghubungi manusia sebenar.
                </li>
              </ul>

              <h2>Apa berlaku apabila Merah dicetuskan</h2>
              <ol>
                <li>
                  Kad krisis muncul serta-merta dalam sembang. Ia tidak
                  boleh ditutup sehingga anda mengesahkan anda telah
                  melihatnya.
                </li>
                <li>
                  Tahap kesejahteraan anda dikira semula dan dipaparkan
                  sebagai <em>Merah</em> selama sekurang-kurangnya 24 jam.
                </li>
                <li>
                  Satu <strong>entri log peristiwa krisis</strong> ditulis
                  dengan: cap masa, perubahan tahap, dan talian yang
                  dipaparkan.{" "}
                  <strong>
                    Teks mesej asal TIDAK ditulis ke log ini.
                  </strong>{" "}
                  Kami log bahawa krisis telah diuruskan, bukan apa yang
                  anda tulis.
                </li>
                <li>
                  Pada lawatan seterusnya, Sahabat akan menegur anda dengan
                  lembut (&ldquo;hai, gembira awak kembali — macam mana
                  keadaan&rdquo;) dan menawarkan semula maklumat talian.
                  Kami tidak akan abaikan peristiwa itu, dan kami juga tidak
                  akan memaksa anda mengulanginya secara terperinci.
                </li>
              </ol>

              <h2>Apa yang Sahabat TIDAK buat</h2>
              <ul>
                <li>
                  Sahabat tidak menghubungi perkhidmatan kecemasan bagi
                  pihak anda.
                </li>
                <li>
                  Sahabat tidak menghubungi ibu bapa, sekolah, kaunselor,
                  atau pihak ketiga lain.
                </li>
                <li>
                  Sahabat tidak menggunakan lokasi anda. Ia tidak boleh dan
                  tidak akan menghantar bantuan ke alamat fizikal anda.
                </li>
                <li>
                  Sahabat tidak menyimpan teks mentah mesej krisis dalam
                  log jangka panjang. Selepas pengekalan sembang 12 bulan
                  tamat, mesej dipadamkan bersama sejarah sembang anda yang
                  lain.
                </li>
              </ul>

              <h2>Semakan manusia</h2>
              <p>
                Semasa fasa prototaip ICYOUTH 2026, pasukan projek secara
                berkala menyemak{" "}
                <strong>metadata teragregat tanpa nama</strong> peristiwa
                krisis (bilangan, cap masa, kejayaan pemaparan talian) untuk
                menyemak pengelas berfungsi. Teks sembang individu{" "}
                <em>tidak</em> disemak melainkan anda sendiri meminta laporan
                akses data di bawah PDPA.
              </p>
              <p>
                Selepas hackathon dan sebelum pelancaran awam sebenar, kami
                berhasrat untuk bekerjasama dengan perkhidmatan kaunseling
                Malaysia berlesen supaya manusia terlatih boleh, dengan
                kebenaran anda, membuat susulan peristiwa Merah. Hubungan
                itu belum lagi terjalin. Kami akan mengemas kini halaman
                ini (dan e-mel pengguna sedia ada) sebelum itu berubah.
              </p>

              <h2>Positif palsu dan cara membetulkannya</h2>
              <p>
                Pengelas tidak sempurna. Jika Sahabat memaparkan kad krisis
                apabila anda hanya bergurau, memetik lirik, atau
                membincangkan watak fiksyen, cuma beritahu Sahabat
                &ldquo;saya okay&rdquo; — ia akan kembali ke perbualan
                biasa. Kami log pembetulan (tanpa nama) supaya kami dapat
                menala model.
              </p>
              <p>
                Jika anda merasakan Sahabat bertindak salah atau
                menyakitkan anda, sila e-mel{" "}
                <a href="mailto:safety@sahabat-ai.example">
                  safety@sahabat-ai.example
                </a>
                . Setiap aduan dibaca oleh manusia dalam pasukan dalam
                tempoh 72 jam.
              </p>

              <h2>Jika anda risau tentang rakan di Sahabat</h2>
              <p>
                Kami tidak mendedahkan akaun, aktiviti, atau data
                kesejahteraan mana-mana pengguna kepada sesiapa — termasuk
                ibu bapa, termasuk rakan. Jika anda risau tentang seseorang:
              </p>
              <ul>
                <li>
                  Hubungi mereka terus. Satu mesej &ldquo;hei, aku
                  teringat kau&rdquo; sangat bermakna.
                </li>
                <li>
                  Jika anda percaya mereka dalam bahaya segera, panggil{" "}
                  <strong>Talian Kasih 15999</strong> atau{" "}
                  <strong>MERS 999</strong>.
                </li>
                <li>
                  Befrienders KL juga menerima panggilan daripada orang
                  yang risau tentang orang lain.
                </li>
              </ul>

              <h2>Had jujur</h2>
              <p>
                Ini projek pelajar. Kami boleh kehilangan internet,
                penyedia AI kami boleh turun, dan pengelas boleh terlepas
                isyarat dengan isipadu rendah. Sila jangan bergantung pada
                Sahabat sebagai jaring keselamatan utama anda. Talian di
                atas berjalan di atas infrastruktur kebangsaan dan tersedia
                sama ada aplikasi kami berfungsi atau tidak.
              </p>

              <h2>Hubungi</h2>
              <p>
                Soalan keselamatan dan pengendalian krisis:{" "}
                <a href="mailto:safety@sahabat-ai.example">
                  safety@sahabat-ai.example
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
