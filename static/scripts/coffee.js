// Função principal que executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  
  // =============================================
  // SCROLL SUAVE PARA LINKS INTERNOS
  // =============================================
  function initSmoothScroll() {
    document.querySelectorAll('nav a, .btn-banner').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // =============================================
  // MODAL DE DETALHES DO CARDÁPIO
  // =============================================
  function initModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalItems = document.querySelectorAll('.modal-item');
    const closeModal = document.querySelector('.close-modal');

    if (modalOverlay) {
      document.querySelectorAll('.btn-detalhes').forEach(button => {
        button.addEventListener('click', function() {
          const itemId = this.getAttribute('data-item');
          
          modalItems.forEach(item => {
            item.style.display = 'none';
          });
          
          document.getElementById(itemId).style.display = 'block';
          modalOverlay.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        });
      });

      closeModal?.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      });

      modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
          modalOverlay.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }
  }

  // =============================================
  // EFEITO DE SCROLL NO HEADER
  // =============================================
  function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }

  // =============================================
  // GALERIA DE IMAGENS
  // =============================================
  function initGallery() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    // Verifica se as imagens carregaram corretamente
    document.querySelectorAll('.galeria-item img').forEach(img => {
      // Verificação inicial
      if (!img.complete || img.naturalWidth === 0) {
        img.classList.add('error');
      }
      
      // Tratamento de erro no carregamento
      img.onerror = function() {
        this.classList.add('error');
      };
      
      // Lightbox ao clicar na imagem
      img.addEventListener('click', function() {
        const imgSrc = this.src;
        const imgAlt = this.alt;
        
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <img src="${imgSrc}" alt="${imgAlt}">
            <p>${imgAlt}</p>
            <button class="close-lightbox"><i class="fas fa-times"></i></button>
          </div>
        `;
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Fechar lightbox
        document.querySelector('.close-lightbox')?.addEventListener('click', function() {
          lightbox.style.display = 'none';
          document.body.style.overflow = 'auto';
        });
      });
    });

    // Fechar lightbox ao clicar fora
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // =============================================
  // CARROSSEL DE DEPOIMENTOS
  // =============================================
  function initTestimonialsCarousel() {
    const carrossel = document.querySelector('.depoimentos-carrossel');
    if (!carrossel) return;

    const container = carrossel.querySelector('.depoimentos-container');
    const depoimentos = carrossel.querySelectorAll('.depoimento');
    const btnAnterior = carrossel.querySelector('.anterior');
    const btnProximo = carrossel.querySelector('.proximo');
    const indicadoresContainer = carrossel.querySelector('.carrossel-indicadores');
    
    let currentIndex = 0;
    let autoPlayInterval;
    const intervalo = 5000; // 5 segundos

    // Criar indicadores
    depoimentos.forEach((_, index) => {
      const indicador = document.createElement('div');
      indicador.classList.add('carrossel-indicador');
      if (index === 0) indicador.classList.add('ativo');
      indicador.addEventListener('click', () => goToDepoimento(index));
      indicadoresContainer.appendChild(indicador);
    });

    const indicadores = carrossel.querySelectorAll('.carrossel-indicador');

    // Função para navegar para um depoimento específico
    function goToDepoimento(index) {
      depoimentos[currentIndex].classList.remove('ativo');
      indicadores[currentIndex].classList.remove('ativo');
      
      currentIndex = (index + depoimentos.length) % depoimentos.length;
      
      depoimentos[currentIndex].classList.add('ativo');
      indicadores[currentIndex].classList.add('ativo');
      
      // Reiniciar autoplay
      resetAutoPlay();
    }

    // Navegação
    function nextDepoimento() {
      goToDepoimento(currentIndex + 1);
    }

    function prevDepoimento() {
      goToDepoimento(currentIndex - 1);
    }

    // Event listeners
    btnProximo.addEventListener('click', nextDepoimento);
    btnAnterior.addEventListener('click', prevDepoimento);

    // Autoplay
    function startAutoPlay() {
      autoPlayInterval = setInterval(nextDepoimento, intervalo);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    // Pausar autoplay quando o mouse estiver sobre o carrossel
    carrossel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });

    carrossel.addEventListener('mouseleave', startAutoPlay);

    // Iniciar
    startAutoPlay();

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextDepoimento();
      if (e.key === 'ArrowLeft') prevDepoimento();
    });

    // Swipe para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) nextDepoimento();
      if (touchEndX > touchStartX + 50) prevDepoimento();
    }
  }

  // =============================================
  // NEWSLETTER FORM
  // =============================================
  function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
      function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      }
      
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
          // Simulação de envio
          alert('Obrigado por assinar nossa newsletter!');
          emailInput.value = '';
        } else {
          alert('Por favor, insira um e-mail válido.');
        }
      });
    }
  }

  // =============================================
  // MENU MOBILE
  // =============================================
  function initMobileMenu() {
    const menuButton = document.querySelector('.menu-mobile-button');
    const menuMobile = document.createElement('div');
    menuMobile.className = 'menu-mobile';
    
    // Clonar a navegação principal para o mobile
    const navClone = document.querySelector('nav').cloneNode(true);
    menuMobile.appendChild(navClone);
    document.body.appendChild(menuMobile);
    
    function toggleMenuMobile() {
      menuMobile.classList.toggle('active');
      menuButton.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
    
    menuButton.addEventListener('click', toggleMenuMobile);
    
    // Fechar menu ao clicar em um link
    menuMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', toggleMenuMobile);
    });
  }

  // =============================================
  // ATUALIZAR ANO NO FOOTER
  // =============================================
  function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // =============================================
  // INICIALIZAR TODAS AS FUNÇÕES
  // =============================================
  initSmoothScroll();
  initModal();
  initHeaderScroll();
  initGallery();
  initTestimonialsCarousel();
  initNewsletter();
  initMobileMenu();
  updateFooterYear();
  
  // Reconfigurar carrossel ao redimensionar
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768 && !document.querySelector('.menu-mobile-button')) {
      initMobileMenu();
    }
  });
});