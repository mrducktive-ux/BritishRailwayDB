(function () {
    var body = document.body;
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';
    var pageName = currentFile.replace(/\.html$/i, '') || 'index';

    if (body) {
        body.setAttribute('data-page', pageName);
        if (/^(class\d+|mark\d+|mark2coaches|mark2dbso|mark3coaches|mark3dvt)$/i.test(pageName)) {
            body.classList.add('page-stock-detail');
        }
    }

    var panels = document.querySelectorAll('.page-menu-panel');
    panels.forEach(function (panel) {
        var accountLink = panel.querySelector('a[href="account.html"]');
        if (!accountLink) {
            accountLink = document.createElement('a');
            accountLink.href = 'account.html';
            accountLink.textContent = 'My Account';
            panel.appendChild(accountLink);
        }

        var links = panel.querySelectorAll('a');
        links.forEach(function (link) {
            var href = (link.getAttribute('href') || '').split('#')[0];
            if (href === currentFile) {
                link.classList.add('current');
                link.setAttribute('aria-current', 'page');
            }
        });
    });

    var menus = document.querySelectorAll('.page-menu');
    document.addEventListener('click', function (event) {
        menus.forEach(function (menu) {
            if (!menu.contains(event.target)) menu.removeAttribute('open');
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            menus.forEach(function (menu) {
                menu.removeAttribute('open');
            });
        }
    });
})();
