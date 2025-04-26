
let data = [];

const dimensions = {
  "Data Types": ["Q", "O", "N"],
  "Data Dimensions": ["1", "2", "3"],
  "Number of Elements": ["2", "3", "4", "5", "6", "7", "8", "8+"],
  "Vibrotactile Parameters": ["F", "D", "R", "A", "F.O", "L.C."],
  "Analysis Tasks": ["I", "O", "C", "L.M.M."],
  "Spatial Location": ["Head", "Upper Limbs", "Trunk", "Lower Limbs", "Multiples Parts"],
  "User Evaluation": ["Quant. Eval.", "Quali. Eval."]
};

function loadPage(page) {
  const internalContent = document.getElementById('internal-content');
  const siteContent = document.getElementById('site-content');
  if (page === 'home') {
    internalContent.style.display = 'none';
    siteContent.style.display = 'block';
  } else {
    fetch('pages/' + page + '.html')
      .then(response => response.text())
      .then(html => {
        internalContent.innerHTML = html;
        internalContent.style.display = 'block';
        siteContent.style.display = 'none';
      });
  }
}

fetch('data/data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    populateFilters();
    renderResults();
  });

function populateFilters() {
  const years = [...new Set(data.map(item => item.Year))].filter(y => y !== "---");
  const yearSelect = document.getElementById('filterYear');
  years.sort().forEach(year => {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    yearSelect.appendChild(opt);
  });

  const sidebar = document.getElementById('sidebar');
  for (const [dimension, fields] of Object.entries(dimensions)) {
    const group = document.createElement('div');
    group.className = 'dimension-group';
    group.innerHTML = `<h3>${dimension}</h3>`;
    fields.forEach(field => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${field}"> ${field}`;
      group.appendChild(label);
    });
    sidebar.appendChild(group);
  }
}

function renderResults() {
  const searchTitle = document.getElementById('searchTitle').value.toLowerCase();
  const filterYear = document.getElementById('filterYear').value;
  const checkedFields = Array.from(document.querySelectorAll('#sidebar input:checked')).map(el => el.value);

  const filtered = data.filter(item => {
    const matchesTitle = item.titulo.toLowerCase().includes(searchTitle);
    const matchesYear = !filterYear || item.Year == filterYear;
    const matchesFields = checkedFields.every(field => item[field] === 1);
    return matchesTitle && matchesYear && matchesFields;
  });

  document.getElementById('counter').textContent = `Results found: ${filtered.length}`;

  const results = document.getElementById('results');
  results.innerHTML = '';
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${item.titulo}</h2>
      <p><strong>Reference:</strong> ${item.Reference}</p>
      <p><strong>Year:</strong> ${item.Year}</p>
      <p><strong>DOI:</strong> ${item.DOI}</p>
      <div class="tags">${generateTags(item)}</div>
    `;
    results.appendChild(card);
  });
}

function generateTags(item) {
  return Object.keys(item)
    .filter(key => !["titulo", "Reference", "Year", "DOI"].includes(key))
    .filter(key => item[key] === 1)
    .map(key => `<span class="tag">${key}</span>`)
    .join('');
}

document.addEventListener('input', renderResults);
