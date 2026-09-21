// Universal Auto-Recovery for Images & Videos (Bridges GitHub Pages root & assets/ directory)
window.addEventListener('error', function (e) {
  const target = e.target;
  if (!target || target.dataset.recovered) return;
  target.dataset.recovered = '1';

  if (target.tagName === 'IMG') {
    const src = target.getAttribute('src') || '';
    if (src.includes('assets/images/')) {
      target.src = src.replace('assets/images/', '');
    } else if (!src.includes('/') && !src.startsWith('http')) {
      target.src = 'assets/images/' + src;
    }
  } else if (target.tagName === 'SOURCE') {
    const src = target.getAttribute('src') || '';
    if (src.includes('assets/videos/')) {
      target.src = src.replace('assets/videos/', '');
      const parent = target.parentElement;
      if (parent && parent.load) parent.load();
    } else if (!src.includes('/') && !src.startsWith('http')) {
      target.src = 'assets/videos/' + src;
      const parent = target.parentElement;
      if (parent && parent.load) parent.load();
    }
  } else if (target.tagName === 'VIDEO') {
    const poster = target.getAttribute('poster') || '';
    if (poster.includes('assets/images/')) {
      target.poster = poster.replace('assets/images/', '');
    } else if (!poster.includes('/') && !poster.startsWith('http')) {
      target.poster = 'assets/images/' + poster;
    }
  }
}, true);

/**
 * ELAKIYA K S — PERSONAL PORTFOLIO & PROTOSEM JOURNAL
 * Interactive Logic: Sticky Nav, Mobile Menu, Scroll Reveals,
 * Image Lightbox Modal, Contact Form Handler, & Template Clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // 3. Highlight Active Navigation Item
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-link');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });

  // 4. Scroll Reveal Animations with IntersectionObserver
  const revealElements = document.querySelectorAll(
    '.glass-card, .week-card, .project-card, .skill-category-card, .timeline-item, .cert-card, .stat-card'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }

  // 5. Lightbox Modal for Project & ProtoSem Images
  const clickableImages = document.querySelectorAll('.project-image-box img, .week-images img, .about-photo img');
  
  // Create Lightbox DOM if not already in document
  let lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox && clickableImages.length > 0) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
        <img src="" alt="Full Preview">
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Preview';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    clickableImages.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 6. Interactive Toast Notification Utility
  window.showToast = function(message, duration = 4000) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <div>${message}</div>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // 7. Contact Form Simulation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('senderName');
      const name = nameInput ? nameInput.value.trim() : 'there';
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      
      if (submitBtn) {
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
        contactForm.reset();
        window.showToast(`Thank you, ${name}! Your message has been sent successfully.`);
      }, 900);
    });
  }

  // 8. One-Click Copy for ProtoSem HTML Template
  const copyTemplateBtn = document.getElementById('copyTemplateBtn');
  if (copyTemplateBtn) {
    copyTemplateBtn.addEventListener('click', () => {
      const templateCode = `<!-- ================================= -->
<!-- WEEK TEMPLATE START -->
<!-- ================================= -->

<div class="week-card">

    <div class="week-header">
        <h2>Week X</h2>
        <span>Month Year</span>
    </div>

    <h3>Title of the Week</h3>

    <p>
        Description goes here...
    </p>

    <h4>Topics Learned</h4>

    <ul>
        <li>Topic 1</li>
        <li>Topic 2</li>
        <li>Topic 3</li>
    </ul>

    <h4>Key Takeaways</h4>

    <ul>
        <li>Takeaway 1</li>
        <li>Takeaway 2</li>
        <li>Takeaway 3</li>
    </ul>

    <h4>Reflection</h4>

    <p class="reflection-text">
        Reflection goes here...
    </p>

    <div class="week-images">
        <img src="assets/images/your-photo.jpg" alt="Week activities">
    </div>

</div>

<!-- ================================= -->
<!-- WEEK TEMPLATE END -->
<!-- ================================= -->`;

      navigator.clipboard.writeText(templateCode).then(() => {
        window.showToast('Week Template copied to clipboard! Paste it into protosem.html');
      }).catch(() => {
        window.showToast('Could not copy automatically. Please copy the code manually below.');
      });
    });
  }

  // 9. ProtoSem Box-Type Weekly Accordion & Navigation
  const weekBoxes = document.querySelectorAll('.week-box-card');

  weekBoxes.forEach((box) => {
    const header = box.querySelector('.week-box-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = box.classList.contains('open');

        // Toggle current box
        if (isOpen) {
          box.classList.remove('open');
        } else {
          box.classList.add('open');
          // Smooth scroll to keep header comfortably visible
          setTimeout(() => {
            const rect = box.getBoundingClientRect();
            if (rect.top < 90 || rect.top > window.innerHeight * 0.7) {
              box.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        }
      });
    }

    // Close button inside week card
    const closeBtn = box.querySelector('.btn-close-week');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        box.classList.remove('open');
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  // Jump Pills logic
  const jumpPills = document.querySelectorAll('.jump-pill');
  jumpPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-target');
      if (!targetId) return;

      jumpPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetBox = document.getElementById(targetId);
      if (targetBox) {
        targetBox.classList.add('open');
        targetBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Expand All / Collapse All controls
  const expandAllBtn = document.getElementById('expandAllWeeks');
  const collapseAllBtn = document.getElementById('collapseAllWeeks');

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      weekBoxes.forEach(b => b.classList.add('open'));
      window.showToast('All week entries expanded!');
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      weekBoxes.forEach(b => b.classList.remove('open'));
      window.showToast('All week entries collapsed.');
    });
  }

  // Handle URL hash on load (e.g. #week-0 or #week-2)
  if (window.location.hash) {
    const hashEl = document.querySelector(window.location.hash);
    if (hashEl && hashEl.classList.contains('week-box-card')) {
      hashEl.classList.add('open');
      setTimeout(() => {
        hashEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  // 10. Interactive Client-Side Photo Dropzone & Previewer
  const dropzones = document.querySelectorAll('.add-photo-dropzone');
  dropzones.forEach(dz => {
    const fileInput = dz.querySelector('input[type="file"]');
    
    dz.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          window.showToast('Please select a valid image file (JPG, PNG, WebP).');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const gallery = dz.closest('.week-photo-container').querySelector('.photo-gallery-grid');
          if (gallery) {
            const newPhotoItem = document.createElement('div');
            newPhotoItem.className = 'photo-item';
            newPhotoItem.innerHTML = `
              <img src="${event.target.result}" alt="Uploaded User Photo" style="cursor: zoom-in;">
              <div class="photo-caption">User Uploaded: ${file.name}</div>
            `;
            gallery.appendChild(newPhotoItem);

            // Attach lightbox handler to newly added image
            const newImg = newPhotoItem.querySelector('img');
            newImg.addEventListener('click', () => {
              const lightbox = document.querySelector('.lightbox-modal');
              if (lightbox) {
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = newImg.src;
                lightboxImg.alt = newImg.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
              }
            });

            window.showToast(`Photo "${file.name}" added to this week's gallery preview!`);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Drag & Drop
    dz.addEventListener('dragover', (e) => {
      e.preventDefault();
      dz.style.borderColor = '#2dd4bf';
      dz.style.background = 'rgba(45, 212, 191, 0.12)';
    });

    dz.addEventListener('dragleave', () => {
      dz.style.borderColor = '';
      dz.style.background = '';
    });

    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      dz.style.borderColor = '';
      dz.style.background = '';
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (fileInput) {
          fileInput.files = e.dataTransfer.files;
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
        }
      }
    });
  });
});
