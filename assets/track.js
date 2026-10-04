/* note へのリンクが押された回数を数える。
 * 押した瞬間に nishira.jp 自身へ「どのページから・どの記事へ」を示す合図を1回送るだけ。
 * 送るのはパスだけで、個人を特定する情報は送らない。外部のサービスも使わない。
 * /?analytics=off を開いたブラウザ（自分のアクセス）からは送らない。 */
(function () {
  try { if (localStorage.getItem('nishira-analytics-optout') === '1') return; } catch (e) {}
  function onClick(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    if (!/^https?:\/\/(www\.)?note\.com\//.test(a.href)) return;
    var m = /\/n\/([A-Za-z0-9]+)/.exec(a.href);
    var from = location.pathname.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '').replace(/[^A-Za-z0-9_-]+/g, '_') || 'top';
    var url = '/c/note/' + from + '/' + (m ? m[1] : 'home');
    try {
      if (window.fetch) fetch(url, { method: 'GET', keepalive: true, cache: 'no-store' });
      else (new Image()).src = url;
    } catch (e) {}
  }
  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', onClick, true);
})();
