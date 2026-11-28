// docs.js — AquaVaults Learn section
// Handles: sidebar injection, active link, TOC generation, anchor links

(function () {

  function projectRoot() {
    return window.location.pathname.indexOf('/aquavaults-experience-redesign/') === 0
      ? '/aquavaults-experience-redesign'
      : '';
  }

  function resolveProjectLinks(container) {
    var root = projectRoot();
    if (!root || !container) return;
    container.querySelectorAll('a[href^="/"]').forEach(function (link) {
      link.setAttribute('href', root + link.getAttribute('href'));
    });
    container.querySelectorAll('img[src^="/"]').forEach(function (image) {
      image.setAttribute('src', root + image.getAttribute('src'));
    });
  }

  // ── 1. Sidebar loader ──────────────────────────────────
  function loadSidebar() {
    var container = document.getElementById('docs-sidebar');
    if (!container) return;

    fetch(projectRoot() + '/learn/docs-sidebar.html?v=6')
      .then(function (r) {
        if (!r.ok) throw new Error('sidebar ' + r.status);
        return r.text();
      })
      .then(function (html) {
        container.innerHTML = html;
        resolveProjectLinks(container);
        setActiveSidebarLink();
        initMobileNav();
      })
      .catch(function () {
        container.innerHTML = '';
      });
  }

  // ── 2. Mark the current page's sidebar link active ─────
  function setActiveSidebarLink() {
    var path = window.location.pathname
      .replace(/^\/aquavaults-experience-redesign(?=\/|$)/, '')
      .replace(/\/$/, '');
    var links = document.querySelectorAll('.docs-sidebar-link');
    links.forEach(function (link) {
      var href = (link.pathname || link.getAttribute('href') || '')
        .replace(/^\/aquavaults-experience-redesign(?=\/|$)/, '')
        .replace(/\/$/, '');
      // Exact match, or landing-page root match
      if (href === path || (href === '/learn' && path === '/learn')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ── 3. Build in-page TOC ───────────────────────────────
  function buildTOC() {
    var toc = document.getElementById('docs-toc');
    if (!toc) return;
    var content = document.querySelector('.docs-content');
    if (!content) return;

    var headings = content.querySelectorAll('h2[id], h3[id]');
    if (headings.length < 2) {
      toc.style.display = 'none';
      return;
    }

    var label = document.createElement('div');
    label.className = 'docs-toc-label';
    label.textContent = 'On This Page';
    toc.appendChild(label);

    var ul = document.createElement('ul');
    ul.className = 'docs-toc-list';

    headings.forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'docs-toc-link' + (h.tagName === 'H3' ? ' docs-toc-link-sub' : '');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/#\s*$/, '').trim();
      li.appendChild(a);
      ul.appendChild(li);
    });

    toc.appendChild(ul);
    initTOCTracking(toc);
  }

  // ── 4. Scroll-based TOC highlight ─────────────────────
  function initTOCTracking(toc) {
    if (!window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          toc.querySelectorAll('.docs-toc-link').forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-80px 0px -55% 0px' });

    document.querySelectorAll('.docs-content h2[id], .docs-content h3[id]').forEach(function (h) {
      observer.observe(h);
    });
  }

  // ── 5. Section anchor links ────────────────────────────
  function initAnchorLinks() {
    var headings = document.querySelectorAll('.docs-content h2[id], .docs-content h3[id]');
    headings.forEach(function (h) {
      var a = document.createElement('a');
      a.className = 'docs-anchor';
      a.href = '#' + h.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      h.appendChild(a);
    });
  }

  // ── 6. Mobile sidebar toggle ──────────────────────────
  function initMobileNav() {
    var sidebar = document.getElementById('docs-sidebar');
    if (!sidebar) return;

    var openMode = null;

    // Backdrop
    var backdrop = document.createElement('div');
    backdrop.id = 'docs-sidebar-backdrop';
    backdrop.className = 'docs-sidebar-backdrop';
    document.body.appendChild(backdrop);

    // Close button at top of sidebar panel
    var closeBar = document.createElement('div');
    closeBar.className = 'docs-sidebar-close';
    closeBar.innerHTML = '<button aria-label="Close navigation">\u2715</button>';
    sidebar.insertAdjacentElement('afterbegin', closeBar);

    // Breadcrumb "Learn" link — click (all sizes) + hover (desktop)
    var breadcrumbLearn = document.querySelector('.docs-breadcrumb-link');
    if (breadcrumbLearn) {
      breadcrumbLearn.title = 'Open navigation';
      breadcrumbLearn.addEventListener('click', function (e) {
        e.preventDefault();
        openSidebar('click');
      });
      breadcrumbLearn.addEventListener('mouseenter', function () {
        if (!sidebar.classList.contains('open')) {
          openSidebar('hover');
        }
      });
    }

    // Sidebar mouseleave — close only if hover mode
    sidebar.addEventListener('mouseleave', function () {
      if (openMode === 'hover') { closeSidebar(); }
    });

    // Header "Learn" link — mobile intercept only
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="/learn"]');
      if (link && link.closest('#header-container') && window.innerWidth <= 900) {
        e.preventDefault();
        openSidebar('click');
      }
    });

    // Landing page browse button
    var browseBtn = document.getElementById('docs-mobile-browse');
    if (browseBtn) {
      browseBtn.addEventListener('click', function () { openSidebar('click'); });
    }

    backdrop.addEventListener('click', closeSidebar);
    closeBar.querySelector('button').addEventListener('click', closeSidebar);

    // Close when a sidebar nav link is clicked
    sidebar.addEventListener('click', function (e) {
      if (e.target.classList.contains('docs-sidebar-link')) {
        closeSidebar();
      }
    });

    function openSidebar(mode) {
      openMode = mode;
      sidebar.classList.add('open');
      if (mode === 'hover') {
        backdrop.classList.remove('open');
      } else {
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeSidebar() {
      openMode = null;
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── 7. Copy-to-clipboard buttons (shared across Learn pages) ──
  function initCopyButtons() {
    document.addEventListener('click', function (event) {
      var btn = event.target && event.target.closest
        ? event.target.closest('.docs-wallet-copy-btn')
        : null;
      if (!btn) return;

      var value = btn.getAttribute('data-copy') || '';
      if (!navigator.clipboard || !value) return;

      navigator.clipboard.writeText(value).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = original; }, 1000);
      }).catch(function () {});
    });
  }

  // ── Init ──────────────────────────────────────────────
  function init() {
    loadSidebar();
    buildTOC();
    initAnchorLinks();
    initCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
