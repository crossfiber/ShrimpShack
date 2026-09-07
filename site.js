if ('scrollRestoration' in history) { history.scrollRestoration = 'auto'; }
(function(){
  if (window.location.hash && !document.querySelector(window.location.hash)) {
    history.replaceState(null, '', window.location.pathname);
  }

  /* drawer */
  var hamburger = document.getElementById('hamburger');
  var drawer    = document.getElementById('navDrawer');
  var overlay   = document.getElementById('navOverlay');
  var drawerClose = document.getElementById('drawerClose');
  function openDrawer(){
    drawer.classList.add('open'); overlay.classList.add('open');
    document.body.classList.add('drawer-open');
    drawer.setAttribute('aria-hidden','false');
    hamburger.setAttribute('aria-expanded','true');
  }
  function closeDrawer(){
    drawer.classList.remove('open'); overlay.classList.remove('open');
    document.body.classList.remove('drawer-open');
    drawer.setAttribute('aria-hidden','true');
    hamburger.setAttribute('aria-expanded','false');
  }
  if (hamburger && drawer) {
    hamburger.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  /* same-page anchor smooth scroll + hash strip */
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(function(link){
    link.addEventListener('click', function(e){
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', window.location.pathname);
    });
  });

  /* accordion (single-open, max-height, resize resync) */
  document.querySelectorAll('.acc-head').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.parentElement;
      var body = item.querySelector('.acc-body');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.acc-head').setAttribute('aria-expanded','false');
        i.querySelector('.acc-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
  var rsz;
  window.addEventListener('resize', function(){
    clearTimeout(rsz);
    rsz = setTimeout(function(){
      document.querySelectorAll('.acc-item.open .acc-body').forEach(function(b){ b.style.maxHeight = b.scrollHeight + 'px'; });
    }, 120);
  });

  /* menu page: category bar scrollspy */
  var catbar = document.getElementById('catbar');
  if (catbar) {
    var links = [].slice.call(catbar.querySelectorAll('a'));
    var cats  = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
    var offset = function(){
      var nav = document.querySelector('.nav').offsetHeight;
      return nav + catbar.offsetHeight + 24;
    };
    /* click: smooth scroll under the two bars */
    links.forEach(function(a){
      a.addEventListener('click', function(e){
        var t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.pageYOffset - offset() + 20;
        window.scrollTo({top:y, behavior:'smooth'});
        history.replaceState(null, '', window.location.pathname);
      });
    });
    var setActive = function(){
      var pos = window.pageYOffset + offset() + 40;
      var current = 0;
      cats.forEach(function(c, i){ if (c && c.offsetTop <= pos) current = i; });
      links.forEach(function(a, i){
        a.classList.toggle('active', i === current);
      });
      var act = links[current];
      if (act) {
        var r = act.getBoundingClientRect(), br = catbar.getBoundingClientRect();
        if (r.left < br.left || r.right > br.right) {
          act.scrollIntoView({block:'nearest', inline:'center', behavior:'smooth'});
        }
      }
    };
    var tick = false;
    window.addEventListener('scroll', function(){
      if (tick) return; tick = true;
      requestAnimationFrame(function(){ setActive(); tick = false; });
    });
    setActive();
    /* arriving with a hash (from index): position under the bars */
    if (window.location.hash) {
      var t = document.querySelector(window.location.hash);
      if (t) setTimeout(function(){
        window.scrollTo({top: t.getBoundingClientRect().top + window.pageYOffset - offset() + 20});
        history.replaceState(null, '', window.location.pathname);
      }, 60);
    }
  }

  /* reviews carousel */
  var rrail = document.getElementById('revRail');
  var rprev = document.getElementById('revPrev');
  var rnext = document.getElementById('revNext');
  if (rrail && rprev && rnext) {
    var rstep = function(){
      var c = rrail.querySelector('.rev-item');
      return c ? c.getBoundingClientRect().width + 22 : 420;
    };
    rprev.addEventListener('click', function(){ rrail.scrollBy({left: -rstep(), behavior:'smooth'}); });
    rnext.addEventListener('click', function(){ rrail.scrollBy({left:  rstep(), behavior:'smooth'}); });
  }
})();
