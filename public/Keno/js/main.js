function CAnimBalls(a, d) {
  var b, c, f, e, g, h, m;
  this._init = function (a, d) {
    b = ANIMATION_SPEED;
    f = 7;
    var g = s_oSpriteLibrary.getSprite("ball"),
      q = new createjs.SpriteSheet({
        images: [g],
        frames: {
          width: g.width / NUM_DIFFERENT_BALLS,
          height: g.height,
          regX: g.width / NUM_DIFFERENT_BALLS / 2,
          regY: g.height / 2,
        },
        animations: { red: [0], green: [1], cyan: [0], violet: [1], blue: [1] },
      });
    e = [];
    h = [];
    c = g.height;
    for (var p = 0; 28 > p; p++) {
      var l = Math.floor(Math.random() * NUM_DIFFERENT_BALLS);
      e[p] = createSprite(
        q,
        l,
        g.width / NUM_DIFFERENT_BALLS / 2,
        g.height / 2,
        g.width / NUM_DIFFERENT_BALLS,
        g.height
      );
      e[p].gotoAndStop(l);
      e[p].x = a;
      p > f
        ? ((e[p].alpha = 0),
          (e[p].scaleX = e[p].scaleY = 0),
          (e[p].y = d + f * c))
        : ((e[p].y = d + p * c), (h[p] = d + p * c));
    }
    for (p = 0; 28 > p; p++) s_oStage.addChild(e[28 - p - 1]);
  };
  this.unload = function () {
    for (var a = 0; 26 > a; a++) s_oStage.removeChild(e[a]);
  };
  this.startAnimation = function (a) {
    g = [];
    for (var b = 0; 20 > b; b++) g[b] = a[b];
    this._animBalls(0);
  };
  this._animBalls = function (a) {
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      createjs.Sound.play("launch_ball");
    createjs.Tween.get(e[a])
      .to({ y: -200 }, 2 * b, createjs.Ease.quartOut)
      .to({ y: g[a].y }, 3 * b, createjs.Ease.bounceOut)
      .call(function () {
        s_oGame.showExtracted(a, e[a].currentFrame);
        e[a].visible = !1;
        19 > a || s_oGame._checkContinueGame();
      });
    createjs.Tween.get(e[a]).to({ x: g[a].x }, 5 * b);
    for (var c = 0, d = a + 1; d < a + f + 1; d++)
      createjs.Tween.get(e[d]).to({ y: h[c] }, b), c++;
    createjs.Tween.get(e[a + f + 1])
      .to({ scaleX: 1, scaleY: 1, alpha: 1 }, b, createjs.Ease.cubicIn)
      .call(function () {
        19 > a && m._animBalls(a + 1);
      });
  };
  this.resetBalls = function () {
    for (var b = 0; 28 > b; b++)
      if (((e[b].visible = !0), (e[b].x = a), b <= f))
        (e[b].y = d + b * c), e[b].gotoAndStop(e[20 + b].currentFrame);
      else if (b > f) {
        var g = Math.floor(Math.random() * NUM_DIFFERENT_BALLS);
        e[b].gotoAndStop(g);
        e[b].alpha = 0;
        e[b].scaleX = e[b].scaleY = 0;
        e[b].y = d + f * c;
      } else
        (g = Math.floor(Math.random() * NUM_DIFFERENT_BALLS)),
          e[b].gotoAndStop(g),
          (e[b].y = d + b * c);
  };
  m = this;
  this._init(a, d);
}
function CEndPanel(a) {
  var d, b, c, f;
  this._init = function (a) {
    d = createBitmap(a);
    d.x = 0;
    d.y = 0;
    c = new createjs.Text("", "bold 60px " + PRIMARY_FONT, "#000");
    c.x = CANVAS_WIDTH / 2 + 2 - 60;
    c.y = CANVAS_HEIGHT / 2 - 48;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineWidth = 500;
    f = new createjs.Text("", "bold 60px " + PRIMARY_FONT, "#ffffff");
    f.x = CANVAS_WIDTH / 2 - 60;
    f.y = CANVAS_HEIGHT / 2 - 50;
    f.textAlign = "center";
    f.textBaseline = "middle";
    f.lineWidth = 500;
    b = new createjs.Container();
    b.alpha = 0;
    b.visible = !1;
    b.addChild(d, c, f);
    s_oStage.addChild(b);
  };
  this.unload = function () {
    b.off("mousedown", this._onExit);
  };
  this._initListener = function () {
    b.on("mousedown", this._onExit);
  };
  this.show = function () {
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      createjs.Sound.play("game_over");
    c.text = TEXT_GAMEOVER;
    f.text = TEXT_GAMEOVER;
    b.visible = !0;
    var a = this;
    createjs.Tween.get(b)
      .to({ alpha: 1 }, 500)
      .call(function () {
        a._initListener();
      });
  };
  this._onExit = function () {
    b.off("mousedown", this._onExit);
    s_oStage.removeChild(b);
    $(s_oMain).trigger("end_session");
    s_oGame.onExit();
  };
  this._init(a);
  return this;
}
function CGame(a) {
  var d,
    b,
    c,
    f,
    e,
    g,
    h,
    m,
    n,
    r,
    k,
    q,
    p,
    l = null,
    v,
    t,
    u,
    x,
    w;
  this._init = function () {
    b = BANK;
    f = START_PLAYER_MONEY;
    c = BET[3];
    e = 0;
    h = 1;
    m = 0;
    k = [];
    var a = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
    s_oStage.addChild(a);
    p = new CInterface();
    p.refreshBet(c);
    t = new createjs.Container();
    t.x = CANVAS_WIDTH / 2;
    t.y = CANVAS_HEIGHT / 2;
    s_oStage.addChild(t);
    this._initCells();
    u = new CPayouts(1360, 203);
    var a = s_oSpriteLibrary.getSprite("hole"),
      d = createBitmap(a);
    d.regX = a.width / 2;
    d.regY = a.height / 2;
    d.x = 365;
    d.y = 750;
    s_oStage.addChild(d);
    x = new CAnimBalls(365, 260);
    a = s_oSpriteLibrary.getSprite("tube");
    a = createBitmap(a);
    a.x = 315;
    a.y = 205;
    s_oStage.addChild(a);
    a = new createjs.Graphics()
      .beginFill("rgba(158,158,158,0.01)")
      .drawRect(0, 200, CANVAS_WIDTH, CANVAS_HEIGHT - 200);
    w = new createjs.Shape(a);
    w.on("click", function () {});
    w.visible = !1;
    s_oStage.addChild(w);
    if (c > f) for (a = 0; 80 > a; a++) n[a].block(!0);
  };
  this._initCells = function () {
    var a = s_oSpriteLibrary.getSprite("num_button"),
      b = a.width / 2 - 5,
      a = a.height - 5,
      c = -(10 * b) / 2 + b / 2 - 40,
      d = -(8 * a) / 2 + a / 2 + 10;
    n = [];
    r = [];
    for (var e = 0, f = 0; 80 > f; f++)
      (n[f] = new CNumToggle(c + (f % 10) * b, d + a * e, f + 1, t)),
        n[f].addEventListenerWithParams(
          ON_MOUSE_UP,
          this._onButNumRelease,
          this,
          f
        ),
        9 === f % 10 && e++,
        (r[f] = !1);
    a = s_oSpriteLibrary.getSprite("number");
    b = createBitmap(a);
    b.regX = a.width / 2;
    b.regY = a.height / 2;
    b.x = CANVAS_WIDTH / 2 - 35;
    b.y = CANVAS_HEIGHT / 2 + 10;
    s_oStage.addChild(b);
  };
  this._onButNumRelease = function (a) {
    this._clearAllSelected();
    if (r[a]) {
      e--;
      r[a] = !1;
      for (var b = 0; b < k.length; b++) k[b] === a && k.splice(b, 1);
    } else e++, (r[a] = !0), k.push(a);
    for (b = 0; b < k.length; b++) n[k[b]].setActive(!0);
    this._checkActiveButton();
    u.updatePayouts(e - 1);
    if (9 < e) for (b = 0; b < r.length; b++) r[b] || n[b].block(!0);
    else for (b = 0; b < r.length; b++) n[b].block(!1);
  };
  this._checkActiveButton = function () {
    2 > e
      ? (p.enablePlay1(!1), p.enablePlay5(!1))
      : (p.enablePlay1(!0), 5 * c > f ? p.enablePlay5(!1) : p.enablePlay5(!0));
  };
  this.clearSelection = function () {
    k = [];
    this._clearAllExtracted();
    e = 0;
    u.updatePayouts(e - 1);
    for (var a = 0; a < r.length; a++)
      (r[a] = !1), n[a].block(!1), n[a].setActive(!1);
    this._checkActiveButton();
  };
  this.undoSelection = function () {
    this._clearAllExtracted();
    if (0 !== e) {
      var a = k.pop();
      e--;
      r[a] = !1;
      n[a].setActive(!1);
      for (a = 0; a < r.length; a++) n[a].block(!1);
      this._checkActiveButton();
      u.updatePayouts(e - 1);
    }
  };
  this.selectBet = function (a) {
    this._clearAllExtracted();
    for (var b, e = 0; e < BET.length; e++) BET[e] === c && (b = e);
    "add" === a
      ? b !== BET.length - 1 && BET[b + 1] <= f && b++
      : 0 !== b && b--;
    c = BET[b];
    p.refreshBet(c);
    this._checkActiveButton();
  };
  this.play5 = function () {
    h = 5;
    this.play();
  };
  this.tryShowAd = function () {
    m++;
    m === AD_SHOW_COUNTER &&
      ((m = 0), $(s_oMain).trigger("show_interlevel_ad"));
  };
  this.play = function () {
    this._clearAllExtracted();
    this.tryShowAd();
    if (!(2 > e)) {
      this.smartBlockGUI(!1);
      f -= c;
      b += c;
      f = parseFloat(f.toFixed(1));
      p.refreshMoney(f);
      for (var a = null, d = 0; d < PAYOUTS[e - 1].pays.length; d++)
        if (PAYOUTS[e - 1].pays[d] * c <= b) {
          a = d;
          break;
        }
      null === a ? this._extractLosingCombination() : this._checkWin(a);
    }
  };
  this._checkWin = function (a) {
    100 * Math.random() < WIN_OCCURRENCE[e - 1]
      ? this._extractWinCombination(a)
      : this._extractLosingCombination();
  };
  this._extractWinCombination = function (a) {
    d = !0;
    for (var b = [], c = PAYOUTS[e - 1].pays.length - 1; c >= a; c--)
      for (var f = 0; f < PAYOUTS[e - 1].occurrence[c]; f++)
        b.push(PAYOUTS[e - 1].hits[c]);
    a = Math.floor(Math.random() * b.length);
    f = [];
    for (c = 0; c < k.length; c++) f[c] = k[c] + 1;
    shuffle(f);
    for (var l = [], c = 0; c < r.length; c++) r[c] || l.push(c + 1);
    shuffle(l);
    q = [];
    for (c = 0; 20 > c; c++) c < b[a] ? q.push(f[c]) : q.push(l[c]);
    shuffle(q);
    for (c = 0; 20 > c; c++);
    g = b[a];
    this._animExtraction();
  };
  this._extractLosingCombination = function () {
    d = !1;
    for (
      var a = Math.round(
          Math.random() *
            (PAYOUTS[e - 1].hits[PAYOUTS[e - 1].hits.length - 1] - 1)
        ),
        b = [],
        c = 0;
      c < k.length;
      c++
    )
      b[c] = k[c] + 1;
    shuffle(b);
    for (var f = [], c = 0; c < r.length; c++) r[c] || f.push(c + 1);
    shuffle(f);
    q = [];
    for (c = 0; 20 > c; c++) c < a ? q.push(b[c]) : q.push(f[c]);
    shuffle(q);
    g = 0;
    this._animExtraction();
  };
  this._animExtraction = function () {
    for (var a = [], b = 0; 20 > b; b++)
      a.push(n[q[b] - 1].getGlobalPosition());
    x.startAnimation(a);
  };
  this._checkContinueGame = function () {
    for (var a = 0; a < PAYOUTS[e - 1].hits.length; a++)
      if (PAYOUTS[e - 1].hits[a] === g) {
        a = c * PAYOUTS[e - 1].pays[a];
        a = parseFloat(a.toFixed(1));
        f += a;
        b -= a;
        u.showWin(a);
        u.highlightWin(g);
        break;
      }
    p.refreshMoney(f);
    d &&
      ((!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
        createjs.Sound.play("win"));
    x.resetBalls();
    this.highlightCell();
    $(s_oMain).trigger("save_score", f);
    if (c > f) {
      for (var l = null, a = 0; a < BET.length; a++) BET[a] <= f && (l = a);
      if (null !== l) (c = BET[l]), p.refreshBet(c);
      else {
        this.gameOver();
        return;
      }
    }
    1 === h
      ? this.smartBlockGUI(!0)
      : (h--,
        setTimeout(function () {
          v.play();
        }, 2e3));
  };
  this.showExtracted = function (a, b) {
    n[q[a] - 1].setExtracted(!0, b);
  };
  this._clearAllExtracted = function () {
    u.showWin(0);
    u.stopHighlight();
    for (var a = 0; a < r.length; a++) n[a].setExtracted(!1, 0);
    for (a = 0; a < k.length; a++) n[k[a]].setActive(!0);
  };
  this._clearAllSelected = function () {
    u.showWin(0);
    u.stopHighlight();
    for (var a = 0; a < r.length; a++) n[a].setExtracted(!1, 0);
  };
  this.smartBlockGUI = function (a) {
    a
      ? ((w.visible = !1),
        p.enableAllButton(!0),
        5 * c <= f ? p.enablePlay5(!0) : p.enablePlay5(!1))
      : ((w.visible = !0), p.enableAllButton(!1));
  };
  this.getCurMoney = function () {
    return f;
  };
  this.restartGame = function () {
    this.unload();
    this._init();
  };
  this.unload = function () {
    p.unload();
    null !== l && l.unload();
    createjs.Tween.removeAllTweens();
    s_oStage.removeAllChildren();
  };
  this.onExit = function () {
    this.unload();
    s_oMain.gotoMenu();
  };
  this._onExitHelp = function () {
    _bStartGame = !0;
  };
  this.gameOver = function () {
    l = CEndPanel(s_oSpriteLibrary.getSprite("msg_box"));
    l.show();
  };
  this.highlightCell = function () {
    for (var a = 0; a < q.length; a++)
      for (var b = 0; b < k.length; b++)
        q[a] === k[b] + 1 && n[k[b]].highlight();
  };
  this.update = function () {};
  s_oGame = this;
  WIN_OCCURRENCE = a.win_occurrence;
  PAYOUTS = a.payouts;
  BANK = a.bank_money;
  START_PLAYER_MONEY = a.start_player_money;
  ANIMATION_SPEED = a.animation_speed;
  AD_SHOW_COUNTER = a.ad_show_counter;
  v = this;
  this._init();
}
var s_oGame;
function CGfxButton(a, d, b) {
  var c, f, e;
  this._init = function (a, b, d) {
    c = [];
    f = [];
    e = createBitmap(d);
    e.x = a;
    e.y = b;
    e.regX = d.width / 2;
    e.regY = d.height / 2;
    s_oStage.addChild(e);
    this._initListener();
  };
  this.unload = function () {
    e.off("mousedown", this.buttonDown);
    e.off("pressup", this.buttonRelease);
    s_oStage.removeChild(e);
  };
  this.setVisible = function (a) {
    e.visible = a;
  };
  this._initListener = function () {
    e.on("mousedown", this.buttonDown);
    e.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (a, b, d) {
    c[a] = b;
    f[a] = d;
  };
  this.buttonRelease = function () {
    e.scaleX = 1;
    e.scaleY = 1;
    c[ON_MOUSE_UP] && c[ON_MOUSE_UP].call(f[ON_MOUSE_UP]);
  };
  this.buttonDown = function () {
    e.scaleX = 0.9;
    e.scaleY = 0.9;
    c[ON_MOUSE_DOWN] && c[ON_MOUSE_DOWN].call(f[ON_MOUSE_DOWN]);
  };
  this.setPosition = function (a, b) {
    e.x = a;
    e.y = b;
  };
  this.setX = function (a) {
    e.x = a;
  };
  this.setY = function (a) {
    e.y = a;
  };
  this.getButtonImage = function () {
    return e;
  };
  this.getX = function () {
    return e.x;
  };
  this.getY = function () {
    return e.y;
  };
  this._init(a, d, b);
  return this;
}
function CHelpPanel() {
  var a, d, b, c, f, e, g;
  this._init = function () {
    var g = this;
    f = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
    var m = CANVAS_WIDTH / 2,
      n = CANVAS_HEIGHT / 2 - 200;
    d = new createjs.Text(TEXT_HELP1, " 24px " + SECONDARY_FONT, "#000000");
    d.x = m + 2;
    d.y = n + 2;
    d.textAlign = "center";
    d.textBaseline = "alphabetic";
    d.lineWidth = 400;
    a = new createjs.Text(TEXT_HELP1, " 24px " + SECONDARY_FONT, "#ffffff");
    a.x = m;
    a.y = n;
    a.textAlign = "center";
    a.textBaseline = "alphabetic";
    a.lineWidth = 400;
    m = CANVAS_WIDTH / 2 - 130;
    n = CANVAS_HEIGHT / 2 - 40;
    c = new createjs.Text(TEXT_HELP2, " 24px " + SECONDARY_FONT, "#000000");
    c.x = m + 2;
    c.y = n + 2;
    c.textAlign = "center";
    c.textBaseline = "alphabetic";
    c.lineWidth = 280;
    b = new createjs.Text(TEXT_HELP2, " 24px " + SECONDARY_FONT, "#ffffff");
    b.x = m;
    b.y = n;
    b.textAlign = "center";
    b.textBaseline = "alphabetic";
    b.lineWidth = 280;
    e = new createjs.Container();
    e.addChild(f, d, a, c, b);
    e.alpha = 0;
    s_oStage.addChild(e);
    createjs.Tween.get(e).to({ alpha: 1 }, 700);
    e.on("pressup", function () {
      g._onExitHelp();
    });
  };
  this.unload = function () {
    s_oStage.removeChild(e);
    var a = this;
    e.off("pressup", function () {
      a._onExitHelp();
    });
  };
  this._onExitHelp = function () {
    g.unload();
    s_oGame._onExitHelp();
  };
  g = this;
  this._init();
}
function CInterface() {
  var a, d, b, c, f, e, g, h, m, n, r, k, q, p;
  this._init = function () {
    var l = s_oSpriteLibrary.getSprite("but_exit");
    b = CANVAS_WIDTH - l.height / 2 - 20;
    c = l.height / 2 + 10;
    e = new CGfxButton(b, c, l, !0);
    e.addEventListener(ON_MOUSE_UP, this._onExit, this);
    a = CANVAS_WIDTH - l.width / 2 - 100 - 15;
    d = l.height / 2 + 10;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      (l = s_oSpriteLibrary.getSprite("audio_icon")),
        (f = new CToggle(a, d, l, s_bAudioActive)),
        f.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    l = s_oSpriteLibrary.getSprite("money_panel");
    m = new CTextButton(
      370,
      CANVAS_HEIGHT - 225,
      l,
      TEXT_CURRENCY + START_PLAYER_MONEY,
      PRIMARY_FONT,
      "#ffffff",
      40
    );
    m.block(!0);
    l = s_oSpriteLibrary.getSprite("plus_display");
    n = new CTextButton(
      480,
      CANVAS_HEIGHT - 130,
      l,
      "$1",
      PRIMARY_FONT,
      "#ffffff",
      40,
      !1,
      s_oStage
    );
    n.setTextPosition(51);
    n.block(!0);
    l = s_oSpriteLibrary.getSprite("but_plus");
    h = new CTextToggle(
      638,
      CANVAS_HEIGHT - 130,
      l,
      TEXT_PLUS,
      PRIMARY_FONT,
      "#ffffff",
      70,
      !1,
      s_oStage
    );
    h.enable();
    h.setTextPosition(0, 20);
    h.addEventListener(ON_MOUSE_UP, this._onButPlusRelease, this);
    l = s_oSpriteLibrary.getSprite("but_plus");
    g = new CTextToggle(
      320,
      CANVAS_HEIGHT - 130,
      l,
      TEXT_MIN,
      PRIMARY_FONT,
      "#ffffff",
      70,
      !1,
      s_oStage
    );
    g.enable();
    g.setTextPosition(0, 20);
    g.setScaleX(-1);
    g.addEventListener(ON_MOUSE_UP, this._onButMinRelease, this);
    l = s_oSpriteLibrary.getSprite("but_generic");
    r = new CTextToggle(
      820,
      CANVAS_HEIGHT - 130,
      l,
      TEXT_PLAY1,
      PRIMARY_FONT,
      "#ffffff",
      30,
      !1,
      s_oStage
    );
    r.disable();
    r.setTextPosition(0, 10);
    r.addEventListener(ON_MOUSE_UP, this._onPlay1, this);
    l = s_oSpriteLibrary.getSprite("but_generic");
    k = new CTextToggle(
      1060,
      CANVAS_HEIGHT - 130,
      l,
      TEXT_PLAY5,
      PRIMARY_FONT,
      "#ffffff",
      30,
      !1,
      s_oStage
    );
    k.disable();
    k.setTextPosition(0, 10);
    k.addEventListener(ON_MOUSE_UP, this._onPlay5, this);
    l = s_oSpriteLibrary.getSprite("but_generic");
    q = new CTextToggle(
      1300,
      CANVAS_HEIGHT - 130,
      l,
      TEXT_UNDO,
      PRIMARY_FONT,
      "#ffffff",
      30,
      !1,
      s_oStage
    );
    q.enable();
    q.setTextPosition(0, 10);
    q.addEventListener(ON_MOUSE_UP, this._onUndo, this);
    l = s_oSpriteLibrary.getSprite("but_generic");
    p = new CTextToggle(
      1540,
      CANVAS_HEIGHT - 130,
      l,
      TEXT_CLEAR,
      PRIMARY_FONT,
      "#ffffff",
      30,
      !1,
      s_oStage
    );
    p.enable();
    p.setTextPosition(0, 10);
    p.addEventListener(ON_MOUSE_UP, this._onClear, this);
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };
  this.unload = function () {
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) f.unload(), (f = null);
    e.unload();
    m.unload();
    n.unload();
    g.unload();
    h.unload();
    r.unload();
    k.unload();
    q.unload();
    p.unload();
    s_oInterface = null;
  };
  this.refreshButtonPos = function (l, g) {
    e.setPosition(b - l, g + c);
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      f.setPosition(a - l, g + d);
  };
  this.refreshBet = function (a) {
    n.setText(TEXT_CURRENCY + a);
  };
  this.refreshMoney = function (a) {
    m.setText(TEXT_CURRENCY + a);
  };
  this.enablePlus = function (a) {
    a ? h.enable() : h.disable();
  };
  this.enableMin = function (a) {
    a ? g.enable() : g.disable();
  };
  this.enablePlay1 = function (a) {
    a ? r.enable() : r.disable();
  };
  this.enablePlay5 = function (a) {
    a ? k.enable() : k.disable();
  };
  this.enableUndo = function (a) {
    a ? q.enable() : q.disable();
  };
  this.enableClear = function (a) {
    a ? p.enable() : p.disable();
  };
  this.enableAllButton = function (a) {
    this.enablePlus(a);
    this.enableMin(a);
    this.enablePlay1(a);
    this.enablePlay5(a);
    this.enableUndo(a);
    this.enableClear(a);
  };
  this._onClear = function () {
    s_oGame.clearSelection();
  };
  this._onUndo = function () {
    s_oGame.undoSelection();
  };
  this._onButPlusRelease = function () {
    s_oGame.selectBet("add");
  };
  this._onButMinRelease = function () {
    s_oGame.selectBet("remove");
  };
  this._onPlay1 = function () {
    s_oGame.play();
  };
  this._onPlay5 = function () {
    s_oGame.play5();
  };
  this._onAudioToggle = function () {
    createjs.Sound.setMute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };
  this._onExit = function () {
    $(s_oMain).trigger("end_session");
    var a = s_oGame.getCurMoney();
    $(s_oMain).trigger("share_event", a);
    s_oGame.onExit();
  };
  s_oInterface = this;
  this._init();
  return this;
}
var s_oInterface = null;
TEXT_GAMEOVER = "YOU LOST YOUR CREDITS";
TEXT_CURRENCY = "$";
TEXT_MIN = "-";
TEXT_PLUS = "+";
TEXT_PLAY1 = "PLAY ONE";
TEXT_PLAY5 = "PLAY FIVE";
TEXT_UNDO = "UNDO";
TEXT_CLEAR = "CLEAR";
TEXT_PAYOUTS = "PAYOUTS";
TEXT_HITS = "HITS";
TEXT_PAYS = "PAYS";
TEXT_CONGRATULATIONS = "Congratulations!";
TEXT_SHARE_1 = "You collected <strong>";
TEXT_SHARE_2 = " points</strong>!<br><br>Share your score with your friends!";
TEXT_SHARE_3 = "My score is ";
TEXT_SHARE_4 = " points! Can you do better?";
function CMain(a) {
  var d,
    b = 0,
    c = 0,
    f = STATE_LOADING,
    e,
    g,
    h;
  this.initContainer = function () {
    s_oCanvas = document.getElementById("canvas");
    s_oStage = new createjs.Stage(s_oCanvas);
    createjs.Touch.enable(s_oStage);
    s_bMobile = jQuery.browser.mobile;
    !1 === s_bMobile &&
      (s_oStage.enableMouseOver(20),
      $("body").on("contextmenu", "#canvas", function (a) {
        return !1;
      }));
    s_iPrevTime = new Date().getTime();
    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.setFPS(30);
    navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
    s_oSpriteLibrary = new CSpriteLibrary();
    g = new CPreloader();
  };
  this.preloaderReady = function () {
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) || this._initSounds();
    this._loadImages();
    d = !0;
  };
  this.soundLoaded = function () {
    b++;
    g.refreshLoader(Math.floor((b / c) * 100));
    if (b === c) {
      g.unload();
      if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
        s_oSoundtrack = createjs.Sound.play("soundtrack", { loop: -1 });
      this.gotoMenu();
    }
  };
  this._initSounds = function () {
    createjs.Sound.initializeDefaultPlugins() &&
      (0 < navigator.userAgent.indexOf("Opera") ||
      0 < navigator.userAgent.indexOf("OPR")
        ? ((createjs.Sound.alternateExtensions = ["mp3"]),
          createjs.Sound.addEventListener(
            "fileload",
            createjs.proxy(this.soundLoaded, this)
          ),
          createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack"),
          createjs.Sound.registerSound("./sounds/press_button.ogg", "click"),
          createjs.Sound.registerSound("./sounds/game_over.ogg", "game_over"),
          createjs.Sound.registerSound(
            "./sounds/launch_ball.ogg",
            "launch_ball"
          ),
          createjs.Sound.registerSound("./sounds/win.ogg", "win"))
        : ((createjs.Sound.alternateExtensions = ["ogg"]),
          createjs.Sound.addEventListener(
            "fileload",
            createjs.proxy(this.soundLoaded, this)
          ),
          createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack"),
          createjs.Sound.registerSound("./sounds/press_button.mp3", "click"),
          createjs.Sound.registerSound("./sounds/game_over.mp3", "game_over"),
          createjs.Sound.registerSound(
            "./sounds/launch_ball.mp3",
            "launch_ball"
          ),
          createjs.Sound.registerSound("./sounds/win.mp3", "win")),
      (c += 5));
  };
  this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play1.png");
    s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.png");
    s_oSpriteLibrary.addSprite("bg_game", "./sprites/vlv-keno.png");
    s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit1.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite("but_plus", "./sprites/but_plus1.png");
    s_oSpriteLibrary.addSprite("but_generic", "./sprites/but_generic1.png");
    s_oSpriteLibrary.addSprite("plus_display", "./sprites/plus_display.png");
    s_oSpriteLibrary.addSprite("num_button", "./sprites/num_button11.png");
    s_oSpriteLibrary.addSprite("money_panel", "./sprites/money_panel1.png");
    s_oSpriteLibrary.addSprite("payouts", "./sprites/payouts.png");
    s_oSpriteLibrary.addSprite("win_panel", "./sprites/win_panel1.png");
    s_oSpriteLibrary.addSprite("hole", "./sprites/hole.png");
    s_oSpriteLibrary.addSprite("tube", "./sprites/tube.png");
    s_oSpriteLibrary.addSprite("ball", "./sprites/ball2.png");
    s_oSpriteLibrary.addSprite("number", "./sprites/number-s.png");
    c += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites();
  };
  this._onImagesLoaded = function () {
    b++;
    g.refreshLoader(Math.floor((b / c) * 100));
    if (b === c) {
      g.unload();
      this.gotoMenu();
    }
};

  this._onAllImagesLoaded = function () {};
  this.onAllPreloaderImagesLoaded = function () {
    this._loadImages();
  };
  this.gotoMenu = function () {
    new CMenu();
    f = STATE_MENU;
  };
  this.gotoGame = function () {
    h = new CGame(e);
    f = STATE_GAME;
    $(s_oMain).trigger("game_start");
  };
  this.gotoHelp = function () {
    new CHelp();
    f = STATE_HELP;
  };
  this.stopUpdate = function () {
    d = !1;
    createjs.Ticker.paused = !0;
    $("#block_game").css("display", "block");
  };
  this.startUpdate = function () {
    s_iPrevTime = new Date().getTime();
    d = !0;
    createjs.Ticker.paused = !1;
    $("#block_game").css("display", "none");
  };
  this._update = function (a) {
    if (!1 !== d) {
      var b = new Date().getTime();
      s_iTimeElaps = b - s_iPrevTime;
      s_iCntTime += s_iTimeElaps;
      s_iCntFps++;
      s_iPrevTime = b;
      1e3 <= s_iCntTime &&
        ((s_iCurFps = s_iCntFps), (s_iCntTime -= 1e3), (s_iCntFps = 0));
      f === STATE_GAME && h.update();
      s_oStage.update(a);
    }
  };
  s_oMain = this;
  e = a;
  this.initContainer();
}
var s_bMobile,
  s_bAudioActive = !0,
  s_iCntTime = 0,
  s_iTimeElaps = 0,
  s_iPrevTime = 0,
  s_iCntFps = 0,
  s_iCurFps = 0,
  s_oDrawLayer,
  s_oStage,
  s_oMain,
  s_oSpriteLibrary,
  s_oSoundTrack,
  s_oCanvas,
  s_oSpriteSheetLora;
function CMenu() {
  var a, d, b, c, f, e;
  this._init = function () {
    b = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oStage.addChild(b);
    var g = s_oSpriteLibrary.getSprite("but_play");
    c = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, g);
    c.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      (g = s_oSpriteLibrary.getSprite("audio_icon")),
        (a = CANVAS_WIDTH - g.height / 2 - 10),
        (d = g.height / 2 + 10),
        (e = new CToggle(a, d, g, s_bAudioActive)),
        e.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    f = new createjs.Shape();
    f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    s_oStage.addChild(f);
    createjs.Tween.get(f)
      .to({ alpha: 0 }, 1e3)
      .call(function () {
        f.visible = !1;
      });
    this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
  };
  this.unload = function () {
    c.unload();
    c = null;
    f.visible = !1;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) e.unload(), (e = null);
    s_oStage.removeChild(b);
    s_oMenu = b = null;
  };
  this.refreshButtonPos = function (b, c) {
    e.setPosition(a - b, c + d);
  };
  this._onAudioToggle = function () {
    createjs.Sound.setMute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };
  this._onButPlayRelease = function () {
    this.unload();
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      createjs.Sound.play("click");
    $(s_oMain).trigger("start_session");
    s_oMain.gotoGame();
  };
  s_oMenu = this;
  this._init();
}
var s_oMenu = null;
function CNumToggle(a, d, b, c) {
  var f,
    e,
    g,
    h,
    m,
    n,
    r,
    k = [];
  this._init = function (a, b, c, d) {
    e = !1;
    g = [];
    h = [];
    m = new createjs.Container();
    m.x = a;
    m.y = b;
    d.addChild(m);
    a = s_oSpriteLibrary.getSprite("num_button");
    b = {
      images: [a],
      framerate: 5,
      frames: {
        width: a.width / 2,
        height: a.height,
        regX: a.width / 2 / 2,
        regY: a.height / 2,
      },
      animations: { state_true: [0], state_false: [1] },
    };
    b = new createjs.SpriteSheet(b);
    f = !1;
    n = createSprite(
      b,
      "state_" + f,
      a.width / 2 / 2,
      a.height / 2,
      a.width / 2,
      a.height
    );
    n.stop();
    a = s_oSpriteLibrary.getSprite("ball");
    b = {
      images: [a],
      frames: {
        width: a.width / NUM_DIFFERENT_BALLS,
        height: a.height,
        regX: a.width / NUM_DIFFERENT_BALLS / 2,
        regY: a.height / 2,
      },
      animations: { red: [0], green: [1], cyan: [0], violet: [1], blue: [1] },
    };
    b = new createjs.SpriteSheet(b);
    r = createSprite(
      b,
      "red",
      a.width / NUM_DIFFERENT_BALLS / 2,
      a.height / 2,
      a.width / NUM_DIFFERENT_BALLS,
      a.height
    );
    r.gotoAndStop(0);
    r.visible = !1;
    m.addChild(n, r);
    this._initListener();
  };
  this.unload = function () {
    m.off("mousedown", this.buttonDown);
    m.off("pressup", this.buttonRelease);
    c.removeChild(m);
  };
  this._initListener = function () {
    m.on("mousedown", this.buttonDown);
    m.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (a, b, c) {
    g[a] = b;
    h[a] = c;
  };
  this.addEventListenerWithParams = function (a, b, c, d) {
    g[a] = b;
    h[a] = c;
    k = d;
  };
  this.setActive = function (a) {
    f = a;
    n.gotoAndStop("state_" + f);
  };
  this.buttonRelease = function () {
    e ||
      ((!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
        createjs.Sound.play("click"),
      (f = !f),
      n.gotoAndStop("state_" + f),
      g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], k));
  };
  this.buttonDown = function () {
    e || (g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN], k));
  };
  this.setPosition = function (a, b) {
    m.x = a;
    m.y = b;
  };
  this.getGlobalPosition = function () {
    return { x: m.localToGlobal(0, 0).x, y: m.localToGlobal(0, 0).y };
  };
  this.block = function (a) {
    e = a;
  };
  this.setExtracted = function (a, b) {
    r.visible = a;
    r.gotoAndStop(b);
  };
  this.highlight = function () {
    n.gotoAndPlay(0);
  };
  this.stopHighlight = function () {
    n.gotoAndStop(1);
  };
  this._init(a, d, b, c);
}
function CPayouts(a, d) {
  var b = 0,
    c,
    f,
    e,
    g,
    h,
    m,
    n,
    r,
    k,
    q;
  this._init = function (a, b) {
    f = new createjs.Container();
    f.x = a;
    f.y = b;
    s_oStage.addChild(f);
    var c = createBitmap(s_oSpriteLibrary.getSprite("payouts")),
      d = createBitmap(s_oSpriteLibrary.getSprite("win_panel"));
    d.x = -6;
    d.y = 577;
    h = new createjs.Text(TEXT_PAYOUTS, " 34px " + PRIMARY_FONT, "#ffffff");
    h.x = 150;
    h.y = 40;
    h.textAlign = "center";
    h.textBaseline = "middle";
    h.lineWidth = 400;
    e = new createjs.Text(TEXT_HITS, " 30px " + PRIMARY_FONT, "#ffffff");
    e.x = 80;
    e.y = 130;
    e.textAlign = "center";
    e.textBaseline = "alphabetic";
    e.lineWidth = 400;
    g = new createjs.Text(TEXT_PAYS, " 30px " + PRIMARY_FONT, "#ffffff");
    g.x = 210;
    g.y = 130;
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.lineWidth = 400;
    f.addChild(c, e, g, h, d);
    r = [];
    k = [];
    q = [];
    for (c = 0; 6 > c; c++)
      (r[c] = 190 + 50 * c),
        (k[c] = new createjs.Text("-", "bold 36px " + PRIMARY_FONT, "#ffffff")),
        (k[c].x = 80),
        (k[c].y = r[c]),
        (k[c].textAlign = "center"),
        (k[c].textBaseline = "middle"),
        f.addChild(k[c]),
        (q[c] = new createjs.Text("-", "bold 36px " + PRIMARY_FONT, "#ffffff")),
        (q[c].x = 210),
        (q[c].y = r[c]),
        (q[c].textAlign = "center"),
        (q[c].textBaseline = "middle"),
        f.addChild(q[c]);
    m = new createjs.Text(
      TEXT_CURRENCY + "0",
      "bold 40px " + PRIMARY_FONT,
      "#ffffff"
    );
    m.x = 150;
    m.y = 646;
    m.textAlign = "center";
    m.textBaseline = "middle";
    f.addChild(m);
  };
  this.unload = function () {
    s_oStage.removeChild(f);
  };
  this.updatePayouts = function (a) {
    if (0 > a) var b = 0;
    else {
      for (b = 0; b < PAYOUTS[a].hits.length; b++)
        (k[b].text = PAYOUTS[a].hits[b]), (q[b].text = PAYOUTS[a].pays[b]);
      b = PAYOUTS[a].hits.length;
    }
    for (; 6 > b; b++) (k[b].text = "-"), (q[b].text = "-");
  };
  this.showWin = function (a) {
    m.text = TEXT_CURRENCY + a;
  };
  this.highlightWin = function (a) {
    for (var b = 0; 6 > b; b++)
      if (k[b].text === a) {
        c = b;
        this._flicker(b);
        break;
      }
  };
  this._flicker = function (a) {
    b = 1 === b ? 0 : 1;
    createjs.Tween.get(k[a]).to({ alpha: b }, 250, createjs.Ease.cubicOut);
    createjs.Tween.get(q[a])
      .to({ alpha: b }, 250, createjs.Ease.cubicOut)
      .call(function () {
        n._flicker(a);
      });
  };
  this.stopHighlight = function () {
    k[c] &&
      (createjs.Tween.removeTweens(k[c]),
      createjs.Tween.removeTweens(q[c]),
      (k[c].alpha = 1),
      (q[c].alpha = 1));
  };
  n = this;
  this._init(a, d);
}
function CPreloader() {
  var a, d, b, c, f, e, g;
  this._init = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.png");
    s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
    s_oSpriteLibrary.loadSprites();
    g = new createjs.Container();
    s_oStage.addChild(g);
  };
  this.unload = function () {
    g.removeAllChildren();
  };
  this.hide = function () {
    var a = this;
    setTimeout(function () {
      createjs.Tween.get(e)
        .to({ alpha: 1 }, 500)
        .call(function () {
          a.unload();
          s_oMain.gotoMenu();
        });
    }, 1e3);
  };
  this._onImagesLoaded = function () {};
  this._onAllImagesLoaded = function () {
    this.attachSprites();
    s_oMain.preloaderReady();
  };
  this.attachSprites = function () {
    var h = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    g.addChild(h);
    h = s_oSpriteLibrary.getSprite("progress_bar");
    c = createBitmap(h);
    c.x = CANVAS_WIDTH / 2 - h.width / 2;
    c.y = CANVAS_HEIGHT - 170;
    g.addChild(c);
    a = h.width;
    d = h.height;
    f = new createjs.Shape();
    f.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(c.x, c.y, 1, d);
    g.addChild(f);
    c.mask = f;
    b = new createjs.Text("", "30px " + PRIMARY_FONT, "#fff");
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT - 125;
    b.shadow = new createjs.Shadow("#000", 2, 2, 2);
    b.textBaseline = "alphabetic";
    b.textAlign = "center";
    g.addChild(b);
    e = new createjs.Shape();
    e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    e.alpha = 0;
    g.addChild(e);
  };
  this.refreshLoader = function (e) {
    b.text = e + "%";
    f.graphics.clear();
    e = Math.floor((e * a) / 100);
    f.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(c.x, c.y, e, d);
  };
  this._init();
}
function CTextButton(a, d, b, c, f, e, g) {
  var h, m, n, r, k, q, p;
  this._init = function (a, b, c, d, e, f, g) {
    h = !1;
    m = 1;
    n = [];
    r = [];
    var A = createBitmap(c),
      z = Math.ceil(g / 20);
    p = new createjs.Text(d, "bold " + g + "px " + e, "#000000");
    p.textAlign = "center";
    p.textBaseline = "alphabetic";
    var y = p.getBounds();
    p.x = c.width / 2 + z;
    p.y = Math.floor(c.height / 2) + y.height / 3 + z;
    q = new createjs.Text(d, "bold " + g + "px " + e, f);
    q.textAlign = "center";
    q.textBaseline = "alphabetic";
    y = q.getBounds();
    q.x = c.width / 2;
    q.y = Math.floor(c.height / 2) + y.height / 3;
    k = new createjs.Container();
    k.x = a;
    k.y = b;
    k.regX = c.width / 2;
    k.regY = c.height / 2;
    k.addChild(A, p, q);
    s_oStage.addChild(k);
    this._initListener();
  };
  this.unload = function () {
    k.off("mousedown");
    k.off("pressup");
    s_oStage.removeChild(k);
  };
  this.setVisible = function (a) {
    k.visible = a;
  };
  this._initListener = function () {
    oParent = this;
    k.on("mousedown", this.buttonDown);
    k.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (a, b, c) {
    n[a] = b;
    r[a] = c;
  };
  this.buttonRelease = function () {
    h ||
      ((k.scaleX = 1 * m),
      (k.scaleY = 1 * m),
      n[ON_MOUSE_UP] && n[ON_MOUSE_UP].call(r[ON_MOUSE_UP]));
  };
  this.buttonDown = function () {
    h ||
      ((k.scaleX = 0.9 * m),
      (k.scaleY = 0.9 * m),
      n[ON_MOUSE_DOWN] && n[ON_MOUSE_DOWN].call(r[ON_MOUSE_DOWN]));
  };
  this.setTextPosition = function (a) {
    q.y = a;
    p.y = a + 2;
  };
  this.setText = function (a) {
    q.text = a;
    p.text = a;
  };
  this.setPosition = function (a, b) {
    k.x = a;
    k.y = b;
  };
  this.setX = function (a) {
    k.x = a;
  };
  this.setY = function (a) {
    k.y = a;
  };
  this.getButtonImage = function () {
    return k;
  };
  this.getX = function () {
    return k.x;
  };
  this.getY = function () {
    return k.y;
  };
  this.block = function (a) {
    h = a;
  };
  this.setScale = function (a) {
    m = a;
    k.scaleX = a;
    k.scaleY = a;
  };
  this._init(a, d, b, c, f, e, g);
  return this;
}
function CTextToggle(a, d, b, c, f, e, g, h, m) {
  var n = 1,
    r,
    k = !1,
    q,
    p,
    l,
    v,
    t,
    u;
  this._init = function (a, b, c, d, e, f, g, h, k) {
    r = !1;
    q = [];
    p = [];
    u = createBitmap(c);
    var m = Math.ceil(g / 20);
    t = new createjs.Text(d, " " + g + "px " + e, "#000000");
    t.textAlign = "center";
    t.textBaseline = "alphabetic";
    var n = t.getBounds();
    t.x = c.width / 2 + m;
    t.y = Math.floor(c.height / 2) + n.height / 3 + m - 7;
    v = new createjs.Text(d, " " + g + "px " + e, f);
    v.textAlign = "center";
    v.textBaseline = "alphabetic";
    n = v.getBounds();
    v.x = c.width / 2;
    v.y = Math.floor(c.height / 2) + n.height / 3 - 7;
    l = new createjs.Container();
    l.x = a;
    l.y = b;
    l.regX = c.width / 2;
    l.regY = c.height / 2;
    h ||
      ((a = new createjs.SpriteSheet({
        images: [c],
        frames: {
          width: c.width / 2,
          height: c.height,
          regX: c.width / 2 / 2,
          regY: c.height / 2,
        },
        animations: { state_true: [0], state_false: [1] },
      })),
      (u = createSprite(
        a,
        "state_false",
        c.width / 2 / 2,
        c.height / 2,
        c.width / 2,
        c.height
      )),
      (t.x = m),
      (t.y = m + 17),
      (v.x = 0),
      (v.y = 17),
      (l.regX = 0),
      (l.regY = 0));
    l.addChild(u, t, v);
    k.addChild(l);
    this._initListener();
  };
  this.unload = function () {
    l.off("mousedown");
    l.off("pressup");
    m.removeChild(l);
  };
  this.setVisible = function (a) {
    l.visible = a;
  };
  this._initListener = function () {
    oParent = this;
    l.on("mousedown", this.buttonDown);
    l.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (a, b, c) {
    q[a] = b;
    p[a] = c;
  };
  this.buttonRelease = function () {
    r ||
      k ||
      ((l.scaleX = 1 * n),
      (l.scaleY = 1 * n),
      q[ON_MOUSE_UP] && q[ON_MOUSE_UP].call(p[ON_MOUSE_UP]));
  };
  this.buttonDown = function () {
    r ||
      k ||
      ((l.scaleX = 0.9 * n),
      (l.scaleY = 0.9 * n),
      q[ON_MOUSE_DOWN] && q[ON_MOUSE_DOWN].call(p[ON_MOUSE_DOWN]));
  };
  this.enable = function () {
    r = !1;
    h || u.gotoAndStop("state_true");
  };
  this.disable = function () {
    r = !0;
    h || u.gotoAndStop("state_false");
  };
  this.setTextPosition = function (a, b) {
    var c = Math.ceil(g / 20);
    t.x = a + c;
    t.y = b + c;
    v.x = a;
    v.y = b;
  };
  this.setText = function (a) {
    v.text = a;
    t.text = a;
  };
  this.setPosition = function (a, b) {
    l.x = a;
    l.y = b;
  };
  this.setX = function (a) {
    l.x = a;
  };
  this.setY = function (a) {
    l.y = a;
  };
  this.getButtonImage = function () {
    return l;
  };
  this.getX = function () {
    return l.x;
  };
  this.getY = function () {
    return l.y;
  };
  this.block = function (a) {
    k = a;
  };
  this.setScale = function (a) {
    n = a;
    l.scaleX = a;
    l.scaleY = a;
  };
  this.setScaleX = function (a) {
    u.scaleX = a;
  };
  this._init(a, d, b, c, f, e, g, h, m);
  return this;
}
var s_iScaleFactor = 1,
  s_iOffsetX,
  s_iOffsetY;
(function (a) {
  (jQuery.browser = jQuery.browser || {}).mobile =
    /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    );
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function () {
  sizeHandler();
});
function trace(a) {
  console.log(a);
}
function getSize(a) {
  var d = a.toLowerCase(),
    b = window.document,
    c = b.documentElement;
  if (void 0 === window["inner" + a]) a = c["client" + a];
  else if (window["inner" + a] != c["client" + a]) {
    var f = b.createElement("body");
    f.id = "vpw-test-b";
    f.style.cssText = "overflow:scroll";
    var e = b.createElement("div");
    e.id = "vpw-test-d";
    e.style.cssText = "position:absolute;top:-1000px";
    e.innerHTML =
      "<style>@media(" +
      d +
      ":" +
      c["client" + a] +
      "px){body#vpw-test-b div#vpw-test-d{" +
      d +
      ":7px!important}}</style>";
    f.appendChild(e);
    c.insertBefore(f, b.head);
    a = 7 == e["offset" + a] ? c["client" + a] : window["inner" + a];
    c.removeChild(f);
  } else a = window["inner" + a];
  return a;
}
window.addEventListener("orientationchange", onOrientationChange);
function onOrientationChange() {
  window.matchMedia("(orientation: portrait)").matches && sizeHandler();
  window.matchMedia("(orientation: landscape)").matches && sizeHandler();
}
function isIOS() {
  for (
    var a =
      "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(
        ";"
      );
    a.length;

  )
    if (navigator.platform === a.pop()) return (s_bIsIphone = !0);
  return (s_bIsIphone = !1);
}
function getIOSWindowHeight() {
  return (
    (document.documentElement.clientWidth / window.innerWidth) *
    window.innerHeight
  );
}
function getHeightOfIOSToolbars() {
  var a =
    (0 === window.orientation ? screen.height : screen.width) -
    getIOSWindowHeight();
  return 1 < a ? a : 0;
}
function sizeHandler() {
  window.scrollTo(0, 1);
  if ($("#canvas")) {
    var a;
    a = navigator.userAgent.match(/(iPad|iPhone|iPod)/g)
      ? getIOSWindowHeight()
      : getSize("Height");
    var d = getSize("Width"),
      b = Math.min(a / CANVAS_HEIGHT, d / CANVAS_WIDTH),
      c = CANVAS_WIDTH * b,
      b = CANVAS_HEIGHT * b,
      f = 0;
    b < a
      ? ((f = a - b), (b += f), (c += (CANVAS_WIDTH / CANVAS_HEIGHT) * f))
      : c < d &&
        ((f = d - c), (c += f), (b += (CANVAS_HEIGHT / CANVAS_WIDTH) * f));
    var f = a / 2 - b / 2,
      e = d / 2 - c / 2,
      g = CANVAS_WIDTH / c;
    if (e * g < -EDGEBOARD_X || f * g < -EDGEBOARD_Y)
      (b = Math.min(
        a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y),
        d / (CANVAS_WIDTH - 2 * EDGEBOARD_X)
      )),
        (c = CANVAS_WIDTH * b),
        (b *= CANVAS_HEIGHT),
        (f = (a - b) / 2),
        (e = (d - c) / 2),
        (g = CANVAS_WIDTH / c);
    s_iOffsetX = -1 * e * g;
    s_iOffsetY = -1 * f * g;
    0 <= f && (s_iOffsetY = 0);
    0 <= e && (s_iOffsetX = 0);
    null !== s_oInterface &&
      s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    null !== s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    $("#canvas").css("width", c + "px");
    $("#canvas").css("height", b + "px");
    0 > f ? $("#canvas").css("top", f + "px") : $("#canvas").css("top", "0px");
    $("#canvas").css("left", e + "px");
  }
}
function createBitmap(a, d, b) {
  var c = new createjs.Bitmap(a),
    f = new createjs.Shape();
  d && b
    ? f.graphics.beginFill("#fff").drawRect(0, 0, d, b)
    : f.graphics.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
  c.hitArea = f;
  return c;
}
function createSprite(a, d, b, c, f, e) {
  a = null !== d ? new createjs.Sprite(a, d) : new createjs.Sprite(a);
  d = new createjs.Shape();
  d.graphics.beginFill("#000000").drawRect(-b, -c, f, e);
  a.hitArea = d;
  return a;
}
function pad(a, d, b) {
  a += "";
  return a.length >= d ? a : Array(d - a.length + 1).join(b || "0") + a;
}
function randomFloatBetween(a, d, b) {
  "undefined" === typeof b && (b = 2);
  return parseFloat(Math.min(a + Math.random() * (d - a), d).toFixed(b));
}
function rotateVector2D(a, d) {
  var b = d.getX() * Math.cos(a) + d.getY() * Math.sin(a),
    c = d.getX() * -Math.sin(a) + d.getY() * Math.cos(a);
  d.set(b, c);
}
function tweenVectorsOnX(a, d, b) {
  return a + b * (d - a);
}
function shuffle(a) {
  for (var d = a.length, b, c; 0 !== d; )
    (c = Math.floor(Math.random() * d)),
      --d,
      (b = a[d]),
      (a[d] = a[c]),
      (a[c] = b);
  return a;
}
function bubbleSort(a) {
  var d;
  do {
    d = !1;
    for (var b = 0; b < a.length - 1; b++)
      a[b] > a[b + 1] &&
        ((d = a[b]), (a[b] = a[b + 1]), (a[b + 1] = d), (d = !0));
  } while (d);
}
function compare(a, d) {
  return a.index > d.index ? -1 : a.index < d.index ? 1 : 0;
}
function easeLinear(a, d, b, c) {
  return (b * a) / c + d;
}
function easeInQuad(a, d, b, c) {
  return b * (a /= c) * a + d;
}
function easeInSine(a, d, b, c) {
  return -b * Math.cos((a / c) * (Math.PI / 2)) + b + d;
}
function easeInCubic(a, d, b, c) {
  return b * (a /= c) * a * a + d;
}
function getTrajectoryPoint(a, d) {
  var b = new createjs.Point(),
    c = (1 - a) * (1 - a),
    f = a * a;
  b.x = c * d.start.x + 2 * (1 - a) * a * d.traj.x + f * d.end.x;
  b.y = c * d.start.y + 2 * (1 - a) * a * d.traj.y + f * d.end.y;
  return b;
}
function formatTime(a) {
  a /= 1e3;
  var d = Math.floor(a / 60);
  a = parseFloat(a - 60 * d).toFixed(1);
  var b = "",
    b = 10 > d ? b + ("0" + d + ":") : b + (d + ":");
  return (b = 10 > a ? b + ("0" + a) : b + a);
}
function degreesToRadians(a) {
  return (a * Math.PI) / 180;
}
function checkRectCollision(a, d) {
  var b, c;
  b = getBounds(a, 0.9);
  c = getBounds(d, 0.98);
  return calculateIntersection(b, c);
}
function calculateIntersection(a, d) {
  var b, c, f, e, g, h, m, n;
  b = a.x + (f = a.width / 2);
  c = a.y + (e = a.height / 2);
  g = d.x + (h = d.width / 2);
  m = d.y + (n = d.height / 2);
  b = Math.abs(b - g) - (f + h);
  c = Math.abs(c - m) - (e + n);
  return 0 > b && 0 > c
    ? ((b = Math.min(Math.min(a.width, d.width), -b)),
      (c = Math.min(Math.min(a.height, d.height), -c)),
      {
        x: Math.max(a.x, d.x),
        y: Math.max(a.y, d.y),
        width: b,
        height: c,
        rect1: a,
        rect2: d,
      })
    : null;
}
function getBounds(a, d) {
  var b = { x: Infinity, y: Infinity, width: 0, height: 0 };
  if (a instanceof createjs.Container) {
    b.x2 = -Infinity;
    b.y2 = -Infinity;
    var c = a.children,
      f = c.length,
      e,
      g;
    for (g = 0; g < f; g++)
      (e = getBounds(c[g], 1)),
        e.x < b.x && (b.x = e.x),
        e.y < b.y && (b.y = e.y),
        e.x + e.width > b.x2 && (b.x2 = e.x + e.width),
        e.y + e.height > b.y2 && (b.y2 = e.y + e.height);
    Infinity == b.x && (b.x = 0);
    Infinity == b.y && (b.y = 0);
    Infinity == b.x2 && (b.x2 = 0);
    Infinity == b.y2 && (b.y2 = 0);
    b.width = b.x2 - b.x;
    b.height = b.y2 - b.y;
    delete b.x2;
    delete b.y2;
  } else {
    var h, m;
    a instanceof createjs.Bitmap
      ? ((f = a.sourceRect || a.image), (g = f.width * d), (h = f.height * d))
      : a instanceof createjs.Sprite
      ? a.spriteSheet._frames &&
        a.spriteSheet._frames[a.currentFrame] &&
        a.spriteSheet._frames[a.currentFrame].image
        ? ((f = a.spriteSheet.getFrame(a.currentFrame)),
          (g = f.rect.width),
          (h = f.rect.height),
          (c = f.regX),
          (m = f.regY))
        : ((b.x = a.x || 0), (b.y = a.y || 0))
      : ((b.x = a.x || 0), (b.y = a.y || 0));
    c = c || 0;
    g = g || 0;
    m = m || 0;
    h = h || 0;
    b.regX = c;
    b.regY = m;
    f = a.localToGlobal(0 - c, 0 - m);
    e = a.localToGlobal(g - c, h - m);
    g = a.localToGlobal(g - c, 0 - m);
    c = a.localToGlobal(0 - c, h - m);
    b.x = Math.min(Math.min(Math.min(f.x, e.x), g.x), c.x);
    b.y = Math.min(Math.min(Math.min(f.y, e.y), g.y), c.y);
    b.width = Math.max(Math.max(Math.max(f.x, e.x), g.x), c.x) - b.x;
    b.height = Math.max(Math.max(Math.max(f.y, e.y), g.y), c.y) - b.y;
  }
  return b;
}
function NoClickDelay(a) {
  this.element = a;
  window.Touch && this.element.addEventListener("touchstart", this, !1);
}
function shuffle(a) {
  for (var d = a.length, b, c; 0 < d; )
    (c = Math.floor(Math.random() * d)),
      d--,
      (b = a[d]),
      (a[d] = a[c]),
      (a[c] = b);
  return a;
}
NoClickDelay.prototype = {
  handleEvent: function (a) {
    switch (a.type) {
      case "touchstart":
        this.onTouchStart(a);
        break;
      case "touchmove":
        this.onTouchMove(a);
        break;
      case "touchend":
        this.onTouchEnd(a);
    }
  },
  onTouchStart: function (a) {
    a.preventDefault();
    this.moved = !1;
    this.element.addEventListener("touchmove", this, !1);
    this.element.addEventListener("touchend", this, !1);
  },
  onTouchMove: function (a) {
    this.moved = !0;
  },
  onTouchEnd: function (a) {
    this.element.removeEventListener("touchmove", this, !1);
    this.element.removeEventListener("touchend", this, !1);
    if (!this.moved) {
      a = document.elementFromPoint(
        a.changedTouches[0].clientX,
        a.changedTouches[0].clientY
      );
      3 == a.nodeType && (a = a.parentNode);
      var d = document.createEvent("MouseEvents");
      d.initEvent("click", !0, !0);
      a.dispatchEvent(d);
    }
  },
};
(function () {
  function a(a) {
    var c = {
      focus: "visible",
      focusin: "visible",
      pageshow: "visible",
      blur: "hidden",
      focusout: "hidden",
      pagehide: "hidden",
    };
    a = a || window.event;
    a.type in c
      ? (document.body.className = c[a.type])
      : ((document.body.className = this[d] ? "hidden" : "visible"),
        "hidden" === document.body.className
          ? s_oMain.stopUpdate()
          : s_oMain.startUpdate());
  }
  var d = "hidden";
  d in document
    ? document.addEventListener("visibilitychange", a)
    : (d = "mozHidden") in document
    ? document.addEventListener("mozvisibilitychange", a)
    : (d = "webkitHidden") in document
    ? document.addEventListener("webkitvisibilitychange", a)
    : (d = "msHidden") in document
    ? document.addEventListener("msvisibilitychange", a)
    : "onfocusin" in document
    ? (document.onfocusin = document.onfocusout = a)
    : (window.onpageshow =
        window.onpagehide =
        window.onfocus =
        window.onblur =
          a);
})();
function ctlArcadeResume() {
  null !== s_oMain && s_oMain.startUpdate();
}
function ctlArcadePause() {
  null !== s_oMain && s_oMain.stopUpdate();
}
function getParamValue(a) {
  for (
    var d = window.location.search.substring(1).split("&"), b = 0;
    b < d.length;
    b++
  ) {
    var c = d[b].split("=");
    if (c[0] == a) return c[1];
  }
}
function CToggle(a, d, b, c) {
  var f, e, g, h;
  this._init = function (a, b, c, d) {
    e = [];
    g = [];
    var q = new createjs.SpriteSheet({
      images: [c],
      frames: {
        width: c.width / 2,
        height: c.height,
        regX: c.width / 2 / 2,
        regY: c.height / 2,
      },
      animations: { state_true: [0], state_false: [1] },
    });
    f = d;
    h = createSprite(
      q,
      "state_" + f,
      c.width / 2 / 2,
      c.height / 2,
      c.width / 2,
      c.height
    );
    h.x = a;
    h.y = b;
    h.stop();
    s_oStage.addChild(h);
    this._initListener();
  };
  this.unload = function () {
    h.off("mousedown", this.buttonDown);
    h.off("pressup", this.buttonRelease);
    s_oStage.removeChild(h);
  };
  this._initListener = function () {
    h.on("mousedown", this.buttonDown);
    h.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (a, b, c) {
    e[a] = b;
    g[a] = c;
  };
  this.setActive = function (a) {
    f = a;
    h.gotoAndStop("state_" + f);
  };
  this.buttonRelease = function () {
    h.scaleX = 1;
    h.scaleY = 1;
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      createjs.Sound.play("click");
    f = !f;
    h.gotoAndStop("state_" + f);
    e[ON_MOUSE_UP] && e[ON_MOUSE_UP].call(g[ON_MOUSE_UP], f);
  };
  this.buttonDown = function () {
    h.scaleX = 0.9;
    h.scaleY = 0.9;
    e[ON_MOUSE_DOWN] && e[ON_MOUSE_DOWN].call(g[ON_MOUSE_DOWN]);
  };
  this.setPosition = function (a, b) {
    h.x = a;
    h.y = b;
  };
  this._init(a, d, b, c);
}
var CANVAS_WIDTH = 1920,
  CANVAS_HEIGHT = 1080,
  EDGEBOARD_X = 250,
  EDGEBOARD_Y = 80,
  FPS_TIME = 1e3 / 24,
  DISABLE_SOUND_MOBILE = !1,
  PRIMARY_FONT = "Lora",
  SECONDARY_FONT = "Arial",
  STATE_LOADING = 0,
  STATE_MENU = 1,
  STATE_HELP = 1,
  STATE_GAME = 3,
  ON_MOUSE_DOWN = 0,
  ON_MOUSE_UP = 1,
  ON_MOUSE_OVER = 2,
  ON_MOUSE_OUT = 3,
  ON_DRAG_START = 4,
  ON_DRAG_END = 5,
  NUM_DIFFERENT_BALLS = 5,
  ANIMATION_SPEED,
  WIN_OCCURRENCE = [],
  PAYOUTS = [],
  BANK,
  START_PLAYER_MONEY,
  BET = [],
  BET = [0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5];
function CSpriteLibrary() {
  var a, d, b, c, f, e;
  this.init = function (g, h, m) {
    b = d = 0;
    c = g;
    f = h;
    e = m;
    a = {};
  };
  this.addSprite = function (b, c) {
    a.hasOwnProperty(b) || ((a[b] = { szPath: c, oSprite: new Image() }), d++);
  };
  this.getSprite = function (b) {
    return a.hasOwnProperty(b) ? a[b].oSprite : null;
  };
  this._onSpritesLoaded = function () {
    f.call(e);
  };
  this._onSpriteLoaded = function () {
    c.call(e);
    ++b == d && this._onSpritesLoaded();
  };
  this.loadSprites = function () {
    for (var b in a)
      (a[b].oSprite.oSpriteLibrary = this),
        (a[b].oSprite.onload = function () {
          this.oSpriteLibrary._onSpriteLoaded();
        }),
        (a[b].oSprite.src = a[b].szPath);
  };
  this.getNumSprites = function () {
    return d;
  };
}
