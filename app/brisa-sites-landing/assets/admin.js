/* ═══════════════════════════════════════════════════════════════
   BRISA SITES ADMIN — Dashboard Logic
   ═══════════════════════════════════════════════════════════════ */

/*
 * AUTH CREDENTIALS
 * ────────────────
 * To change the admin credentials, update these two constants.
 * This is client-side only — for production, replace with a
 * server-side auth solution (Flask-Login, session tokens, etc.).
 */
const AUTH_USERNAME = 'admin';
const AUTH_PASSWORD = 'admin';

// ─── DOM REFS ────────────────────────────────
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// ─── AUTH ────────────────────────────────────
function isAuthenticated() {
  return sessionStorage.getItem('brisa-admin-auth') === 'true';
}

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
}

function showLogin() {
  loginScreen.hidden = false;
  dashboard.hidden = true;
}

function handleLogin(e) {
  e.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    sessionStorage.setItem('brisa-admin-auth', 'true');
    loginError.hidden = true;
    showDashboard();
    initDashboard();
  } else {
    loginError.hidden = false;
  }
}

function handleLogout() {
  sessionStorage.removeItem('brisa-admin-auth');
  showLogin();
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// Check auth on load
if (isAuthenticated()) {
  showDashboard();
  initDashboard();
} else {
  showLogin();
}

// ─── COLLAPSIBLE SECTIONS ───────────────────
document.querySelectorAll('.collapse-toggle').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var target = document.getElementById(btn.getAttribute('data-target'));
    if (target) {
      target.classList.toggle('open');
    }
  });
});

// ─── INIT DASHBOARD ─────────────────────────
function initDashboard() {
  initTodos();
  initClients();
}

// ═══════════════════════════════════════════════
// 7. TO-DO LIST
// ═══════════════════════════════════════════════

var DEFAULT_TODOS = [
  { id: 1, text: 'Reorganizar carpetas en /Users/josed/Projects/brisa-sites/ según estructura propuesta. Mover HTMLs sueltos a 05-marketing/ o 00-strategy/.', done: false },
  { id: 2, text: 'Crear landing /co como variante regional. No traducir — reposicionar.', done: false },
  { id: 3, text: 'Mensaje a 1-3 pilotos USA con programa de referidos formal (1 mes gratis por cliente cerrado y que dure 60 días).', done: false },
  { id: 4, text: 'Lista de 100 prospects USA en Hialeah/Little Havana/Hollywood: nombre, vertical, sitio actual, WhatsApp, IG.', done: false },
  { id: 5, text: 'Lista de contactos potenciales en Colombia: nombre, ciudad, vertical, relación, plan probable.', done: false },
  { id: 6, text: 'Abrir cuenta Wompi sandbox y probar flujo de suscripción recurrente.', done: false },
  { id: 7, text: 'Agendar apertura de cuenta empresarial Bancolombia (bottleneck más lento del proceso CO).', done: false }
];

function getTodos() {
  var stored = localStorage.getItem('brisa-todos');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_TODOS.slice();
    }
  }
  return DEFAULT_TODOS.slice();
}

function saveTodos(todos) {
  localStorage.setItem('brisa-todos', JSON.stringify(todos));
}

function renderTodos() {
  var todos = getTodos();
  var list = document.getElementById('todo-list');
  var counter = document.getElementById('todo-counter');
  var doneCount = todos.filter(function(t) { return t.done; }).length;

  counter.textContent = doneCount + ' de ' + todos.length + ' completados';

  list.innerHTML = '';
  todos.forEach(function(todo) {
    var li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', function() {
      toggleTodo(todo.id);
    });

    var span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);
  });
}

function toggleTodo(id) {
  var todos = getTodos();
  todos = todos.map(function(t) {
    if (t.id === id) {
      t.done = !t.done;
    }
    return t;
  });
  saveTodos(todos);
  renderTodos();
}

function initTodos() {
  renderTodos();
}

// ═══════════════════════════════════════════════
// 8. CLIENT TABLE
// ═══════════════════════════════════════════════

var EMPTY_CLIENT = {
  nombre: '',
  region: 'USA',
  vertical: '',
  plan: 'Sitio',
  estado: 'Lead',
  mrr: '',
  notas: ''
};

var REGIONS = ['USA', 'CO'];
var PLANS = ['Sitio', 'Sweet Spot'];
var ESTADOS = ['Lead', 'Demo', 'Propuesta', 'Cliente activo', 'Churn'];

function getClients() {
  var stored = localStorage.getItem('brisa-clients');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return getDefaultClients();
    }
  }
  return getDefaultClients();
}

function getDefaultClients() {
  return [
    Object.assign({}, EMPTY_CLIENT, { id: Date.now() }),
    Object.assign({}, EMPTY_CLIENT, { id: Date.now() + 1 })
  ];
}

function saveClients(clients) {
  localStorage.setItem('brisa-clients', JSON.stringify(clients));
}

function renderClients() {
  var clients = getClients();
  var tbody = document.getElementById('client-tbody');
  tbody.innerHTML = '';

  clients.forEach(function(client, idx) {
    var tr = document.createElement('tr');

    // Nombre (editable)
    var tdNombre = document.createElement('td');
    tdNombre.contentEditable = 'true';
    tdNombre.textContent = client.nombre;
    tdNombre.addEventListener('blur', function() {
      updateClientField(idx, 'nombre', tdNombre.textContent.trim());
    });
    tr.appendChild(tdNombre);

    // Region (dropdown)
    var tdRegion = document.createElement('td');
    var selRegion = createSelect(REGIONS, client.region, function(val) {
      updateClientField(idx, 'region', val);
    });
    tdRegion.appendChild(selRegion);
    tr.appendChild(tdRegion);

    // Vertical (editable)
    var tdVertical = document.createElement('td');
    tdVertical.contentEditable = 'true';
    tdVertical.textContent = client.vertical;
    tdVertical.addEventListener('blur', function() {
      updateClientField(idx, 'vertical', tdVertical.textContent.trim());
    });
    tr.appendChild(tdVertical);

    // Plan (dropdown)
    var tdPlan = document.createElement('td');
    var selPlan = createSelect(PLANS, client.plan, function(val) {
      updateClientField(idx, 'plan', val);
    });
    tdPlan.appendChild(selPlan);
    tr.appendChild(tdPlan);

    // Estado (dropdown)
    var tdEstado = document.createElement('td');
    var selEstado = createSelect(ESTADOS, client.estado, function(val) {
      updateClientField(idx, 'estado', val);
    });
    tdEstado.appendChild(selEstado);
    tr.appendChild(tdEstado);

    // MRR (editable)
    var tdMRR = document.createElement('td');
    tdMRR.contentEditable = 'true';
    tdMRR.textContent = client.mrr;
    tdMRR.addEventListener('blur', function() {
      updateClientField(idx, 'mrr', tdMRR.textContent.trim());
    });
    tr.appendChild(tdMRR);

    // Notas (editable)
    var tdNotas = document.createElement('td');
    tdNotas.contentEditable = 'true';
    tdNotas.textContent = client.notas;
    tdNotas.addEventListener('blur', function() {
      updateClientField(idx, 'notas', tdNotas.textContent.trim());
    });
    tr.appendChild(tdNotas);

    // Delete button
    var tdDel = document.createElement('td');
    var btnDel = document.createElement('button');
    btnDel.className = 'btn-delete-row';
    btnDel.textContent = 'Eliminar';
    btnDel.addEventListener('click', function() {
      deleteClient(idx);
    });
    tdDel.appendChild(btnDel);
    tr.appendChild(tdDel);

    tbody.appendChild(tr);
  });

  updateTotalMRR(clients);
}

function createSelect(options, selected, onChange) {
  var sel = document.createElement('select');
  options.forEach(function(opt) {
    var o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    if (opt === selected) o.selected = true;
    sel.appendChild(o);
  });
  sel.addEventListener('change', function() {
    onChange(sel.value);
  });
  return sel;
}

function updateClientField(idx, field, value) {
  var clients = getClients();
  if (clients[idx]) {
    clients[idx][field] = value;
    saveClients(clients);
    if (field === 'mrr') {
      updateTotalMRR(clients);
    }
  }
}

function addClient() {
  var clients = getClients();
  clients.push(Object.assign({}, EMPTY_CLIENT, { id: Date.now() }));
  saveClients(clients);
  renderClients();
}

function deleteClient(idx) {
  if (!confirm('¿Eliminar esta fila?')) return;
  var clients = getClients();
  clients.splice(idx, 1);
  saveClients(clients);
  renderClients();
}

function updateTotalMRR(clients) {
  var total = 0;
  clients.forEach(function(c) {
    var val = parseFloat(String(c.mrr).replace(/[^0-9.]/g, ''));
    if (!isNaN(val)) total += val;
  });
  document.getElementById('total-mrr').textContent = '$' + total.toFixed(0);
}

function initClients() {
  renderClients();
  document.getElementById('add-client-btn').addEventListener('click', addClient);
}

// ═══════════════════════════════════════════════
// CALCULATOR
// ═══════════════════════════════════════════════

var PRICING = {
  usa: { sitioSetup: 99, sitioMonth: 29, sweetSetup: 199, sweetMonth: 59 },
  co:  { sitioSetup: 75, sitioMonth: 15, sweetSetup: 150, sweetMonth: 25 }
};

function calcRender() {
  var nSitio = parseInt(document.getElementById('calc-sitio').value) || 0;
  var nSweet = parseInt(document.getElementById('calc-sweet').value) || 0;
  var region = document.getElementById('calc-region').value;
  var fixed = parseFloat(document.getElementById('calc-fixed').value) || 0;

  var p;
  if (region === 'mix') {
    p = {
      sitioMonth: (PRICING.usa.sitioMonth + PRICING.co.sitioMonth) / 2,
      sweetMonth: (PRICING.usa.sweetMonth + PRICING.co.sweetMonth) / 2,
      sitioSetup: (PRICING.usa.sitioSetup + PRICING.co.sitioSetup) / 2,
      sweetSetup: (PRICING.usa.sweetSetup + PRICING.co.sweetSetup) / 2
    };
  } else {
    p = PRICING[region];
  }

  var mrr = nSitio * p.sitioMonth + nSweet * p.sweetMonth;
  var arr = mrr * 12;
  var profit = mrr - fixed;
  var setups = nSitio * p.sitioSetup + nSweet * p.sweetSetup;

  document.getElementById('calc-mrr').textContent = '$' + mrr.toLocaleString('en-US');
  document.getElementById('calc-arr').textContent = '$' + arr.toLocaleString('en-US');
  var profitEl = document.getElementById('calc-profit');
  profitEl.textContent = '$' + profit.toLocaleString('en-US');
  profitEl.style.color = profit >= 0 ? '#7eb87e' : '#d68080';
  document.getElementById('calc-setups').textContent = '$' + setups.toLocaleString('en-US');
  document.getElementById('calc-summary').textContent =
    'Con ' + (nSitio + nSweet) + ' clientes activos (' + nSitio + ' Sitio + ' + nSweet + ' Sweet Spot) generas $' +
    mrr.toLocaleString('en-US') + ' USD/mes de MRR recurrente. Después de costos fijos ($' +
    fixed.toLocaleString('en-US') + '), tu profit mensual es $' + profit.toLocaleString('en-US') + ' USD.';
}

document.querySelectorAll('#calc-sitio, #calc-sweet, #calc-region, #calc-fixed').forEach(function(el) {
  el.addEventListener('input', calcRender);
  el.addEventListener('change', calcRender);
});

calcRender();
