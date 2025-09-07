let dataThaotacNgoaiTru = [];
let dataThaotacNoiTru = [];
let dataTiepthu = [];
let dataLienhe = [];
let dataChuthich = [];
let dataChuY = [];

const ID_MAP = {
  thaotacNgoaiTru: { search: "searchThaotacNgoaiTru", results: "resultsThaotacNgoaiTru" },
  thaotacNoiTru: { search: "searchThaotacNoiTru", results: "resultsThaotacNoiTru" },
  tiepthu: { search: "searchTiepthu", results: "resultsTiepthu" },
  lienhe: { search: "searchLienhe", results: "resultsLienhe" },
  chuthich: { search: "searchChuthich", results: "resultsChuthich" },
  chuY: { search: "searchChuY", results: "resultsChuY" }
};

function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, "");
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatSteps(content) {
  if (!content) return "";
  if (content.includes("->")) {
    const steps = content.split("->").map(s => capitalize(s.trim()));
    return `<ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>`;
  }
  return `<p>${capitalize(content)}</p>`;
}

async function loadData() {
  try {
    dataThaotacNgoaiTru = await (await fetch("./thao_tac_ngoai_tru.json")).json();
    dataThaotacNoiTru = await (await fetch("./thao_tac_noi_tru.json")).json();
    dataTiepthu = await (await fetch("./tiepthu.json")).json();
    dataLienhe = await (await fetch("./lienhe.json")).json();
    dataChuthich = await (await fetch("./chuthich.json")).json();
    dataChuY = await (await fetch("./chu_y.json")).json();

    console.log("Ngoại trú:", dataThaotacNgoaiTru);
    console.log("Nội trú:", dataThaotacNoiTru);

    renderSearch("thaotacNgoaiTru");
    renderSearch("thaotacNoiTru");
    renderSearch("tiepthu");
    renderSearch("lienhe");
    renderSearch("chuthich");
    renderSearch("chuY");
  } catch (err) {
    console.error("Lỗi load JSON:", err);
  }
}

function renderSearch(type) {
  const keyword = normalize(document.getElementById(ID_MAP[type].search).value || "");
  const results = document.getElementById(ID_MAP[type].results);
  results.innerHTML = "";

  let items = [];
  if (type === "thaotacNgoaiTru") items = dataThaotacNgoaiTru;
  if (type === "thaotacNoiTru") items = dataThaotacNoiTru;
  if (type === "tiepthu") items = dataTiepthu;
  if (type === "lienhe") items = dataLienhe;
  if (type === "chuthich") items = dataChuthich;
  if (type === "chuY") items = dataChuY;

  const filtered = items.filter(item => {
    const text = Array.isArray(item.label) ? item.label.join(" ") : item.label;
    return normalize(text).includes(keyword);
  });

  filtered.forEach(item => {
    const el = document.createElement("div");
    el.className = "list-group-item";

    // Hiển thị icon + label
    el.innerHTML = (item.icon || "") + " " + (Array.isArray(item.label) ? item.label.join(", ") : item.label);

    if (type.startsWith("thaotac")) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => showDetail(item));
    }

    results.appendChild(el);
  });
}

function showDetail(item) {
  document.getElementById("modalTitle").textContent =
    Array.isArray(item.label) ? item.label.join(", ") : item.label;
  let html = "";
  if (item.content) html += formatSteps(item.content);
  if (item.result) html += `<p><strong>Kết quả:</strong> ${item.result}</p>`;
  document.getElementById("modalContent").innerHTML = html || "Không có dữ liệu";

  new bootstrap.Modal(document.getElementById("detailModal")).show();
}

document.addEventListener("DOMContentLoaded", () => {
  Object.keys(ID_MAP).forEach(type => {
    document.getElementById(ID_MAP[type].search)
      .addEventListener("input", () => renderSearch(type));
  });
  loadData();
});

function formatSteps(content) {
  if (!content) return "";

  // Tách các phương án bằng ||
  const methods = content.split("||").map(s => s.trim());
  let html = "";

  methods.forEach((method, idx) => {
    const steps = method.split("->").map(s => capitalize(s.trim()));
    html += `<p><strong>Cách ${idx + 1}:</strong></p>`;
    html += `<ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>`;
  });

  return html;
}
