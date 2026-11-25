/* ==========================================================
   DASHBOARD PASIEN — APP LOGIC
   Mode default: localStorage. Set CONFIG untuk pakai GAS API.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  const CONFIG = {
    // Setelah deploy Google Apps Script, isi URL di bawah ini:
    API_URL: '',
    // Ubah ke true bila sudah deploy GAS
    USE_API: false
  };

  /* ---------- SEED DATA ---------- */
  const SEED = [
    { no: 1,  nama: 'Tn. Ahmad Payapo',  umur: '75', mr: '01468418', kategori: 'Bedah Umum', ruang: '15.0', diagnosa: 'Ulkus Cruris (D)', tindakan: 'Debridement', dokter: 'dr. Tiko, Sp.B' },
    { no: 2,  nama: 'Ma. Femi',          umur: '26', mr: '00460404', kategori: 'Bedah Umum', ruang: '—',    diagnosa: 'Limfadenopati Colli Bilateral', tindakan: 'Eksisi Biopsi', dokter: 'dr. Andri, Sp.B' },
    { no: 3,  nama: 'Tn. Jamsi…',        umur: '50', mr: '00539839', kategori: 'Bedah Umum', ruang: '—',    diagnosa: 'Hernia Inguinalis (S)', tindakan: 'Hernioplasty', dokter: 'dr. Christopher, Sp.B' },
    { no: 4,  nama: 'Tn. Siprianus',     umur: '52', mr: '00237402', kategori: 'Bedah Umum', ruang: '6.C',  diagnosa: 'Ileus Obstruksi', tindakan: 'Laparotomi', dokter: 'dr. Yusak, Sp.BD' },
    { no: 5,  nama: 'Tn. Rasiman',       umur: '60', mr: '00575652', kategori: 'Bedah Umum', ruang: '5.C',  diagnosa: 'Hernia Inguinalis Lateral (S)', tindakan: 'Hernioplasty', dokter: 'dr. Christopher, Sp.B' },
    { no: 6,  nama: 'Ny. Zehrani',       umur: '75', mr: '00628278', kategori: 'Bedah Umum', ruang: '2.D PP', diagnosa: 'Gangren DM Pedis (S)', tindakan: 'Amputasi Below Knee', dokter: 'dr. Tiko, Sp.B' },
    { no: 7,  nama: 'An. Keenan',        umur: '2',  mr: '00796112', kategori: 'Bedah Anak', ruang: '12.D', diagnosa: 'Abses Thorax', tindakan: 'Drainase', dokter: 'dr. Rico, Sp.BA(K)' },
    { no: 8,  nama: 'Tn. Adi Tersia',    umur: '43', mr: '01463478', kategori: 'Uro',        ruang: '7.A',  diagnosa: 'Batu Ureter Distal Kanan', tindakan: 'URS, Laser Tripsi', dokter: 'dr. Rinto, Sp.U' },
    { no: 9,  nama: 'Tn. Alamsyah',      umur: '19', mr: '01449229', kategori: 'THT',        ruang: '—',    diagnosa: 'Tonsilitis Kronik', tindakan: 'Tonsilektomi', dokter: 'dr. Aroyan, Sp.THT.KL' },
    { no: 10, nama: 'Ny. Isnuti',        umur: '32', mr: '00581858', kategori: 'dr. Nunki',  ruang: '5.C',  diagnosa: 'G3 P2 A0 40 mg, TBJ 4,1 Kg', tindakan: 'SC, IUD', dokter: 'dr. Nunki, Sp.OG' },
    { no: 11, nama: 'Ny. Melindah',      umur: '30', mr: '00441700', kategori: 'dr. Nunki',  ruang: 'Apus', diagnosa: 'G3 P1 A1 H38 BSC 1x, TBJ 2,4 Kg', tindakan: 'SC, Implant', dokter: 'dr. Nunki, Sp.OG' },
    { no: 12, nama: 'Ny. Hanica',        umur: '26', mr: '01448531', kategori: 'dr. Nunki',  ruang: '—',    diagnosa: 'G2 P1 A0 H38 BSC 1x, TBJ 2.900', tindakan: 'SC, IUD', dokter: 'dr. Nunki, Sp.OG' },
    { no: 13, nama: 'Ny. Linda',         umur: '35', mr: '00525114', kategori: 'dr. Nunki',  ruang: '—',    diagnosa: 'G2 P1 A0 H37-38, TBJ 3.100', tindakan: 'SC', dokter: 'dr. Nunki, Sp.OG' },
    { no: 14, nama: 'Ny. I Bakhtul',     umur: '35', mr: '01468559', kategori: 'dr. Nunki',  ruang: '—',    diagnosa: 'G2 P1 A0 H38 mg, PM KSC 2, TBJ 2.970', tindakan: 'SC', dokter: 'dr. Nunki, Sp.OG' },
    { no: 15, nama: 'Ny. Amanda',        umur: '21', mr: '00624442', kategori: 'dr. Nunki',  ruang: 'VK / RB Intan', diagnosa: 'G1 P0 A0 17-16 mg, PEB Fetal Distress', tindakan: 'SC, IUD', dokter: 'dr. Nunki, Sp.OG' }
  ];

  /* ---------- STATE ---------- */
  let pasienList = [];
  let editingId = null;
  let deletingId = null;

  /* ---------- UTIL ---------- */
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const el = (id) => document.getElementById(id);
  const uid = () => 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function showToast(msg, isError) {
    const t = el('toast');
    t.textContent = msg;
    t.style.color = isError ? 'var(--danger)' : 'var(--tosca-deep)';
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ---------- STORAGE LAYER (localStorage / GAS API) ---------- */
  const Storage = {
    async list() {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL + '?action=list');
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal memuat');
        return j.data;
      }
      // localStorage
      const raw = localStorage.getItem('pasien_list');
      if (!raw) {
        const seeded = SEED.map((p, i) => ({
          id: 'seed-' + i, ...p, status: 'wait'
        }));
        localStorage.setItem('pasien_list', JSON.stringify(seeded));
        return seeded;
      }
      return JSON.parse(raw);
    },

    async add(data) {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'add', data })
        });
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal menambah');
        return j.data;
      }
      const list = JSON.parse(localStorage.getItem('pasien_list') || '[]');
      const newItem = { id: uid(), ...data, status: data.status || 'wait' };
      list.push(newItem);
      localStorage.setItem('pasien_list', JSON.stringify(list));
      return newItem;
    },

    async update(id, data) {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'update', id, data })
        });
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal update');
        return j.data;
      }
      const list = JSON.parse(localStorage.getItem('pasien_list') || '[]');
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Tidak ditemukan');
      list[idx] = { ...list[idx], ...data };
      localStorage.setItem('pasien_list', JSON.stringify(list));
      return list[idx];
    },

    async remove(id) {
      if (CONFIG.USE_API && CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'delete', id })
        });
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Gagal hapus');
        return j.data;
      }
      let list = JSON.parse(localStorage.getItem('pasien_list') || '[]');
      list = list.filter((p) => p.id !== id);
      localStorage.setItem('pasien_list', JSON.stringify(list));
      return { id };
    }
  };

  /* ---------- RENDER ---------- */
  function katClass(kat) {
    return (kat === 'Bedah Umum' || kat === 'Uro') ? 'tosca' : 'purple';
  }
  function avatarClass(index) {
    return 'a' + ((index % 6) + 1);
  }
  function initials(nama) {
    // Ambil huruf awal dari kata setelah gelar (Tn./Ny./An./Ma.)
    const clean = nama.replace(/^(Tn\.|Ny\.|An\.|Ma\.)\s*/i, '');
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
  }

  function renderTable() {
    const tbody = el('tableBody');
    tbody.innerHTML = '';

    pasienList.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.dataset.id = p.id;
      tr.dataset.kat = p.kategori;
      tr.dataset.status = p.status || 'wait';

      tr.innerHTML = `
        <td><input type="checkbox" class="check row-check" ${p.status === 'done' ? 'checked' : ''}></td>
        <td class="col-no">${i + 1}</td>
        <td>
          <div class="pasien">
            <div class="avatar-sm ${avatarClass(i)}">${initials(p.nama || '?')}</div>
            <div>
              <div class="nama-pasien">${escapeHtml(p.nama || '—')}</div>
              <div class="rm">MR ${escapeHtml(p.mr || '—')}</div>
            </div>
          </div>
        </td>
        <td class="col-umur">${escapeHtml(p.umur || '—')} th</td>
        <td><span class="badge-kat ${katClass(p.kategori)}">${escapeHtml(p.kategori || '—')}</span></td>
        <td class="col-ruang">${escapeHtml(p.ruang || '—')}</td>
        <td>
          <div class="cell-diagnosa">${escapeHtml(p.diagnosa || '—')}</div>
          <div class="cell-tindakan">${escapeHtml(p.tindakan || '—')}</div>
        </td>
        <td class="col-dokter">${escapeHtml(p.dokter || '—')}</td>
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
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        </td>
      `;

      // Event checkbox toggle
      tr.querySelector('.row-check').addEventListener('change', async (e) => {
        const newStatus = e.target.checked ? 'done' : 'wait';
        try {
          await Storage.update(p.id, { status: newStatus });
          p.status = newStatus;
          updateProgress();
          applyFilters();
        } catch (err) {
          e.target.checked = !e.target.checked;
          showToast('Gagal ubah status: ' + err.message, true);
        }
      });

      // Event tombol aksi (delegasi)
      tr.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (btn.dataset.action === 'edit') openPatientModal(id);
          else if (btn.dataset.action === 'delete') openDeleteModal(id);
        });
      });

      tbody.appendChild(tr);
    });

    updateProgress();
    applyFilters();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- STATISTIK & PROGRESS ---------- */
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

    const checkAll = el('checkAll');
    checkAll.checked = total > 0 && done === total;
    checkAll.indeterminate = done > 0 && done < total;
  }

  /* ---------- FILTER ---------- */
  function applyFilters() {
    const q = el('searchInput').value.toLowerCase().trim();
    const kat = el('filterKat').value;
    const status = el('filterStatus').value;

    $$('#tableBody tr').forEach((tr) => {
      const p = pasienList.find((x) => x.id === tr.dataset.id);
      if (!p) return;
      const text = (p.nama + ' ' + p.mr + ' ' + p.diagnosa + ' ' + p.dokter + ' ' + p.kategori).toLowerCase();
      const matchQ = !q || text.includes(q);
      const matchKat = kat === 'all' || p.kategori === kat;
      const matchSt = status === 'all'
        || (status === 'done' && p.status === 'done')
        || (status === 'wait' && p.status !== 'done');

      tr.classList.toggle('filtered-out', !(matchQ && matchKat && matchSt));
    });
  }

  /* ---------- MODAL: TAMBAH / EDIT ---------- */
  function openPatientModal(id) {
    editingId = id || null;
    const modal = el('patientModal');
    const title = el('patientModalTitle');
    const btn = el('btnSavePatient');

    if (editingId) {
      const p = pasienList.find((x) => x.id === editingId);
      if (!p) return;
      title.textContent = 'Edit Data Pasien';
      btn.textContent = 'Simpan Perubahan';
      el('fNama').value = p.nama || '';
      el('fUmur').value = p.umur || '';
      el('fMR').value = p.mr || '';
      el('fKategori').value = p.kategori || 'Bedah Umum';
      el('fRuang').value = (p.ruang === '—' ? '' : p.ruang) || '';
      el('fDokter').value = p.dokter || '';
      el('fDiagnosa').value = p.diagnosa || '';
      el('fTindakan').value = p.tindakan || '';
    } else {
      title.textContent = 'Tambah Pasien Baru';
      btn.textContent = 'Simpan Pasien';
      el('patientForm').reset();
      el('fKategori').value = 'Bedah Umum';
    }

    modal.classList.add('show');
    setTimeout(() => el('fNama').focus(), 100);
  }

  function closePatientModal() {
    el('patientModal').classList.remove('show');
    editingId = null;
  }

  /* ---------- MODAL: HAPUS ---------- */
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

  /* ---------- MODAL: PRINT PREVIEW ---------- */
  function openPrintPreview() {
    const tbody = el('printTableBody');
    tbody.innerHTML = '';

    // Hanya tampilkan pasien yang lolos filter
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
        <td>${escapeHtml(p.kategori || '—')}</td>
        <td>${escapeHtml(p.ruang || '—')}</td>
        <td>${escapeHtml(p.diagnosa || '—')}</td>
        <td>${escapeHtml(p.tindakan || '—')}</td>
        <td>${escapeHtml(p.dokter || '—')}</td>
        <td>${p.status === 'done' ? 'Sudah Dicek' : 'Menunggu'}</td>
      `;
      tbody.appendChild(tr);
    });

    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    el('printDate').textContent = today;
    el('printDate2').textContent = today;
    el('printTotal').textContent = visible.length;

    el('printModal').classList.add('show');
  }
  function closePrintPreview() {
    el('printModal').classList.remove('show');
  }

  /* ---------- SIDEBAR TOGGLE ---------- */
  function initSidebarToggle() {
    const toggle = el('menuToggle');
    if (localStorage.getItem('sidebarHidden') === '1') {
      document.body.classList.add('sidebar-hidden');
    }
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-hidden');
      const hidden = document.body.classList.contains('sidebar-hidden');
      localStorage.setItem('sidebarHidden', hidden ? '1' : '0');
    });
  }

  /* ---------- INISIALISASI & EVENT BINDING ---------- */
  async function init() {
    // Load data
    try {
      pasienList = await Storage.list();
    } catch (err) {
      showToast('Gagal memuat data: ' + err.message, true);
      pasienList = [];
    }

    renderTable();
    initSidebarToggle();

    /* Tombol Tambah */
    el('btnAdd').addEventListener('click', () => openPatientModal(null));

    /* Form submit (tambah / edit) */
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
        tindakan: el('fTindakan').value.trim()
      };

      try {
        if (editingId) {
          const updated = await Storage.update(editingId, data);
          const idx = pasienList.findIndex((p) => p.id === editingId);
          if (idx !== -1) pasienList[idx] = updated;
          showToast('Data pasien berhasil diperbarui');
        } else {
          data.status = 'wait';
          data.no = pasienList.length + 1;
          const created = await Storage.add(data);
          pasienList.push(created);
          showToast('Pasien baru berhasil ditambahkan');
        }
        closePatientModal();
        renderTable();
      } catch (err) {
        showToast('Gagal menyimpan: ' + err.message, true);
      }
    });

    /* Konfirmasi hapus */
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
        showToast('Gagal menghapus: ' + err.message, true);
      }
    });

    /* Print preview */
    el('btnPrintPreview').addEventListener('click', openPrintPreview);
    el('btnDoPrint').addEventListener('click', () => window.print());

    /* Tutup modal via data-close & klik overlay */
    $$('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.close;
        el(target).classList.remove('show');
        if (target === 'patientModal') editingId = null;
        if (target === 'deleteModal') deletingId = null;
      });
    });

    $$('.modal-overlay').forEach((ov) => {
      ov.addEventListener('click', (e) => {
        if (e.target === ov) ov.classList.remove('show');
      });
    });

    /* Escape tutup modal */
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      $$('.modal-overlay.show').forEach((m) => m.classList.remove('show'));
      editingId = null;
      deletingId = null;
    });

    /* Filter & search */
    el('searchInput').addEventListener('input', applyFilters);
    el('filterKat').addEventListener('change', applyFilters);
    el('filterStatus').addEventListener('change', applyFilters);

    /* Centang semua */
    el('checkAll').addEventListener('change', async (e) => {
      const newStatus = e.target.checked ? 'done' : 'wait';
      // Update semua pasien yang terlihat
      const visibleIds = $$('#tableBody tr:not(.filtered-out)').map((tr) => tr.dataset.id);
      for (const p of pasienList) {
        if (!visibleIds.includes(p.id)) continue;
        if ((p.status || 'wait') tidak === newStatus) continue;
        try {
          await Storage.update(p.id, { status: newStatus });
          p.status = newStatus;
        } catch (err) {
          showToast('Gagal update: ' + err.message, true);
        }
      }
      renderTable();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
