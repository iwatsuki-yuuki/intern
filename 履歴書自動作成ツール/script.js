// ★ GAS連携用URL
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyYmqbjwwkZlxWNfFVZi8ORT0mHw0sh9VlpYBcVsYz_UZSB63OM6LOya0UAZgZgCyhGpw/exec";

// (A) 履歴書HTMLテンプレート（各セクションを .block で区切っている）
const resumeTemplate = `
  <div class="resume-preview">
    <div class="resume-content" id="resume-content-whole">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5mm;">
        <div class="title">履歴書</div>
        <div class="date-right" id="preview-today-date"></div>
      </div>

      <!-- (1) 名前・ふりがな + 写真 -->
      <div class="block">
        <div class="top-section">
          <table class="name-furigana-table">
            <tr class="furigana-box">
              <td class="furigana-label">ふりがな</td>
              <td class="furigana-value">
                <span id="preview-furigana"></span>
              </td>
            </tr>
            <tr class="name-table">
              <td class="name-label">氏名</td>
              <td class="name-value-left">
                <span id="preview-name" style="font-weight: bold"></span>
              </td>
            </tr>
          </table>
          <div class="photo-box">
            <img id="preview-photo-img" />
          </div>
        </div>
      </div>

      <!-- (2) 生年月日・性別 -->
      <div class="block">
        <table class="birthday-gender-table">
          <tr class="birthday-box">
            <td class="birthday-label">生年月日</td>
            <td class="birthday-value">
              <span id="preview-birth-year"></span>年
              <span id="preview-birth-month"></span>月
              <span id="preview-birth-day"></span>日（
              <span id="preview-age"></span>歳）
            </td>
            <td class="gender-value">
              <span id="preview-gender"></span>
            </td>
          </tr>
        </table>
      </div>

      <!-- (3) 電話番号・Email・現住所 -->
      <div class="block">
        <table class="contact-info-table">
          <tr class="contact-info">
            <th class="address-furigana-label">ふりがな</th>
            <td class="address-furigana-value">
              <span id="preview-address-furigana"></span>
            </td>
            <th class="tel-label">電話</th>
            <td class="tel-value">
              <span id="preview-phone"></span>
            </td>
          </tr>
          <tr>
            <th class="address-label">現住所</th>
            <td class="address-value">
              〒<span id="preview-postal-code"></span><br />
              <span id="preview-address"></span>
            </td>
            <th class="email-label">Email</th>
            <td class="email-value">
              <span id="preview-email"></span>
            </td>
          </tr>
        </table>
      </div>

      <!-- (4) 連絡先（現住所以外） -->
      <div class="block">
        <table class="alt-contact-table">
          <tr class="alt-contact-info">
            <th class="alt-address-furigana-label">ふりがな</th>
            <td class="alt-address-furigana-value">
              <span id="preview-alt-address-furigana"></span>
            </td>
            <th class="alt-tel-label">電話</th>
            <td class="alt-tel-value">
              <span id="preview-alt-phone"></span>
            </td>
          </tr>
          <tr>
            <th class="alt-address-label">現住所</th>
            <td class="alt-address-value">
              〒<span id="preview-alt-postal-code"></span><br />
              <span id="preview-alt-address"></span>
            </td>
            <th class="alt-email-label">Email</th>
            <td class="email-value">
              <span id="preview-alt-email"></span>
            </td>
          </tr>
        </table>
      </div>

      <!-- (5) 学歴・職歴 -->
      <div class="block">
        <table class="education-table">
          <tr class="education-info">
            <th class="education-year">年</th>
            <th class="education-container-month">月</th>
            <th class="education-history">学歴・職歴</th>
          </tr>
          <!-- 初期行 -->
          <tr class="education-value">
            <td class="education-year-value"></td>
            <td class="education-container-month-value"></td>
            <td class="education-history-value"></td>
          </tr>
          <!-- 追加行 -->
          <tbody id="preview-education-body"></tbody>
        </table>
      </div>

      <!-- (6) 免許・資格 -->
      <div class="block">
        <table class="skill-table">
          <tr class="skill-info">
            <th class="skill-year">年</th>
            <th class="skill-container-month">月</th>
            <th class="skill-history">免許・資格</th>
          </tr>
          <!-- 初期行1つ分 -->
          <tr class="skill-value">
            <td class="skill-year-value"></td>
            <td class="skill-container-month-value"></td>
            <td class="skill-history-value"></td>
          </tr>
          <!-- 追加行 -->
          <tbody id="preview-skill-body"></tbody>
        </table>
      </div>

      <!-- (7) 志望動機 -->
      <div class="block">
        <table class="motivation-table">
          <tr>
            <th class="motivation-label">
              志望動機など
            </th>
          </tr>
          <tr>
            <td class="motivation-value">
              <span id="preview-motivation"></span>
            </td>
          </tr>
        </table>
      </div>

      <!-- (8) 自己PR -->
      <div class="block">
        <table class="pr-table">
          <tr>
            <th class="pr-label">
              自己PRなど
            </th>
          </tr>
          <tr>
            <td class="pr-value">
              <span id="preview-pr"></span>
            </td>
          </tr>
        </table>
      </div>

      <!-- (9) 本人希望 -->
      <div class="block">
        <table class="request-table">
          <tr>
            <th class="request-label">
              本人希望（給与・職種・勤務時間・勤務地 等）
            </th>
          </tr>
          <tr>
            <td class="request-value">
              <span id="preview-request"></span>
            </td>
          </tr>
        </table>
      </div>

    </div>
  </div>
`;

const pagesContainer = document.getElementById("resume-pages");

/** 1) 最初に1ページ目を作る */
function createNewPageDOM() {
  const pageEl = document.createElement("div");
  pageEl.classList.add("resume-page");
  pageEl.innerHTML = resumeTemplate;
  pagesContainer.appendChild(pageEl);
  return pageEl;
}
// 1ページ目を生成
let currentPage = createNewPageDOM();

/** 2) 本日の令和◯年を表示 */
function setTodayDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const reiwa = y - 2018;
  document.getElementById("preview-today-date").textContent =
    `令和 ${reiwa} 年 ${m} 月 ${d} 日現在`;
}
setTodayDate();

/** 3) フォーム入力→プレビュー同期 */
function bindTextSync(inputSel, previewSel) {
  const inputEl = document.querySelector(inputSel);
  const prevEl = document.querySelector(previewSel);
  if (!inputEl || !prevEl) return;

  function sync() {
    prevEl.textContent = inputEl.value;
    splitPagesIfOverflow();
  }
  inputEl.addEventListener("input", sync);
  // 初期反映
  sync();
}

// 名前・ふりがな、住所・TELなど
bindTextSync("#input-name", "#preview-name");
bindTextSync("#input-furigana", "#preview-furigana");
bindTextSync("#input-postal-code", "#preview-postal-code");
bindTextSync("#input-address-furigana", "#preview-address-furigana");
bindTextSync("#input-address", "#preview-address");
bindTextSync("#input-phone", "#preview-phone");
bindTextSync("#input-email", "#preview-email");
bindTextSync("#input-alt-postal-code", "#preview-alt-postal-code");
bindTextSync("#input-alt-address-furigana", "#preview-alt-address-furigana");
bindTextSync("#input-alt-address", "#preview-alt-address");
bindTextSync("#input-alt-phone", "#preview-alt-phone");
bindTextSync("#input-alt-email", "#preview-alt-email");
bindTextSync("#input-motivation", "#preview-motivation");
bindTextSync("#input-pr", "#preview-pr");
bindTextSync("#input-request", "#preview-request");

// 生年月日（年・月・日）
const birthYear = document.getElementById("birth-year");
const birthMonth = document.getElementById("birth-month");
const birthDay = document.getElementById("birth-day");
const prevBirthYear = document.getElementById("preview-birth-year");
const prevBirthMonth = document.getElementById("preview-birth-month");
const prevBirthDay = document.getElementById("preview-birth-day");
function syncBirth() {
  prevBirthYear.textContent = birthYear.value;
  prevBirthMonth.textContent = birthMonth.value;
  prevBirthDay.textContent = birthDay.value;
  splitPagesIfOverflow();
}
[birthYear, birthMonth, birthDay].forEach(el =>
  el.addEventListener("input", syncBirth)
);

// 年齢
bindTextSync("#age", "#preview-age");
// 性別
bindTextSync("#gender", "#preview-gender");

// 写真
const photoInput = document.getElementById("input-photo");
const previewPhoto = document.getElementById("preview-photo-img");
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) {
    previewPhoto.src = "";
    splitPagesIfOverflow();
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    previewPhoto.src = e.target.result;
    splitPagesIfOverflow();
  };
  reader.readAsDataURL(file);
});

// 生年月日選択肢生成
const yearNow = new Date().getFullYear();
function populateYears(select) {
  for (let y = 1900; y <= yearNow; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    select.appendChild(opt);
  }
}
function populateMonths(select) {
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    select.appendChild(opt);
  }
}
populateYears(birthYear);
populateMonths(birthMonth);
for (let i = 1; i <= 31; i++) {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = i;
  birthDay.appendChild(opt);
}
const ageSelect = document.getElementById("age");
for (let i = 0; i <= 100; i++) {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = i;
  ageSelect.appendChild(opt);
}

/** 4) 学歴・職歴, 免許・資格：追加/削除 & 同期 */
// 学歴・職歴
const eduContainer = document.getElementById("education-container");
const eduPreviewBody = document.getElementById("preview-education-body");
const defEduYear = eduContainer.querySelector(".edu-year");
const defEduMonth = eduContainer.querySelector(".edu-month");
const defEduWork = eduContainer.querySelector(".edu-work");
const defTdYear = document.querySelector(".education-year-value");
const defTdMonth = document.querySelector(".education-container-month-value");
const defTdWork = document.querySelector(".education-history-value");

function syncDefEdu() {
  defTdYear.textContent = defEduYear.value;
  defTdMonth.textContent = defEduMonth.value;
  defTdWork.textContent = defEduWork.value;
  splitPagesIfOverflow();
}
[defEduYear, defEduMonth, defEduWork].forEach(el =>
  el.addEventListener("input", syncDefEdu)
);

function populateYearsAndMonths() {
  // 年
  for (let y = 1900; y <= yearNow; y++) {
    const opt = document.createElement("option");
    opt.value = y.toString();
    opt.textContent = y.toString();
    defEduYear.appendChild(opt);
  }
  // 月
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement("option");
    opt.value = i.toString();
    opt.textContent = i.toString();
    defEduMonth.appendChild(opt);
  }
}
populateYearsAndMonths();

document.getElementById("add-education-row").addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "row-container";
  row.innerHTML = `
    <div class="form-inline">
      <select class="edu-year"><option value="">--</option></select>
      <select class="edu-month"><option value="">--</option></select>
      <input type="text" class="edu-work" placeholder="例：〇〇大学 入学" />
    </div>
  `;
  eduContainer.appendChild(row);

  const newY = row.querySelector(".edu-year");
  const newM = row.querySelector(".edu-month");
  const newW = row.querySelector(".edu-work");
  // populate
  for (let y = 1900; y <= yearNow; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    newY.appendChild(opt);
  }
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    newM.appendChild(opt);
  }

  // 右カラム用に<tr>を追加
  const tr = document.createElement("tr");
  tr.className = "education-value";
  const td1 = document.createElement("td");
  td1.className = "education-year-value";
  const td2 = document.createElement("td");
  td2.className = "education-container-month-value";
  const td3 = document.createElement("td");
  td3.className = "education-history-value";
  tr.append(td1, td2, td3);
  eduPreviewBody.appendChild(tr);

  function sync() {
    td1.textContent = newY.value;
    td2.textContent = newM.value;
    td3.textContent = newW.value;
    splitPagesIfOverflow();
  }
  [newY, newM, newW].forEach(el => el.addEventListener("input", sync));
  // 初回
  sync();
});

document
  .getElementById("remove-education-last")
  .addEventListener("click", () => {
    const rows = eduContainer.querySelectorAll(".row-container");
    if (rows.length > 1) {
      eduContainer.removeChild(rows[rows.length - 1]);
      const allTrs = eduPreviewBody.querySelectorAll("tr");
      if (allTrs.length > 1) {
        eduPreviewBody.removeChild(allTrs[allTrs.length - 1]);
      }
      splitPagesIfOverflow();
    }
  });

// 免許・資格
const skillContainer = document.getElementById("skill-container");
const skillPreviewBody = document.getElementById("preview-skill-body");
const defLicenseYear = skillContainer.querySelector(".license-year");
const defLicenseMonth = skillContainer.querySelector(".license-month");
const defSkillHistory = skillContainer.querySelector(".skill-history");
const defTdYearLicense = document.querySelector(".skill-year-value");
const defTdMonthLicense = document.querySelector(".skill-container-month-value");
const defTdHistLicense = document.querySelector(".skill-history-value");

function syncDefSkill() {
  defTdYearLicense.textContent = defLicenseYear.value;
  defTdMonthLicense.textContent = defLicenseMonth.value;
  defTdHistLicense.textContent = defSkillHistory.value;
  splitPagesIfOverflow();
}
[defLicenseYear, defLicenseMonth, defSkillHistory].forEach(el =>
  el.addEventListener("input", syncDefSkill)
);

// populate for initial row
function populateLicenseYearsAndMonths() {
  for (let y = 1900; y <= yearNow; y++) {
    const opt = document.createElement("option");
    opt.value = y.toString();
    opt.textContent = y.toString();
    defLicenseYear.appendChild(opt);
  }
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement("option");
    opt.value = i.toString();
    opt.textContent = i.toString();
    defLicenseMonth.appendChild(opt);
  }
}
populateLicenseYearsAndMonths();

document.getElementById("add-skill-row").addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "row-container";
  row.innerHTML = `
    <div class="form-inline">
      <select class="license-year"><option value="">--</option></select>
      <select class="license-month"><option value="">--</option></select>
      <input type="text" class="skill-history" placeholder="例：普通自動車運転免許" />
    </div>
  `;
  skillContainer.appendChild(row);

  const newLy = row.querySelector(".license-year");
  const newLm = row.querySelector(".license-month");
  const newSh = row.querySelector(".skill-history");
  // populate
  for (let y = 1900; y <= yearNow; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    newLy.appendChild(opt);
  }
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    newLm.appendChild(opt);
  }

  const tr = document.createElement("tr");
  tr.className = "skill-value";
  const tdY = document.createElement("td");
  tdY.className = "skill-year-value";
  const tdM = document.createElement("td");
  tdM.className = "skill-container-month-value";
  const tdH = document.createElement("td");
  tdH.className = "skill-history-value";
  tr.append(tdY, tdM, tdH);
  skillPreviewBody.appendChild(tr);

  function sync() {
    tdY.textContent = newLy.value;
    tdM.textContent = newLm.value;
    tdH.textContent = newSh.value;
    splitPagesIfOverflow();
  }
  [newLy, newLm, newSh].forEach(el => el.addEventListener("input", sync));
  sync();
});

document.getElementById("remove-skill-last").addEventListener("click", () => {
  const rows = skillContainer.querySelectorAll(".row-container");
  if (rows.length > 1) {
    skillContainer.removeChild(rows[rows.length - 1]);
    const allTrs = skillPreviewBody.querySelectorAll("tr");
    if (allTrs.length > 1) {
      skillPreviewBody.removeChild(allTrs[allTrs.length - 1]);
    }
    splitPagesIfOverflow();
  }
});

/**********************************************************
 * ページが溢れたら末尾の「.block」を次ページへ移す
 **********************************************************/
function splitPagesIfOverflow() {
  // いま右カラムに並んでいる全ページを取得
  let pages = pagesContainer.querySelectorAll(".resume-page");

  // ページを上から順にチェック
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const content = page.querySelector(".resume-content");
    if (!content) continue;

    // もしオーバーフローしていれば、末尾の .block を次ページへ
    while (checkOverflow(page, content)) {
      // 次のページがなければ新しく作る
      let nextPage = pages[i + 1];
      if (!nextPage) {
        nextPage = createBlankPage();
        // ページ配列を再取得（createBlankPage後にDOMが増えるので）
        pages = pagesContainer.querySelectorAll(".resume-page");
      }
      const nextContent = nextPage.querySelector(".resume-content");

      // 末尾の .block を取り出して次ページの先頭に挿入
      const blocks = content.querySelectorAll(".block");
      if (!blocks.length) break; // ブロックがないなら抜ける
      const lastBlock = blocks[blocks.length - 1];
      nextContent.insertBefore(lastBlock, nextContent.firstChild);
    }
  }
}

function createBlankPage() {
  const pageEl = document.createElement("div");
  pageEl.classList.add("resume-page");
  pageEl.innerHTML = `
    <div class="resume-preview">
      <div class="resume-content"></div>
    </div>`;
  pagesContainer.appendChild(pageEl);
  return pageEl;
}

function checkOverflow(pageEl, contentEl) {
  return contentEl.scrollHeight > pageEl.clientHeight;
}

/**********************************************************
 * PDF保存ボタン → [ページ分割→GAS送信→html2canvas/jsPDF]
 **********************************************************/
document.getElementById("pdf-save-btn").addEventListener("click", async () => {
  // 1) まずページ分割を確定させる
  splitPagesIfOverflow();

  // 2) GASへ送信するデータ例
  const sendData = {
    // 必要な項目を追加
    createdDate: new Date().toLocaleString(),
    name: document.getElementById("input-name").value,
    phone: document.getElementById("input-phone").value,
    email: document.getElementById("input-email").value,
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value,
    address: document.getElementById("input-address").value
    // 他にも必要があれば追加
  };

  // 3) GASに送信
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(sendData),
    });
    const resultText = await response.text();
    console.log("GAS送信結果:", resultText);
    alert("GAS送信が完了しました: " + resultText);
  } catch (e) {
    console.error("GAS送信エラー:", e);
    alert("GAS送信中にエラーが発生しました");
  }

  // 4) 右カラムの複数ページ(.resume-page)を1ページずつCanvas化してPDFに貼り付け
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("portrait", "pt", "a4");
  const pageElems = document.querySelectorAll(".resume-page");

  for (let i = 0; i < pageElems.length; i++) {
    if (i > 0) pdf.addPage(); // 2ページ目以降は addPage()

    const canvas = await html2canvas(pageElems[i], { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;
    const scale = pdfWidth / imgWidthPx;
    const imgHeightInPdf = imgHeightPx * scale;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeightInPdf);
  }

  pdf.save("履歴書.pdf");
});

/**********************************************************
 * 「一括生成する」ボタン
 **********************************************************/
document.getElementById("bulk-generate-btn").addEventListener("click", () => {
  const file = document.getElementById("resume-file").files[0];
  const additional = document.getElementById("additional-info").value;
  alert(
    "『一括生成する』が押されました。ファイル=" +
      file +
      ", 情報=" +
      additional
  );
});