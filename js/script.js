/**
 * TrackParcel - Script principal
 * Simulação de rastreamento + interações Bootstrap
 * Projeto acadêmico - Atividade 2 - Estado da Arte
 */

document.addEventListener('DOMContentLoaded', function () {
  // ---------- Navbar scroll effect ----------
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---------- Tracking Form ----------
  const trackingForm = document.getElementById('trackingForm');
  const trackingCodeInput = document.getElementById('trackingCode');
  const btnTrack = document.getElementById('btnTrack');

  if (trackingForm) {
    trackingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const code = trackingCodeInput.value.trim();

      // Validação: campo vazio
      if (!code) {
        trackingCodeInput.classList.add('is-invalid');
        showToast('Por favor, informe um código de rastreamento.', 'warning');
        return;
      }

      trackingCodeInput.classList.remove('is-invalid');
      trackingCodeInput.classList.add('is-valid');

      // Feedback visual no botão
      const originalBtnHtml = btnTrack.innerHTML;
      btnTrack.disabled = true;
      btnTrack.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Rastreando...';

      // Simula delay de busca (sem backend)
      setTimeout(function () {
        btnTrack.disabled = false;
        btnTrack.innerHTML = originalBtnHtml;
        trackingCodeInput.classList.remove('is-valid');

        // Dados fictícios para demonstração
        const mockData = generateMockTracking(code);

        // Atualiza e abre o Modal
        updateTrackingModal(mockData);
        showToast('Rastreamento iniciado! Status encontrado.', 'success');

        const modal = new bootstrap.Modal(document.getElementById('trackingModal'));
        modal.show();
      }, 1200);
    });
  }

  // Limpa validação ao digitar
  if (trackingCodeInput) {
    trackingCodeInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'is-valid');
    });
  }

  // ---------- Smooth scroll para âncoras (fallback) ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/**
 * Gera dados fictícios de rastreamento com base no código informado.
 * Apenas para demonstração acadêmica — sem backend.
 */
function generateMockTracking(code) {
  // Normaliza o código (uppercase)
  const displayCode = code.toUpperCase();

  // Variação simples baseada no comprimento do código para parecer dinâmico
  const progressOptions = [45, 55, 65, 75, 85];
  const progress = progressOptions[displayCode.length % progressOptions.length];

  const statusMap = {
    45: { label: 'Processado', badge: 'bg-info-subtle text-info-emphasis', icon: 'bi-box' },
    55: { label: 'Em trânsito', badge: 'bg-warning-subtle text-warning-emphasis', icon: 'bi-truck' },
    65: { label: 'Em trânsito', badge: 'bg-warning-subtle text-warning-emphasis', icon: 'bi-truck' },
    75: { label: 'Em distribuição', badge: 'bg-primary-subtle text-primary-emphasis', icon: 'bi-building' },
    85: { label: 'Saiu para entrega', badge: 'bg-success-subtle text-success-emphasis', icon: 'bi-bicycle' }
  };

  const status = statusMap[progress] || statusMap[65];

  return {
    code: displayCode,
    status: status.label,
    statusBadge: status.badge,
    statusIcon: status.icon,
    progress: progress,
    location: 'São Paulo - SP',
    nextStep: progress >= 75 ? 'Em rota de entrega' : 'Centro de distribuição',
    eta: '28/09/2026'
  };
}

/**
 * Atualiza o conteúdo do Modal de resultado do rastreamento.
 */
function updateTrackingModal(data) {
  document.getElementById('modalCode').textContent = data.code;

  const statusEl = document.getElementById('modalStatus');
  statusEl.className = 'badge ' + data.statusBadge;
  statusEl.innerHTML = '<i class="bi ' + data.statusIcon + ' me-1"></i>' + data.status;

  document.getElementById('modalProgressText').textContent = data.progress + '%';

  const progressBar = document.getElementById('modalProgressBar');
  progressBar.style.width = data.progress + '%';
  progressBar.setAttribute('aria-valuenow', data.progress);

  document.getElementById('modalLocation').textContent = data.location;
  document.getElementById('modalNext').textContent = data.nextStep;
  document.getElementById('modalEta').textContent = data.eta;
}

/**
 * Exibe o Toast Bootstrap com mensagem personalizada.
 * @param {string} message - Texto a ser exibido
 * @param {string} type - 'success' | 'warning' | 'info' (afeta a cor)
 */
function showToast(message, type) {
  const toastEl = document.getElementById('trackingToast');
  const toastMessage = document.getElementById('toastMessage');

  if (!toastEl || !toastMessage) return;

  toastMessage.textContent = message;

  // Ajusta a cor do toast conforme o tipo
  toastEl.classList.remove('text-bg-primary', 'text-bg-warning', 'text-bg-success', 'text-bg-danger');
  if (type === 'warning') {
    toastEl.classList.add('text-bg-warning');
  } else if (type === 'success') {
    toastEl.classList.add('text-bg-success');
  } else {
    toastEl.classList.add('text-bg-primary');
  }

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
  toast.show();
}

/**
 * Função auxiliar chamada pelo botão "Ver detalhes" do card de demonstração no Hero.
 * Abre o modal com dados de exemplo.
 */
function showDemoTracking() {
  const demoData = {
    code: 'TRK20260925',
    status: 'Em trânsito',
    statusBadge: 'bg-warning-subtle text-warning-emphasis',
    statusIcon: 'bi-truck',
    progress: 65,
    location: 'São Paulo - SP',
    nextStep: 'Centro de distribuição',
    eta: '28/09/2026'
  };

  updateTrackingModal(demoData);
  showToast('Status da encomenda atualizado.', 'info');
}
