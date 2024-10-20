const _0x2ec03a = function () {
  let _0x155ad9 = true;
  return function (_0x27f99d, _0x5781b3) {
    const _0x4c4ad9 = _0x155ad9 ? function () {
      if (_0x5781b3) {
        const _0x58d53d = _0x5781b3.apply(_0x27f99d, arguments);
        _0x5781b3 = null;
        return _0x58d53d;
      }
    } : function () {};
    _0x155ad9 = false;
    return _0x4c4ad9;
  };
}();
const _0x5988e7 = _0x2ec03a(this, function () {
  return _0x5988e7.toString().search("(((.+)+)+)+$").toString().constructor(_0x5988e7).search("(((.+)+)+)+$");
});
_0x5988e7();
module.exports = async _0x1f42b4 => {
  const {
    client: _0x457a68,
    m: _0x3b72e8
  } = _0x1f42b4;
  const _0xa9e17f = await fetch("https://api.github.com/repos/Devenlee350/dreaded-v2");
  const _0x471c17 = await _0xa9e17f.json();
  const _0x86b3e5 = {
    stars: _0x471c17.stargazers_count,
    forks: _0x471c17.forks_count,
    lastUpdate: _0x471c17.updated_at,
    owner: _0x471c17.owner.login
  };
  const _0xfb4171 = new Date(_0x471c17.created_at).toLocaleDateString("en-GB");
  const _0x291ad6 = new Date(_0x86b3e5.lastUpdate).toLocaleDateString('en-GB');
  const _0x1923a8 = "*Repository:* " + _0x471c17.html_url + "\n\n✨ Stars: " + _0x86b3e5.stars + "\n\n🎭 Forks: " + _0x86b3e5.forks + "\n\n📅 Release Date: " + _0xfb4171 + "\n\n🕐 Last Update: " + _0x291ad6 + "\n\n🥇Owner: " + _0x86b3e5.owner;
  const _0x28fc74 = {
    url: "https://i.imgur.com/ZnfODeW.jpeg"
  };
  const _0xc52fd9 = {
    image: _0x28fc74,
    caption: _0x1923a8
  };
  await _0x457a68.sendMessage(_0x3b72e8.chat, _0xc52fd9, {
    'quoted': _0x3b72e8
  });
};
