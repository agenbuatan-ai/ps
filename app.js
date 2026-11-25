(function () {
  'use strict';
  console.log('[Dashboard] app.js loaded');

  const CONFIG = { API_URL: 'https://script.google.com/macros/s/AKfycbwW-XWkSdPhFp94qks9GvZxATAUaxdMVEDBeujyWeJRxN2Ew9bFswLo1xy0oGpNfEXb/exec', USE_API: false };

  /* ---------- MASTER DATA: SPESIALIS & DOKTER ---------- */
  const DOKTER_LIST = [
    { nama: 'dr. Badju Adji, Sp.B Onk',           spesialis: 'Bedah Umum' },
    { nama: 'dr. Tiko, Sp.B',                     spesialis: 'Bedah Umum' },
    { nama: 'dr. Andri, Sp.B',                    spesialis: 'Bedah Umum' },
    { nama: 'dr. Yusak, Sp.BD',                   spesialis: 'Bedah Umum' },
    { nama: 'dr. Christopher Rico Andrian, Sp.B', spesialis: 'Bedah Umum' },
    { nama: 'dr. Rico, Sp.BA(K)',                 spesialis: 'Bedah Anak' },
    { nama: 'dr. Puri, Sp.BP',                    spesialis: 'Bedah Plastik' },
    { nama: 'dr. Ditta, Sp.BP',                   spesialis: 'Bedah Plastik' },
    { nama: 'dr. Jeslyn, Sp.BP',                  spesialis: 'Bedah Plastik' },
    { nama: 'dr. Nurul Akbar, Sp.U',              spesialis: 'Urologi' },
    { nama: 'dr. Rinto, Sp.U',                    spesialis: 'Urologi' },
    { nama: 'dr. Aroyan, Sp.THT.KL',              spesialis: 'THT' },
    { nama: 'dr. Irma, Sp.THT.KL',                spesialis: 'THT' },
    { nama: 'dr. Rita, Sp.P',                     spesialis: 'Paru' },
    { nama: 'dr. Eric Hermansyah, Sp.P',          spesialis: 'Paru' },
    { nama: 'dr. Nesia Priandari, Sp.P',          spesialis: 'Paru' },
    { nama: 'dr. Nidya Sandi Bahana, Sp.P',       spesialis: 'Paru' },
    { nama: 'dr. Khadijah, Sp.KK',                spesialis: 'Kulit' },
    { nama: 'dr. Roger, Sp.KK',                   spesialis: 'Kulit' },
    { nama: 'drg. Ghina Humaira, Sp.BM',          spesialis: 'Bedah Mulut' },
    { nama: 'dr. Raden Hari, Sp.An',              spesialis: 'Anestesi' },
    { nama: 'dr. Eva, Sp.An',                     spesialis: 'Anestesi' },
    { nama: 'dr. Louis, Sp.An',                   spesialis: 'Anestesi' },
    { nama: 'dr. Jamalul Adil, Sp.An.TI',         spesialis: 'Anestesi' },
    { nama: 'dr. Robert Hotasi, Sp.An',           spesialis: 'Anestesi' },
    { nama: 'dr. Girhanif Amri Yunda, Sp.An',     spesialis: 'Anestesi' },
    { nama: 'dr. Elba, Sp.OG',                    spesialis: 'Kebidanan / Obgyn' },
    { nama: 'dr. Nunki, Sp.OG',                   spesialis: 'Kebidanan / Obgyn' },
    { nama: 'dr. Seindy, Sp.OG',                  spesialis: 'Kebidanan / Obgyn' },
    { nama: 'dr. Bram, Sp.OG',                    spesialis: 'Kebidanan / Obgyn' },
    { nama: 'dr. Kusnawara, Sp.OG',               spesialis: 'Kebidanan / Obgyn' },
    { nama: 'dr. Santi Anugrah, Sp.M',            spesialis: 'Mata' },
    { nama: 'dr. Nur Hasan, Sp.BS',               spesialis: 'Bedah Syaraf' },
    { nama: 'dr. Harris, Sp.BS',                  spesialis: 'Bedah Syaraf' },
    { nama: 'dr. Heka, Sp.OT',                    spesialis: 'Orto' },
    { nama: 'dr. Hendar, Sp.OT',                  spesialis: 'Orto' },
    { nama: 'dr. Putu Mira, Sp.OT',               spesialis: 'Orto' },
    { nama: 'dr. Juniarto, Sp.OT',                spesialis: 'Orto' }
  ];

  // Daftar spesialis unik
  const SPESIALIS_LIST = [...new Set(DOKTER_LIST.map((d) => d.spesialis))];

  /* ---------- SEED DATA (15 pasien) ---------- */
  const SEED = [
    { nama: 'Tn. Ahmad Payapo', umur: '75', mr: '01468418', kategori: 'Bedah Umum', ruang: '15.0', diagnosa: 'Ulkus Cruris (D)', tindakan: 'Debridement', dokter: 'dr. Tiko, Sp.B', lab: 'Hb 11.2, Leu 10.5', ket: 'GDS 210' },
    { nama: 'Ma. Femi', umur: '26', mr: '00460404', kategori: 'Bedah Umum', ruang: '—', diagnosa: 'Limfadenopati Colli Bilateral', tindakan: 'Eksisi Biopsi', dokter: 'dr. Andri, Sp.B', lab: 'Hb 12.8, Leu 7.2', ket: '—' },
    { nama: 'Tn. Jamsi…', umur: '50', mr: '00539839', kategori: 'Bedah Umum', ruang: '—', diagnosa: 'Hernia Inguinalis (S)', tindakan: 'Hernioplasty', dokter: 'dr. Christopher Rico Andrian, Sp.B', lab: 'Hb 14.1, Leu 6.8', ket: 'Puasa 8 jam' },
    { nama: 'Tn. Siprianus', umur: '52', mr: '00237402', kategori: 'Bedah Umum', ruang: '6.C', diagnosa: 'Ileus Obstruksi', tindakan: 'Laparotomi', dokter: 'dr. Yusak, Sp.BD', lab: 'Hb 10.5, Leu 13.2', ket: 'NGT terpasang' },
    { nama: 'Tn. Rasiman', umur: '60', mr: '00575652', kategori: 'Bedah Umum', ruang: '5.C', diagnosa: 'Hernia Inguinalis Lateral (S)', tindakan: 'Hernioplasty', dokter: 'dr. Christopher Rico Andrian, Sp.B', lab: 'Hb 13.0, Leu 7.9', ket: '—' },
    { nama: 'Ny. Zehrani', umur: '75', mr: '00628278', kategori: 'Bedah Umum', ruang: '2.D PP', diagnosa: 'Gangren DM Pedis (S)', tindakan: 'Amputasi Below Knee', dokter: 'dr. Tiko, Sp.B', lab: 'Hb 9.8, Leu 15.1', ket: 'GDS 380, rawat ICU' },
    { nama: 'An. Keenan', umur: '2', mr: '00796112', kategori: 'Bedah Anak', ruang: '12.D', diagnosa: 'Abses Thorax', tindakan: 'Drainase', dokter: 'dr. Rico, Sp.BA(K)', lab: 'Hb 11.0, Leu 18.3', ket: 'Febris 38.5°C' },
    { nama: 'Tn. Adi Tersia', umur: '43', mr: '01463478', kategori: 'Urologi', ruang: '7.A', diagnosa: 'Batu Ureter Distal Kanan', tindakan: 'URS, Laser Tripsi', dokter: 'dr. Rinto, Sp.U', lab: 'Urin: eritrosit +', ket: 'CT scan konfirmasi' },
    { nama: 'Tn. Alamsyah', umur: '19', mr: '01449229', kategori: 'THT', ruang: '—', diagnosa: 'Tonsilitis Kronik', tindakan: 'Tonsilektomi', dokter: 'dr. Aroyan, Sp.THT.KL', lab: 'Hb 14.5, Leu 9.1', ket: '—' },
    { nama: 'Ny. Isnuti', umur: '32', mr: '00581858', kategori: 'Kebidanan / Obgyn', ruang: '5.C', diagnosa: 'G3 P2 A0 40 mg, TBJ 4,1 Kg', tindakan: 'SC, IUD', dokter: 'dr. Nunki, Sp.OG', lab: 'Hb 11.5, PLT 230', ket: 'SC emergensi' },
    { nama: 'Ny. Melindah', umur: '30', mr: '00441700', kategori: 'Kebidanan / Obgyn', ruang: 'Apus', diagnosa: 'G3 P1 A1 H38 BSC 1x, TBJ 2,4 Kg', tindakan: 'SC, Implant', dokter: 'dr. Nunki, Sp.OG', lab: 'Hb 10.8, PLT 210', ket: '—' },
    { nama: 'Ny. Hanica', umur: '26', mr: '01448531', kategori: 'Kebidanan / Obgyn', ruang: '—', diagnosa: 'G2 P1 A0 H38 BSC 1x, TBJ 2.900', tindakan: 'SC, IUD', dokter: 'dr. Nunki, Sp.OG', lab: 'Hb 12.0, PLT 245', ket: '—' },
    { nama: 'Ny. Linda', umur: '35', mr: '00525114', kategori: 'Kebidanan / Obgyn', ruang: '—', diagnosa: 'G2 P1 A0 H37-38, TBJ 3.100', tindakan: 'SC', dokter: 'dr. Nunki, Sp.OG', lab: 'Hb 11.2, PLT 220', ket: '—' },
    { nama: 'Ny. I Bakhtul', umur: '35', mr: '01468559', kategori: 'Kebidanan / Obgyn', ruang: '—', diagnosa: 'G2 P1 A0 H38 mg, PM KSC 2, TBJ 2.970', tindakan: 'SC', dokter: 'dr. Nunki, Sp.OG', lab: 'Hb 10.5, PLT 205', ket: 'Riwayat SC 2x' },
    { nama: 'Ny. Amanda', umur: '21', mr: '00624442', kategori: 'Kebidanan / Obgyn', ruang: 'VK / RB Intan', diagnosa: 'G1 P0 A0 17-16 mg, PEB Fetal Distress', tindakan: 'SC, IUD', dokter: 'dr. Nunki, Sp.OG', lab: 'Protein urin +2, PLT 180', ket: 'PEB, fetal distress' }
  ];

  /* ---------- STATE ---------- */
  let pasienList = [];
  let editingId = null;
  let deletingId = null;

  const el = (id) => document.getElementById(id);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const uid = () => 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  /* ---------- UTILS ---------- */
  function normalize(p) {
    return {
      id: p.id || uid(),
      nama: p.nama || '',
      umur: String(p.umur != null ? p.umur : ''),
      mr: p.mr || '',
      kategori: p.kategori || 'Bedah Umum',
      ruang: p.ruang || '—',
      diagnosa: p.diagnosa || '',
      tindakan: p.tindakan || '',
      dokter: p.dokter || '',
      lab: p.lab || '',
      ket: p.ket || '',
      status: p.status || 'wait'
    };
  }

  function showToast(msg, isError) {
    const t = el('toast'); if (!t) return;
    t.textContent = msg;
    t.style.color = isError ? 'var(--danger)' : 'var(--tosca-deep)';
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function initials(nama) {
    const clean = String(nama || '?').replace(/^(Tn\.|Ny\.|An\.|Ma\.)\s*/i, '');
    const w = clean.split(/\s+/).filter(Boolean);
    return w.length ? (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase() : '?';
  }

  const katClass = (k) => (k === 'Bedah Umum' || k === 'Urologi') ? 'tosca' : 'purple';
  const avatarClass = (i) => 'a' + ((i % 6) + 1);

  /* ---------- STORAGE ---------- */
  const Storage = {
    async list() {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL + '?action=list');
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal memuat');
        return j.data.map(normalize);
      }
      try {
        const raw = localStorage.getItem('pasien_list');
        if (!raw) {
          const seeded = SEED.map((p, i) => normalize({ id: 'seed-' + i, ...p, status: 'wait' }));
          localStorage.setItem('pasien_list', JSON.stringify(seeded));
          return seeded;
        }
        return JSON.parse(raw).map(normalize);
      } catch (e) {
        return SEED.map((p, i) => normalize({ id: 'seed-' + i, ...p, status: 'wait' }));
      }
    },
    async add(data) {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify({ action: 'add', data }) });
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal menambah');
        return normalize(j.data);
      }
      const item = normalize({ id: uid(), ...data, status: data.status || 'wait' });
      try {
        const list = JSON.parse(localStorage.getItem('pasien_list') || '[]');
        list.push(item);
        localStorage.setItem('pasien_list', JSON.stringify(list));
      } catch (e) {}
      return item;
    },
    async update(id, data) {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify({ action: 'update', id, data }) });
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal update');
        return normalize(j.data);
      }
      try {
        const list = JSON.parse(localStorage.getItem('pasien_list') || '[]');
        const idx = list.findIndex((p) => p.id === id);
        if (idx !== -1) { list[idx] = { ...list[idx], ...data }; localStorage.setItem('pasien_list', JSON.stringify(list)); }
      } catch (e) {}
      return { id, ...data };
    },
    async remove(id) {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal hapus');
        return j.data;
      }
      try {
        let list = JSON.parse(localStorage.getItem('pasien_list') || '[]');
        list = list.filter((p) => p.id !== id);
        localStorage.setItem('pasien_list', JSON.stringify(list));
      } catch (e) {}
      return { id };
    }
  };

  /* ---------- POPULATE SELECT KATEGORI ---------- */
  function populateKategoriSelects() {
    const selects = [el('ifKategori'), el('fKategori')];
    selects.forEach((sel) => {
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = SPESIALIS_LIST
        .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
        .join('');
      // Kembalikan nilai bila sebelumnya ada
      if (current && SPESIALIS_LIST.includes(current)) sel.value = current;
    });
  }

  /* ---------- AUTOCOMPLETE DOKTER ---------- */
  /**
   * Pasang autocomplete pada input + suggestion box.
   * @param {HTMLInputElement} inputEl
   * @param {HTMLElement} boxEl
   * @param {HTMLSelectElement} kategoriEl
   */
  function attachDokterAutocomplete(inputEl, boxEl, kategoriEl) {
    if (!inputEl || !boxEl) return;

    let activeIndex = -1;
    let currentList = [];

    function renderSuggestions(query) {
      const q = (query || '').toLowerCase().trim();
      const kat = kategoriEl ? kategoriEl.value : '';

      // Filter: cocok dengan query + (bila kategori dipilih) cocok spesialis
      currentList = DOKTER_LIST.filter((d) => {
        const matchKat = !kat || d.spesialis === kat;
        const matchQ = !q || d.nama.toLowerCase().includes(q);
        return matchKat && matchQ;
      });

      if (!currentList.length) {
        boxEl.innerHTML = `<div class="suggestion-empty">Tidak ada dokter yang cocok</div>`;
        boxEl.classList.add('show');
        activeIndex = -1;
        return;
      }

      boxEl.innerHTML = currentList.map((d, i) => `
        <div class="suggestion-item" data-index="${i}" data-nama="${escapeHtml(d.nama)}">
          <span>${escapeHtml(d.nama)}</span>
          <span class="spec">${escapeHtml(d.spesialis)}</span>
        </div>
      `).join('');
      boxEl.classList.add('show');
      activeIndex = -1;

      boxEl.querySelectorAll('.suggestion-item').forEach((it) => {
        it.addEventListener('mousedown', (e) => {
          e.preventDefault(); // cegah blur
          inputEl.value = it.dataset.nama;
          boxEl.classList.remove('show');
          inputEl.focus();
        });
      });
    }

    function highlight(dir) {
      const items = boxEl.querySelectorAll('.suggestion-item');
      if (!items.length) return;
      activeIndex = (activeIndex + dir + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    inputEl.addEventListener('input', () => renderSuggestions(inputEl.value));
    inputEl.addEventListener('focus', () => renderSuggestions(inputEl.value));

    inputEl.addEventListener('keydown', (e) => {
      if (!boxEl.classList.contains('show')) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(-1); }
      else if (e.key === 'Enter') {
        if (activeIndex >= 0 && currentList[activeIndex]) {
          e.preventDefault();
          inputEl.value = currentList[activeIndex].nama;
          boxEl.classList.remove('show');
        }
      } else if (e.key === 'Escape') {
        boxEl.classList.remove('show');
      }
    });

    inputEl.addEventListener('blur', () => {
      // Delay agar mousedown sempat dieksekusi
      setTimeout(() => boxEl.classList.remove('show'), 150);
    });

    // Bila kategori berubah → refresh suggestion saat input fokus
    if (kategoriEl) {
      kategoriEl.addEventListener('change', () => {
        if (document.activeElement === inputEl) renderSuggestions(inputEl.value);
      });
    }
  }

  /* ---------- RENDER TABEL ---------- */
  function renderTable() {
    const tbody = el('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    pasienList.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.dataset.id = p.id;
      tr.dataset.kat = p.kategori;
      tr.dataset.status = p.status;
      tr.dataset.search = [p.nama, p.mr, p.diagnosa, p.dokter, p.kategori, p.lab, p.ket]
        .join(' ').toLowerCase();

      if (p.status === 'done') tr.classList.add('is-checked');

      tr.innerHTML = `
        <td><input type="checkbox" class="check row-check" ${p.status === 'done' ? 'checked' : ''}></td>
        <td class="col-no">${i + 1}</td>
        <td>
          <div class="pasien">
            <div class="avatar-sm ${avatarClass(i)}">${initials(p.nama)}</div>
            <div>
              <div class="nama-pasien">${escapeHtml(p.nama || '—')}</div>
              <div class="rm">MR ${escapeHtml(p.mr || '—')}</div>
            </div>
          </div>
        </td>
        <td class="col-umur">${escapeHtml(p.umur || '—')} th</td>
        <td><span class="badge-kat ${katClass(p.kategori)}">${escapeHtml(p.kategori)}</span></td>
        <td class="col-ruang">${escapeHtml(p.ruang)}</td>
        <td>
          <div class="cell-diagnosa">${escapeHtml(p.diagnosa || '—')}</div>
          <div class="cell-tindakan">${escapeHtml(p.tindakan || '—')}</div>
        </td>
        <td class="col-dokter">${escapeHtml(p.dokter || '—')}</td>
        <td class="col-lab">${escapeHtml(p.lab || '—')}</td>
        <td class="col-ket">${escapeHtml(p.ket || '—')}</td>
        <td>
          <span class="badge wait status-wait">Menunggu</span>
          <span class="badge done status-done">Sudah Dicek</span>
        </td>
        <td>
          <div class="action-group">
            <button class="btn-icon edit" title="Edit" data-action="edit" data-id="${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button class="btn-icon delete" title="Hapus" data-action="delete" data-id="${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        </td>
      `;

      const cb = tr.querySelector('.row-check');
      cb.addEventListener('change', async () => {
        const newStatus = cb.checked ? 'done' : 'wait';
        tr.classList.toggle('is-checked', cb.checked);
        try {
          await Storage.update(p.id, { status: newStatus });
          p.status = newStatus;
        } catch (err) {
          cb.checked = !cb.checked;
          tr.classList.toggle('is-checked', cb.checked);
          showToast('Gagal ubah status: ' + err.message, true);
        }
        updateProgress();
        applyFilters();
      });

      tr.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (btn.dataset.action === 'edit') openPatientModal(btn.dataset.id);
          else if (btn.dataset.action === 'delete') openDeleteModal(btn.dataset.id);
        });
      });

      tbody.appendChild(tr);
    });

    updateProgress();
    applyFilters();
  }

  /* ---------- STATS ---------- */
  function updateProgress() {
    const total = pasienList.length;
    const done = pasienList.filter((p) => p.status === 'done').length;
    const wait = total - done;

    el('statTotal').textContent = total;
    el('statDone').textContent = done;
    el('statWait').textContent = wait;
    el('subtitleCount').textContent = total;
    el('progressFill').style.width = total ? (done / total * 100) + '%' : '0%';
    el('progressText').textContent = `${done} dari ${total} pasien sudah dicek`;

    const ca = el('checkAll');
    ca.checked = total > 0 && done === total;
    ca.indeterminate = done > 0 && done < total;
  }

  /* ---------- FILTER ---------- */
  function applyFilters() {
    const q = el('searchInput').value.toLowerCase().trim();
    const kat = el('filterKat').value;
    const status = el('filterStatus').value;

    $$('#tableBody tr').forEach((tr) => {
      const matchQ = !q || (tr.dataset.search || '').includes(q);
      const matchKat = kat === 'all' || tr.dataset.kat === kat;
      const matchSt = status === 'all'
        || (status === 'done' && tr.classList.contains('is-checked'))
        || (status === 'wait' && !tr.classList.contains('is-checked'));
      tr.classList.toggle('filtered-out', !(matchQ && matchKat && matchSt));
    });
  }

  /* ---------- MODAL EDIT ---------- */
  function openPatientModal(id) {
    editingId = id || null;
    const title = el('patientModalTitle');
    const btn = el('btnSavePatient');

    if (editingId) {
      const p = pasienList.find((x) => x.id === editingId);
      if (!p) return;
      title.textContent = 'Edit Data Pasien';
      btn.textContent = 'Simpan Perubahan';
      el('fNama').value = p.nama;
      el('fUmur').value = p.umur;
      el('fMR').value = p.mr;
      el('fKategori').value = p.kategori;
      el('fRuang').value = p.ruang === '—' ? '' : p.ruang;
      el('fDokter').value = p.dokter;
      el('fDiagnosa').value = p.diagnosa;
      el('fTindakan').value = p.tindakan;
      el('fLab').value = p.lab;
      el('fKet').value = p.ket;
    } else {
      title.textContent = 'Tambah Pasien Baru';
      btn.textContent = 'Simpan Pasien';
      el('patientForm').reset();
      el('fKategori').value = 'Bedah Umum';
    }

    el('patientModal').classList.add('show');
    setTimeout(() => el('fNama').focus(), 100);
  }

  function closePatientModal() {
    el('patientModal').classList.remove('show');
    editingId = null;
  }

  function openDeleteModal(id) {
    const p = pasienList.find((x) => x.id === id);
    if (!p) return;
    deletingId = id;
    el('deleteName').textContent = p.nama;
    el('deleteModal').classList.add('show');
  }

  function closeDeleteModal() {
    el('deleteModal').classList.remove('show');
    deletingId = null;
  }

  /* ---------- PRINT PREVIEW ---------- */
  function openPrintPreview() {
    const tbody = el('printTableBody');
    tbody.innerHTML = '';

    const visibleRows = $$('#tableBody tr:not(.filtered-out)');
    const visibleIds = visibleRows.map((tr) => tr.dataset.id);
    const visible = pasienList.filter((p) => visibleIds.includes(p.id));

    visible.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(p.nama || '—')}</td>
        <td>${escapeHtml(p.umur || '—')} th</td>
        <td>${escapeHtml(p.mr || '—')}</td>
        <td>${escapeHtml(p.ruang || '—')}</td>
        <td>${escapeHtml(p.diagnosa || '—')}</td>
        <td>${escapeHtml(p.tindakan || '—')}</td>
        <td>${escapeHtml(p.dokter || '—')}</td>
        <td>${escapeHtml(p.lab || '—')}</td>
        <td>${escapeHtml(p.ket || '—')}</td>
      `;
      tbody.appendChild(tr);
    });

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    el('printDate').textContent = today;
    el('printDate2').textContent = today;
    el('printTotal').textContent = visible.length;

    el('printModal').classList.add('show');
  }

  /* ---------- NAVIGASI SIDEBAR ---------- */
  function showView(view) {
    el('viewDaftar').style.display = view === 'daftar' ? '' : 'none';
    el('viewInput').style.display = view === 'input' ? '' : 'none';
    el('navDaftar').classList.toggle('active', view === 'daftar');
    el('navInput').classList.toggle('active', view === 'input');
    el('pageTitle').textContent = view === 'input'
      ? 'Input Pasien Baru'
      : 'Daftar Pasien Operasi Hari Ini';
    if (view === 'input') {
      el('inputFullForm').reset();
      el('ifKategori').value = 'Bedah Umum';
      setTimeout(() => el('ifNama').focus(), 100);
    }
  }

  function initSidebarToggle() {
    const toggle = el('menuToggle');
    if (!toggle) return;
    try {
      if (localStorage.getItem('sidebarHidden') === '1') {
        document.body.classList.add('sidebar-hidden');
      }
    } catch (e) {}
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-hidden');
      try {
        localStorage.setItem('sidebarHidden',
          document.body.classList.contains('sidebar-hidden') ? '1' : '0');
      } catch (e) {}
    });
  }

  /* ---------- INIT ---------- */
  async function init() {
    console.log('[Dashboard] init() start');

    // 1. Populate select kategori dari SPESIALIS_LIST
    populateKategoriSelects();

    // 2. Pasang autocomplete dokter
    attachDokterAutocomplete(
      el('ifDokter'),
      el('ifDokterSuggest'),
      el('ifKategori')
    );
    attachDokterAutocomplete(
      el('fDokter'),
      el('fDokterSuggest'),
      el('fKategori')
    );

    // 3. Load data
    try {
      pasienList = await Storage.list();
      console.log('[Dashboard] loaded', pasienList.length, 'pasien');
    } catch (err) {
      console.error('[Dashboard] load error:', err);
      showToast('Gagal memuat data: ' + err.message, true);
      pasienList = [];
    }

    try { renderTable(); } catch (err) { console.error('[renderTable]', err); }
    try { initSidebarToggle(); } catch (err) { console.error('[sidebar]', err); }

    // 4. Navigasi
    el('navDaftar').addEventListener('click', (e) => { e.preventDefault(); showView('daftar'); });
    el('navInput').addEventListener('click', (e) => { e.preventDefault(); showView('input'); });
    el('btnAdd').addEventListener('click', () => showView('input'));

    // 5. Form input penuh
    el('inputFullForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nama: el('ifNama').value.trim(),
        umur: el('ifUmur').value.trim(),
        mr: el('ifMR').value.trim(),
        kategori: el('ifKategori').value,
        ruang: el('ifRuang').value.trim() || '—',
        dokter: el('ifDokter').value.trim(),
        diagnosa: el('ifDiagnosa').value.trim(),
        tindakan: el('ifTindakan').value.trim(),
        lab: el('ifLab').value.trim(),
        ket: el('ifKet').value.trim()
      };
      if (!data.nama) { showToast('Nama pasien wajib diisi', true); return; }

      try {
        data.status = 'wait';
        const created = await Storage.add(data);
        pasienList.push(created);
        showToast('Pasien baru ditambahkan');
        showView('daftar');
        renderTable();
      } catch (err) {
        showToast('Gagal menyimpan: ' + err.message, true);
      }
    });

    el('btnInputReset').addEventListener('click', () => {
      el('inputFullForm').reset();
      el('ifKategori').value = 'Bedah Umum';
      el('ifNama').focus();
    });

    // 6. Form modal edit
    el('patientForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nama: el('fNama').value.trim(),
        umur: el('fUmur').value.trim(),
        mr: el('fMR').value.trim(),
        kategori: el('fKategori').value,
        ruang: el('fRuang').value.trim() || '—',
        dokter: el('fDokter').value.trim(),
        diagnosa: el('fDiagnosa').value.trim(),
        tindakan: el('fTindakan').value.trim(),
        lab: el('fLab').value.trim(),
        ket: el('fKet').value.trim()
      };
      if (!data.nama) { showToast('Nama pasien wajib diisi', true); return; }

      try {
        if (editingId) {
          await Storage.update(editingId, data);
          const idx = pasienList.findIndex((p) => p.id === editingId);
          if (idx !== -1) pasienList[idx] = { ...pasienList[idx], ...data };
          showToast('Data pasien diperbarui');
        }
        closePatientModal();
        renderTable();
      } catch (err) {
        showToast('Gagal menyimpan: ' + err.message, true);
      }
    });

    // 7. Konfirmasi hapus
    el('btnConfirmDelete').addEventListener('click', async () => {
      if (!deletingId) return;
      const target = pasienList.find((p) => p.id === deletingId);
      try {
        await Storage.remove(deletingId);
        pasienList = pasienList.filter((p) => p.id !== deletingId);
        closeDeleteModal();
        renderTable();
        showToast(`Pasien "${target ? target.nama : ''}" dihapus`);
      } catch (err) {
        showToast('Gagal hapus: ' + err.message, true);
      }
    });

    // 8. Print
    el('btnPrintPreview').addEventListener('click', openPrintPreview);
    el('btnDoPrint').addEventListener('click', () => window.print());

    // 9. Tutup modal
    $$('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.close;
        el(t).classList.remove('show');
        if (t === 'patientModal') editingId = null;
        if (t === 'deleteModal') deletingId = null;
      });
    });
    $$('.modal-overlay').forEach((ov) => {
      ov.addEventListener('click', (e) => { if (e.target === ov) ov.classList.remove('show'); });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        $$('.modal-overlay.show').forEach((m) => m.classList.remove('show'));
        editingId = null; deletingId = null;
      }
    });

    // 10. Filter
    el('searchInput').addEventListener('input', applyFilters);
    el('filterKat').addEventListener('change', applyFilters);
    el('filterStatus').addEventListener('change', applyFilters);

    // 11. Centang semua
    el('checkAll').addEventListener('change', async (e) => {
      const newStatus = e.target.checked ? 'done' : 'wait';
      const visibleIds = $$('#tableBody tr:not(.filtered-out)').map((tr) => tr.dataset.id);
      for (const p of pasienList) {
        if (!visibleIds.includes(p.id)) continue;
        if ((p.status || 'wait') === newStatus) continue;
        try { await Storage.update(p.id, { status: newStatus }); p.status = newStatus; }
        catch (err) {}
      }
      renderTable();
    });

    console.log('[Dashboard] init() selesai');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('error', (e) => {
    console.error('[Dashboard] Runtime error:', e.error || e.message);
  });
})();
