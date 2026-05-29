// public/js/app.js — full SPA logic

// ── Auth helpers ──────────────────────────────────────────────────────────────
const Auth = {
  get token()    { return localStorage.getItem('cms_token'); },
  get username() { return localStorage.getItem('cms_username'); },
  get role()     { return localStorage.getItem('cms_role'); },
  isAdmin()      { return this.role === 'admin'; },
  save(data)     {
    localStorage.setItem('cms_token',    data.token);
    localStorage.setItem('cms_username', data.username);
    localStorage.setItem('cms_role',     data.role);
  },
  clear() {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_username');
    localStorage.removeItem('cms_role');
  }
};

// ── API helpers ───────────────────────────────────────────────────────────────
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (Auth.token) opts.headers['Authorization'] = 'Bearer ' + Auth.token;
  if (body)       opts.body = JSON.stringify(body);
  const res = await fetch('/api' + path, opts);
  return res.json();
}

// ── Router ────────────────────────────────────────────────────────────────────
function getPage() {
  return new URLSearchParams(location.search).get('page') || 'home';
}

function navigate(page) {
  history.pushState({}, '', page === 'home' ? '/' : '/?page=' + page);
  render();
}

window.addEventListener('popstate', render);

// ── Nav ───────────────────────────────────────────────────────────────────────
async function renderNav() {
  const pages   = await api('GET', '/pages');
  const current = getPage();

  // Page links
  document.getElementById('nav-links').innerHTML = pages
    .filter(p => p.slug !== 'home')
    .map(p => `<a href="/?page=${p.slug}" class="${p.slug === current ? 'active' : ''}"
        onclick="event.preventDefault();navigate('${p.slug}')">${p.title}</a>`)
    .join('');

  // Auth links
  const authEl = document.getElementById('nav-auth');
  if (Auth.isAdmin()) {
    authEl.innerHTML = `
      <a style="color:yellow;font-weight:bold;"><i class="fa-solid fa-user"></i> ${Auth.username}</a>
      <a href="/?page=admin" onclick="event.preventDefault();navigate('admin')" style="color:orange;">
        <i class="fa-solid fa-gear"></i></a>
      <a href="#" onclick="logout()" style="color:red;"><i class="fa-solid fa-right-from-bracket"></i></a>`;
  } else {
    authEl.innerHTML = `
      <a href="/?page=login" onclick="event.preventDefault();navigate('login')" style="color:yellow;">
        <i class="fa-solid fa-lock"></i> Login</a>`;
  }
}

// ── Pages ─────────────────────────────────────────────────────────────────────
async function renderArticlePage(slug) {
  const app = document.getElementById('app');
  app.innerHTML = '<p class="text-muted">Loading...</p>';

  const articles = await api('GET', `/articles?page=${slug}`);

  let html = '';
  if (Auth.isAdmin()) {
    html += `<div class="my-3">
      <button class="btn btn-outline-warning" onclick="showAddArticle('${slug}')">
        <i class="fa-solid fa-file-circle-plus"></i> Add Article
      </button>
    </div>`;
  }

  if (articles.length === 0) {
    html += '<p class="text-muted">No articles yet.</p>';
  } else {
    articles.forEach(a => {
      html += `<div class="article mb-4">
        <h2>${escHtml(a.title)}</h2>
        <div class="content">${a.content}</div>`;
      if (Auth.isAdmin()) {
        html += `
        <button class="btn btn-sm btn-outline-primary me-1" onclick="showEditArticle(${a.id},'${slug}')">
          <i class="fa-solid fa-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteArticle(${a.id},'${slug}')">
          <i class="fa-solid fa-trash"></i></button>`;
      }
      html += `<p class="text-muted mt-2"><small>Posted on: ${a.created_at}</small></p>
      </div><hr>`;
    });
  }

  app.innerHTML = html;
}

// ── Login page ────────────────────────────────────────────────────────────────
function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div style="max-width:400px;margin:80px auto;background:#023188;padding:30px;border-radius:8px;color:white;">
      <h2 style="text-align:center;font-family:'Wood Block CG',sans-serif;">CMS</h2>
      <br>
      <input type="text" id="l-user" class="form-control mb-3" placeholder="Username">
      <input type="password" id="l-pass" class="form-control mb-3" placeholder="Password">
      <div style="text-align:center;">
        <button class="btn btn-outline-success" onclick="doLogin()">
          <i class="fa-solid fa-user-lock"></i> Login
        </button>
      </div>
      <p id="l-err" style="color:#ff6b6b;text-align:center;margin-top:10px;"></p>
    </div>`;
}

async function doLogin() {
  const username = document.getElementById('l-user').value;
  const password = document.getElementById('l-pass').value;
  const data = await api('POST', '/login', { username, password });
  if (data.token) {
    Auth.save(data);
    navigate('home');
  } else {
    document.getElementById('l-err').textContent = data.error || 'Login failed';
  }
}

function logout() {
  Auth.clear();
  navigate('home');
}

// ── Admin page ────────────────────────────────────────────────────────────────
async function renderAdmin() {
  if (!Auth.isAdmin()) { navigate('login'); return; }
  const pages = await api('GET', '/pages');
  let rows = pages.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtml(p.title)}</td>
      <td>
        ${p.slug === 'home'
          ? '<span style="color:gray;">Home page</span>'
          : `<button class="btn btn-sm btn-outline-warning me-1" onclick="showEditPage(${i},'${escHtml(p.title)}')">
               <i class="fa-regular fa-pen-to-square"></i></button>
             <button class="btn btn-sm btn-outline-danger" onclick="deletePage(${i})">
               <i class="fa-solid fa-trash"></i></button>`}
      </td>
    </tr>`).join('');

  document.getElementById('app').innerHTML = `
    <h1 style="text-align:center;font-family:'Wood Block CG',sans-serif;">Manage Pages</h1>
    <br>
    <button class="btn btn-outline-success mb-3" onclick="showAddPage()">
      <i class="fa-solid fa-file-circle-plus"></i> Add New Page
    </button>
    <div id="page-form"></div>
    <table><tr><th>No</th><th>Title</th><th>Action</th></tr>${rows}</table>
    <br>
    <button class="btn btn-outline-primary" onclick="navigate('home')">
      <i class="fa-solid fa-circle-arrow-left"></i> Back
    </button>`;
}

function showAddPage() {
  document.getElementById('page-form').innerHTML = `
    <div class="mb-3 d-flex gap-2">
      <input type="text" id="new-page-title" class="form-control" placeholder="Page title">
      <button class="btn btn-outline-primary" onclick="addPage()">
        <i class="fa-solid fa-plus"></i> Add
      </button>
    </div>
    <p id="page-msg"></p>`;
}

async function addPage() {
  const title = document.getElementById('new-page-title').value.trim();
  const data  = await api('POST', '/pages', { title });
  if (data.slug) { renderAdmin(); renderNav(); }
  else document.getElementById('page-msg').textContent = data.error || 'Failed';
}

function showEditPage(index, currentTitle) {
  document.getElementById('page-form').innerHTML = `
    <div class="mb-3 d-flex gap-2">
      <input type="text" id="edit-page-title" class="form-control" value="${escHtml(currentTitle)}">
      <button class="btn btn-outline-primary" onclick="editPage(${index})">
        <i class="fa-solid fa-save"></i> Save
      </button>
    </div>`;
}

async function editPage(index) {
  const title = document.getElementById('edit-page-title').value.trim();
  await api('PUT', '/pages', { index, title });
  renderAdmin(); renderNav();
}

async function deletePage(index) {
  if (!confirm('Delete this page?')) return;
  await api('DELETE', '/pages', { index });
  renderAdmin(); renderNav();
}

// ── Article forms ─────────────────────────────────────────────────────────────
function showAddArticle(slug) {
  document.getElementById('app').innerHTML = `
    <div class="mt-4">
      <h3 style="font-family:'Wood Block CG',sans-serif;">
        Greeting <span style="color:blue;"><i class="fa-solid fa-user"></i> ${Auth.username} 👋</span>
      </h3>
      <h3>Create Article</h3>
      <input type="text" id="art-title" class="form-control mb-3" placeholder="Article title">
      <textarea id="art-body"></textarea>
      <br>
      <button class="btn btn-outline-primary mt-2" onclick="submitArticle('${slug}')">
        <i class="fa-solid fa-upload"></i> Publish
      </button>
      <button class="btn btn-outline-secondary mt-2 ms-2" onclick="navigate('${slug}')">Cancel</button>
    </div>`;
  initTiny('#art-body');
}

async function showEditArticle(id, slug) {
  const articles = await api('GET', `/articles?page=${slug}`);
  const a = articles.find(x => x.id === id);
  if (!a) return;

  document.getElementById('app').innerHTML = `
    <div class="mt-4">
      <h4>Edit Article</h4>
      <input type="text" id="art-title" class="form-control mb-3" value="${escHtml(a.title)}">
      <textarea id="art-body">${a.content}</textarea>
      <br>
      <button class="btn btn-outline-primary mt-2" onclick="updateArticle(${id},'${slug}')">
        <i class="fa-solid fa-save"></i> Save
      </button>
      <button class="btn btn-outline-secondary mt-2 ms-2" onclick="navigate('${slug}')">Cancel</button>
    </div>`;
  initTiny('#art-body');
}

async function submitArticle(slug) {
  const title   = document.getElementById('art-title').value;
  const content = tinymce.get('art-body')?.getContent() || '';
  await api('POST', '/articles', { title, content, page_slug: slug });
  navigate(slug);
}

async function updateArticle(id, slug) {
  const title   = document.getElementById('art-title').value;
  const content = tinymce.get('art-body')?.getContent() || '';
  await api('PUT', '/articles', { id, title, content });
  navigate(slug);
}

async function deleteArticle(id, slug) {
  if (!confirm('Delete this article?')) return;
  await api('DELETE', '/articles', { id });
  navigate(slug);
}

// ── TinyMCE init ──────────────────────────────────────────────────────────────
function initTiny(selector) {
  tinymce.init({
    selector,
    height: 400,
    plugins: 'image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image code',
    menubar: 'insert',
    relative_urls: false,
    remove_script_host: false,
    images_upload_url: '/api/upload',
    images_upload_handler: async (blobInfo, progress) => {
      const form = new FormData();
      form.append('file', blobInfo.blob(), blobInfo.filename());
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + Auth.token },
        body: form
      });
      const data = await res.json();
      if (!data.location) throw new Error('Upload failed');
      return data.location;
    }
  });
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Main render ───────────────────────────────────────────────────────────────
async function render() {
  await renderNav();
  const page = getPage();
  if (page === 'login') { renderLogin(); return; }
  if (page === 'admin') { renderAdmin(); return; }
  renderArticlePage(page);
}

render();
