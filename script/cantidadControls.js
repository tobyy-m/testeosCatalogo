// Función reutilizable para controles de cantidad
function setupCantidadControls() {
  const cantidadInput = document.getElementById('cantidad');
  const btnDisminuir = document.getElementById('disminuir-cantidad');
  const btnAumentar = document.getElementById('aumentar-cantidad');
  
  if (!cantidadInput || !btnDisminuir || !btnAumentar) return;
  
  btnAumentar.addEventListener('click', () => {
    const valor = parseInt(cantidadInput.value) || 1;
    cantidadInput.value = valor + 1;
    actualizarEstadoBotones();
  });
  
  btnDisminuir.addEventListener('click', () => {
    const valor = parseInt(cantidadInput.value) || 1;
    if (valor > 1) {
      cantidadInput.value = valor - 1;
      actualizarEstadoBotones();
    }
  });
  
  // Actualizar estado del botón disminuir
  function actualizarEstadoBotones() {
    const valor = parseInt(cantidadInput.value) || 1;
    if (valor <= 1) {
      btnDisminuir.classList.add('disabled');
      btnDisminuir.style.opacity = '0.3';
    } else {
      btnDisminuir.classList.remove('disabled');
      btnDisminuir.style.opacity = '1';
    }
  }
  
  cantidadInput.addEventListener('input', actualizarEstadoBotones);
  actualizarEstadoBotones(); // Estado inicial
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupCantidadControls);
