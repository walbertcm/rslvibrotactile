
let data = [];

// Definição das dimensões e classes
const dimensions = {
  "Data Types": [
    { name: "Q", class: "tag-datatype" },
    { name: "O", class: "tag-datatype" },
    { name: "N", class: "tag-datatype" }
  ],
  "Data Dimensions": [
    { name: "1", class: "tag-datadimension" },
    { name: "2", class: "tag-datadimension" },
    { name: "3", class: "tag-datadimension" }
  ],
  "Number of Elements": [
    { name: "2", class: "tag-elements" },
    { name: "3", class: "tag-elements" },
    { name: "4", class: "tag-elements" },
    { name: "5", class: "tag-elements" },
    { name: "6", class: "tag-elements" },
    { name: "7", class: "tag-elements" },
    { name: "8", class: "tag-elements" },
    { name: "8+", class: "tag-elements" }
  ],
  "Vibrotactile Parameters": [
    { name: "F", class: "tag-parameters" },
    { name: "D", class: "tag-parameters" },
    { name: "R", class: "tag-parameters" },
    { name: "A", class: "tag-parameters" },
    { name: "F.O", class: "tag-parameters" },
    { name: "L.C.", class: "tag-parameters" }
  ],
  "Analysis Tasks": [
    { name: "I", class: "tag-tasks" },
    { name: "O", class: "tag-tasks" },
    { name: "C", class: "tag-tasks" },
    { name: "L.M.M.", class: "tag-tasks" }
  ],
  "Spatial Location": [
    { name: "Head", class: "tag-location" },
    { name: "Upper Limbs", class: "tag-location" },
    { name: "Trunk", class: "tag-location" },
    { name: "Lower Limbs", class: "tag-location" },
    { name: "Multiples Parts", class: "tag-location" }
  ],
  "User Evaluation": [
    { name: "Quant. Eval.", class: "tag-evaluation" },
    { name: "Quali. Eval.", class: "tag-evaluation" }
  ]
};

const dimensionClasses = {
  "Data Types": "datatype-group",
  "Data Dimensions": "datadimension-group",
  "Number of Elements": "elements-group",
  "Vibrotactile Parameters": "parameters-group",
  "Analysis Tasks": "tasks-group",
  "Spatial Location": "location-group",
  "User Evaluation": "evaluation-group"
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
    group.className = `dimension-group ${dimensionClasses[dimension] || ''}`;
    group.innerHTML = `<h3>${dimension}</h3>`;
    fields.forEach(field => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${field.name}"> ${field.name}`;
      group.appendChild(label);
    });
    sidebar.appendChild(group);
  }
}

function renderResults() {
  //const searchTitle = document.getElementById('searchTitle').value.toLowerCase();
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
  let tags = [];

  for (const fields of Object.values(dimensions)) {
    fields.forEach(field => {
      if (item[field.name] === 1) {
        tags.push(`<span class="tag ${field.class}">${field.name}</span>`);
      }
    });
  }

  return tags.join(' ');
}

document.addEventListener('input', renderResults);
