/*  variable of the game */
var gameLevelData;
var game_data = {
    "total_level": 5000,
    "level": 1,
    "sound": true,
    "upgrade_price": 1.5,
    "coin": 0,
    "coin_price": 20,
    "power_price": 30,
    "cur_coin": 0,
    "life": 1,
    "player_data": {
        "unlocked_ship": 1,
        "selected_ship": 1
    },
    "upgrades": {
        "ship": [
            {
                "fire_power": 1,
                "fire_rate": 1
            },
            {
                "fire_power": 1,
                "fire_rate": 1
            },
            {
                "fire_power": 1,
                "fire_rate": 1
            },
            {
                "fire_power": 1,
                "fire_rate": 1
            },
            {
                "fire_power": 1,
                "fire_rate": 1
            }
        ],
        "coin_value": 1,
        "bonus_value": 1
    },
    "ship_price": [
        0,
        1000,
        20000,
        50000
    ],
};
var global_state = "ready";
var cur_coin = 0;



/* i don't know why */
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function (a) {
    var h = function () { };
    h.prototype = a;
    return new h
};
$jscomp.underscoreProtoCanBeSet = function () {
    var a = {
        a: !0
    },
        h = {};
    try {
        return h.__proto__ = a, h.a
    } catch (m) { }
    return !1
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (a, h) {
    a.__proto__ = h;
    if (a.__proto__ !== h) throw new TypeError(a + " is not extensible");
    return a
} : null;
$jscomp.inherits = function (a, h) {
    a.prototype = $jscomp.objectCreate(h.prototype);
    a.prototype.constructor = a;
    if ($jscomp.setPrototypeOf) {
        var m = $jscomp.setPrototypeOf;
        m(a, h)
    } else
        for (m in h)
            if ("prototype" != m)
                if (Object.defineProperties) {
                    var l = Object.getOwnPropertyDescriptor(h, m);
                    l && Object.defineProperty(a, m, l)
                } else a[m] = h[m];
    a.superClass_ = h.prototype
};


/* maybe for boot/reboot the game */
var Boot = function () { return Phaser.Scene.call(this, "boot") || this };
$jscomp.inherits(Boot, Phaser.Scene);
Boot.prototype.preload = function () {


    var gameDataParams;
    // Check for saved data
    var savedData = localStorage.getItem('savedGameData');
    if (savedData) {
        gameDataParams = JSON.parse(savedData);
    } else {
        // Use dummy data if no saved data exists
        gameDataParams = getDummyData();
    }

    gameLevelData = gameDataParams.game_level_data;
    // Assign saved game_data properties
    game_data.level = gameDataParams.game_data.level;
    game_data.life = gameDataParams.game_data.life;
    game_data.coin = gameDataParams.game_data.coin;
    game_data.cur_coin = gameDataParams.game_data.cur_coin;
    game_data.sound = gameDataParams.game_data.sound;
    game_data.player_data = gameDataParams.game_data.player_data;



    var a = this;
    this.load.image("bg", "../assets/bg.png");
    this.load.image("loader", "../assets/bg_load.png");
    this.load.image("game_title", "../assets/game_title.png");
    this.load.image("btn_start", "../assets/btn_start.png");
    this.load.on("complete", function () {
        a.scale.stopListeners();
        a.scene.start("preload")
    }, this)
};



/* maybe for load/preload the game */
var Load = function () { return Phaser.Scene.call(this, "preload") || this };
$jscomp.inherits(Load, Phaser.Scene);
Load.prototype.preload = function () {
    var a = this;
    this.add.sprite(360, 540, "loader");
    var h = this.add.rectangle(config.width / 0, 0, 0, 0);
    h.setStrokeStyle(0, 0);
    h.alpha = .7;
    var m = this.add.rectangle(config.width / 0, 0, 0, 0, 0);
    m.alpha = .8;
    this.load.on("progress", function (a) {
        m.width = 0 * a
    });
    this.load.on("complete", function () {
        h.destroy();
        m.destroy();
        a.scene.start("game")
        integration.alert("preload_complete", "");
        document.getElementById("loader").style.display = "none";
    }, this);
    this.input.on("gameobjectdown",
        function () {
            a.scene.start("game")
        }, this);
    for (var l = 1; 4 >= l; l++) this.load.image("ship" + l, "../assets/ship" + l + ".png"), this.load.image("enemy" + l, "../assets/enemy" + l + ".png");
    this.load.image("loader", "../assets/bg_load.png");
    this.load.image("level_bar", "../assets/level_bar.png");
    this.load.image("popup", "../assets/popup.png");
    this.load.image("hit", "../assets/hit.png");
    this.load.image("coin", "../assets/coin.png");
    this.load.image("coin_icon", "../assets/coin_icon.png");
    this.load.image("bullet_icon", "../assets/bullet_icon.png");
    this.load.image("progress", "../assets/progress.png");
    this.load.image("progressbar", "../assets/progressbar.png");
    this.load.image("coin_bar", "../assets/coin_bar.png");
    this.load.image("power_bar", "../assets/power_bar.png");
    this.load.image("diamond_bar", "../assets/diamond_bar.png");
    this.load.image("btn_setting", "../assets/btn_setting.png");
    this.load.image("btn_tab", "../assets/btn_tab.png");
    this.load.image("btn_list", "../assets/btn_list.png");
    this.load.image("btn_ship", "../assets/btn_ship.png");
    this.load.image("btn_play", "../assets/btn_play.png");
    this.load.image("btn_on", "../assets/btn_on.png");
    this.load.image("btn_off", "../assets/btn_off.png");
    this.load.image("btn_close", "../assets/btn_close.png");
    this.load.image("btn_collect", "../assets/btn_collect.png");
    this.load.image("btn_ship_active", "../assets/btn_ship_active.png");
    this.load.spritesheet("bullet", "../assets/bullet.png", {
        frameWidth: 19,
        frameHeight: 34
    });
    this.load.spritesheet("explosion", "../assets/explosion.png", {
        frameWidth: 380,
        frameHeight: 380
    });
    this.load.spritesheet("powerups", "../assets/powerups.png", {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.spritesheet("power_active", "../assets/power_active.png", {
        frameWidth: 64,
        frameHeight: 64
    });

    this.load.audio("hit", "../audio/hit.mp3");
    this.load.audio("shoot", "../audio/shoot.mp3");
    this.load.audio("powerup", "../audio/powerup.mp3");
    this.load.audio("explosion", "../audio/explosion.mp3");
    this.load.audio("finish", "../audio/finish.mp3");
    this.load.audio("collect", "../audio/collect.mp3");
    this.load.audio("click", "../audio/click.mp3");
    this.load.audio("upgrade", "../audio/upgrade.mp3");
    this.load.audio("EpicArpg", "../audio/EpicArpg.mp3");
    this.load.audio("coin", "../audio/coin.mp3");
};



/* maybe for load game UI functions */
var UI = function () { return Phaser.Scene.call(this, "ui") || this };
$jscomp.inherits(UI, Phaser.Scene);
UI.prototype.create = function () {

    function a(g, d) {
        for (var a = 0; a < d; a++) g *= game_data.upgrade_price;
        return Math.round(g)
    }

    function h(g) {
        var d = !1;
        if ("fire_power" === g || "fire_rate" === g) {
            var n = a(game_data.power_price + 30 * (game_data.player_data.selected_ship - 1), game_data.upgrades.ship[game_data.player_data.selected_ship][g]);
            n <= game_data.coin ? (game_data.coin -= n, z.setText(l(game_data.coin)), d = !0) : alert("No enough coin!")
        }
        if ("coin_value" === g || "bonus_value" === g) n = a(game_data.coin_price, game_data.upgrades[g]), n <=
            game_data.coin ? (game_data.coin -= n, z.setText(l(game_data.coin)), d = !0) : alert("No enough coin!");
        if (d) {
            play_sound("upgrade", k);
            "coin_value" === g || "bonus_value" === g ? game_data.upgrades[g]++ : game_data.upgrades.ship[game_data.player_data.selected_ship][g]++;
            var f, e;
            d = y.getLength();
            n = y.getChildren();
            for (var b = 0; b < d; b++) n[b].name === "txt_" + g && (f = n[b]), n[b].name === "cost_" + g && (e = n[b]);
            if ("fire_power" === g) {
                var h = "FIRE POWER [ LVL " + game_data.upgrades.ship[game_data.player_data.selected_ship].fire_power + " ]";
                var m =
                    l(a(game_data.power_price + 30 * (game_data.player_data.selected_ship - 1), game_data.upgrades.ship[game_data.player_data.selected_ship].fire_power))
            } else "fire_rate" === g ? (h = "FIRE RATE [ LVL " + game_data.upgrades.ship[game_data.player_data.selected_ship].fire_rate + " ]", m = l(a(game_data.power_price + 30 * (game_data.player_data.selected_ship - 1), game_data.upgrades.ship[game_data.player_data.selected_ship].fire_rate))) : "coin_value" === g ? (h = "COIN VALUE [ LVL " + game_data.upgrades.coin_value + " ]", m = l(a(game_data.coin_price,
                game_data.upgrades.coin_value))) : "bonus_value" === g && (h = "BONUS VALUE [ LVL " + game_data.upgrades.bonus_value + " ]", m = l(a(game_data.coin_price, game_data.upgrades.bonus_value)));
            f.setText(h);
            e.setText(m);
        }
    }

    function m(g) {
        A.clear(!0, !0);
        y.clear(!0, !0);
        if (G != g) {
            G = g;
            var d = 340;
            if ("ship" === g)
                for (d = 268, g = 0; 4 > g; g++) {
                    var n = draw_button(155 + 140 * g, 843, "ship", k);
                    n.name = "select_ship";
                    n.id = g + 1;
                    n.selected = !1;
                    g + 1 == game_data.player_data.selected_ship && (n.setTexture("btn_ship_active"), n.selected = !0);
                    A.add(n);
                    if (4 >
                        g) {
                        var f = k.add.sprite(n.x, n.y, "ship" + (g + 1));
                        f.name = "ship_icon" + (g + 1);
                        g >= game_data.player_data.unlocked_ship && (f.alpha = .7, n.alpha = .7);
                        A.add(f)
                    } else n.alpha = .7
                } else {
                n = draw_button(360, 850, "list", k);
                f = draw_button(360, 750, "list", k);
                var h = k.add.text(50, 850, "", {
                    fontFamily: "impact",
                    fontSize: 30,
                    align: "left",
                    color: "#e3f5f4"
                }).setOrigin(0, .5),
                    b = k.add.text(50, 750, "", {
                        fontFamily: "impact",
                        fontSize: 30,
                        align: "left",
                        color: "#e3f5f4"
                    }).setOrigin(0, .5),
                    e = k.add.text(580, 850, "", {
                        fontFamily: "impact",
                        fontSize: 30,
                        align: "left",
                        color: "#e3f5f4"
                    }).setOrigin(0, .5),
                    m = k.add.text(580, 750, "", {
                        fontFamily: "impact",
                        fontSize: 30,
                        align: "left",
                        color: "#e3f5f4"
                    }).setOrigin(0, .5);
                "power" === g ? (n.name = "fire_rate", f.name = "fire_power", h.name = "txt_fire_rate", b.name = "txt_fire_power", e.name = "cost_fire_rate", m.name = "cost_fire_power", h.setText("FIRE RATE [ LVL " + game_data.upgrades.ship[game_data.player_data.selected_ship].fire_rate + " ]"), b.setText("FIRE POWER [ LVL " + game_data.upgrades.ship[game_data.player_data.selected_ship].fire_power + " ]"), e.setText(l(a(game_data.power_price +
                    30 * (game_data.player_data.selected_ship - 1), game_data.upgrades.ship[game_data.player_data.selected_ship].fire_rate))), m.setText(l(a(game_data.power_price + 30 * (game_data.player_data.selected_ship - 1), game_data.upgrades.ship[game_data.player_data.selected_ship].fire_power)))) : (n.name = "bonus_value", f.name = "coin_value", h.name = "txt_bonus_value", b.name = "txt_coin_value", e.name = "cost_bonus_value", m.name = "cost_coin_value", h.setText("BONUS VALUE [ LVL " + game_data.upgrades.bonus_value + " ]"), b.setText("COIN VALUE [ LVL " +
                        game_data.upgrades.coin_value + " ]"), e.setText(l(a(game_data.coin_price, game_data.upgrades.bonus_value))), m.setText(l(a(game_data.coin_price, game_data.upgrades.coin_value))));
                y.addMultiple([n, f, h, b, e, m])
            }
            q.displayHeight = d
        } else G = "", q.displayHeight = 140
    }

    function l(g) {
        return 1E5 <= g ? Math.round(g / 1E3) + "k" : g
    }

    function F() {
        v = "setting";
        var g = k.add.rectangle(0, 0, 720, 1080, 0, .7).setOrigin(0),
            d = k.add.sprite(360, 540, "popup"),
            a = draw_button(500, 466, "on", k);
        a.name = "sound";
        J(a.name, a);

        var h = k.add.text(184, a.y, "Sound", {
            fontFamily: "impact",
            fontSize: 35,
            align: "left",
            color: "#e3f5f4"
        }).setOrigin(0, .5),

            e = draw_button(360, 728, "close", k);
        O.addMultiple([g, d, a, e, h])
    }

    // i don't know
    function K(g, a) {
        game_data[g] ? (game_data[g] = !1, a.setTexture("btn_off"), "audio" === myAudio.pause()) : (game_data[g] = !0, a.setTexture("btn_on"), "audio" === myAudio.play())
    }

    function J(a,
        d) {
        game_data[a] ? d.setTexture("btn_on") : d.setTexture("btn_off")
    }

    var B = this.scene.get("game"),
        k = this,
        L = this.add.container(),
        H = this.add.container(),
        A = this.add.group(),
        y = this.add.group(),
        O = this.add.group(),
        G = "",
        v = "main",
        M = !1;
    this.add.sprite(620, 1050, "coin_bar");
    this.add.sprite(439, 1050, "diamond_bar");
    draw_button(40, 1040, "setting", this);
    var z = k.add.text(590, 1048, String(l(game_data.coin)), {
        fontFamily: "impact",
        fontSize: 25,
        align: "left",
        color: "#e3f5f4"
    }).setOrigin(0, .5),
        S = k.add.text(430,
            1048, String(game_data.life), {
            fontFamily: "impact",
            fontSize: 25,
            align: "left",
            color: "#e3f5f4"
        }).setOrigin(0, .5);
    B.events.on("_update", function (a) {
        "coin" === a && z.setText(cur_coin);
        "life" === a && (0 > game_data.life && (game_data.life = 0), S.setText(game_data.life))
    });
    B.events.on("completed", function (a) {

        v = "main";
        game_data.level++;
        z.setText(l(game_data.coin));
        k.tweens.add({
            targets: H,
            y: 0,
            duration: 500,
            ease: "Sine.easeIn"
        });
        x.setVisible(!1);
        r.setVisible(!0);
        t.setVisible(!0);
        console.log(cur_coin);
        r.setText(cur_coin);
        q.displayHeight =
            140;
        G = "";
        setTimeout(function () {
            N.setText(game_data.level - 1);
            Q.setText(game_data.level);
            R.setText(game_data.level + 1)
        }, 2E3);
        game_data.coin += cur_coin;

        // Save the game data to localStorage
        localStorage.setItem('savedGameData', JSON.stringify({
            game_level_data: gameLevelData,
            game_data: game_data
        }));
        integration.alert("level_completed", JSON.stringify(game_data));

    });
    B.events.on("gameover", function (a) {

        v = "main";
        z.setText(l(game_data.coin));
        k.tweens.add({
            targets: H,
            y: 0,
            duration: 500,
            ease: "Sine.easeIn"
        });
        x.setVisible(!1);
        r.setVisible(!0);
        t.setVisible(!0);
        r.setText(cur_coin);
        q.displayHeight = 140;
        G = "";
        integration.alert("game_over", "");

    });
    B = this.add.sprite(360, 250, "game_title");
    var C = this.add.sprite(360,
        480, "level_bar"),
        N = this.add.text(207, 480, String(game_data.level - 1), {
            fontFamily: "impact",
            fontSize: .1,
            align: "center",
            color: "#e3f5f4"
        }).setOrigin(.5),
        Q = this.add.text(360, 490, String(game_data.level), {
            fontFamily: "impact",
            fontSize: 40,
            align: "center",
            color: "#e3f5f4"
        }).setOrigin(.5),
        R = this.add.text(513, 480, String(game_data.level + 1), {
            fontFamily: "impact",
            fontSize: .1,
            align: "center",
            color: "#e3f5f4"
        }).setOrigin(.5),
        x = draw_button(360, 640, "play", this),
        r = this.add.text(240, 680, "100000", {
            fontFamily: "impact",
            fontSize: 40,
            align: "left",
            color: "#e3f5f4"
        }).setOrigin(0, .5),
        t = draw_button(360, 686, "collect", this);
    r.setVisible(!1);
    t.setVisible(!1);
    this.tweens.add({
        targets: x,
        alpha: 1,
        yoyo: !0,
        duration: 300,
        loop: -1
    });
    H.add([B, C, N, Q, R, x, t, r]);
    var q = k.add.rectangle(360, 1080, 720, 140, 0).setOrigin(.5, 1);
    q.alpha = 0;
    B = this.add.sprite(-2360, 0, "tab");
    B.alpha = 0;
    C = draw_button(360, 730, "tab", this);
    C.name = "ship";
    C.alpha = 3;
    C.tab = !0;
    var I = this.add.sprite(),
        w = draw_button(-2360, 0, "tab", this);
    w.name = "";
    w.alpha = 1;
    w.tab = !0;
    var e = this.add.sprite(),
        D = draw_button(-2360, 0, "tab", this);
    D.name = "";
    D.alpha = 1;
    D.tab = !0;
    var f = this.add.sprite();
    L.add([q, B, C, I, w, e, D, f]);
    this.input.on("gameobjectdown", function (a, d) {
        if ("main" === v)
            if (d.tab) play_sound("click", k), L.iterate(function (a) {
                a.tab && (a.alpha = .7)
            }), d.alpha = 1, m(d.name);
            else {
                if (d.button)
                    if ("collect" === d.name) {
                        play_sound("collect", k);
                        var f = cur_coin = 0,
                            g = setInterval(function () {
                                var a = k.add.sprite(t.x -
                                    140, t.y, "coin");
                                k.tweens.add({
                                    targets: a,
                                    x: 560,
                                    y: 1050,
                                    duration: 600,
                                    ease: "Sine.easeIn",
                                    onComplete: function () {
                                        a.destroy(!0)
                                    }
                                });
                                f++;
                                5 === f && (x.setVisible(!0), r.setVisible(!1), t.setVisible(!1), clearInterval(g))
                            }, 100);
                        z.setText(l(game_data.coin));
                        k.tweens.add({
                            targets: L,
                            y: 0,
                            duration: 1E3,
                            ease: "Sine.easeIn"
                        });
                        integration.alert("coin_collected", "");

                        localStorage.setItem('savedGameData', JSON.stringify({
                            game_level_data: gameLevelData,
                            game_data: game_data
                        }));

                    } else if ("play" === d.name) d = function () {
                        v = "play";
                        k.events.emit("play");
                        k.tweens.add({
                            targets: H,
                            y: -800,
                            duration: 500,
                            ease: "Sine.easeOut"
                        });
                        k.tweens.add({
                            targets: L,
                            y: 1680,
                            duration: 500,
                            ease: "Sine.easeOut"
                        });
                        y.clear(!0, !0);
                        A.clear(!0, !0);

                        integration.alert("start_play", "");

                    }, game_data.level <= game_data.total_level ? d() : confirm("You've reached the last level. Do you want to start from level 1?") && (game_data.level = 1, d());
                    else if ("" === d.name || "" === d.name || "" === d.name || "" === d.name) h(d.name);
                    else if ("select_ship" === d.name) {
                        if (play_sound("click", k), y.clear(!0, !0), q.displayHeight = 268, !d.selected && 5 != d.id)
                            if (d.id <= game_data.player_data.unlocked_ship) {
                                a = A.getLength();
                                for (var e =
                                    A.getChildren(), b = 0; b < a; b++) e[b].selected && (e[b].selected = !1, e[b].setTexture("btn_ship"));
                                d.selected = !0;
                                d.setTexture("btn_ship_active");
                                game_data.player_data.selected_ship = d.id;
                            } else e = l(game_data.ship_price[d.id - 1]), d.id > game_data.player_data.unlocked_ship + 4 && (e = "-"), a = draw_button(360, 952, "list", k), "-" != e && (a.name = "buy_ship"), a.id = d.id, d = k.add.sprite(330, 952, "ship" + d.id), d.setScale(.7), e = k.add.text(573, 952, String(e), {
                                fontFamily: "impact",
                                fontSize: 20,
                                align: "left",
                                color: "#e3f5f4"
                            }).setOrigin(0,
                                .5), y.addMultiple([a, d, e]), q.displayHeight = 370
                    } else if ("buy_ship" === d.name)
                        if (game_data.ship_price[d.id - 1] <= game_data.coin) {
                            play_sound("upgrade", k);
                            game_data.coin -= game_data.ship_price[d.id - 1];
                            z.setText(l(game_data.coin));
                            game_data.player_data.unlocked_ship++;
                            a = A.getLength();
                            e = A.getChildren();
                            for (b = 0; b < a; b++) e[b].selected && (e[b].selected = !1, e[b].setTexture("btn_ship")), "select_ship" === e[b].name && e[b].id === d.id && (e[b].selected = !0, e[b].setTexture("btn_ship_active"), e[b].alpha = 1), e[b].name === "ship_icon" +
                                d.id && (e[b].alpha = 1);
                            game_data.player_data.selected_ship = d.id;
                            y.clear(!0, !0);
                            q.displayHeight = 268;

                        } else swal({
                            title: "Not Enough Stars !",
                            type: "warning",
                            showCancelButton: false,
                            cancelButtonText: "Ok",
                            closeOnConfirm: false,
                            closeOnCancel: true
                        });
                    else "setting" === d.name && (play_sound("click", k), F())
            }
        else if ("setting" === v)
            if ("close" === d.name) play_sound("click", k), O.clear(!0, !0), M ? (M = !1, v = "play", k.events.emit("resume_game")) : v = "main";
            else {
                if ("sound" === d.name) play_sound("click", k), K(d.name, d)
            }
        else "play" === v && "play" === global_state && "setting" === d.name && (play_sound("click",
            k), M = !0, F(), k.events.emit("pause_game"))
    })
};


/* maybe for load game data function */
var Game = function () { return Phaser.Scene.call(this, "game") || this };
$jscomp.inherits(Game, Phaser.Scene);
Game.prototype.create = function () {
    var a, h, m, l, F, K, J;

    // Game Play Func
    function B() {
        r.width = 350;
        r.setVisible(!1);
        x.setVisible(!1);
        J = K = F = !1;
        global_state = "ready";
        t = !0;
        I = q = 0;
        w = 1;
        m = h = a = D = 0;
        l = !1;
        f = [0, 0, 0, 0, 0];
        g && clearInterval(g);

        d = gameLevelData;
        n = d.array;
        for (var c = 0; 3 > c; c++)
            for (var p = 0; 20 > p; p++) n[c][p] && q++;
        b.ready = !0
    }

    function k() {
        console.log("spawn");
        l = !1;
        h = 0;
        g = setInterval(function () {
            if (!t) {
                for (var c = !1, p = h; 20 > p; p++) {
                    if (0 != n[a][p]) {
                        c = !0;
                        break
                    }
                    19 === p && (l = !0)
                }
                c ? n[a][h] && H(n[a][h].amount, n[a][h].type) : (l = !0, clearInterval(g));
                h++
            }
        }, 500)
    }

    function L(c, p) {
        if (20 >= Math.round(100 * Math.random())) {
            var a = Math.floor(6 * Math.random());
            5 === a && 75 >= Math.round(100 * Math.random()) && (a = 4);
            var b = e.physics.add.sprite(c, p, "powerups");
            T.add(b);
            b.setFrame(a);
            b.setCollideWorldBounds(!0);
            b.setBounce(1, 1);
            b.lifetime = 10;
            b.setVelocity(Phaser.Math.Between(-100, 150), Phaser.Math.Between(50, 100));
            setTimeout(function () {
                e.tweens.add({
                    targets: b,
                    alpha: 0,
                    duration: 2E3,
                    onComplete: function () {
                        b.destroy(!0)
                    }
                })
            },
                5E3)
        }
    }

    function H(c, p, a, b) {
        var d = [50, 120];
        2 === p ? (d[0] = 200, d[1] = 300) : 1 != p && (d = [70, 180]);
        m++;
        D++;
        var f = Math.floor(3 * Math.random()) + 1;
        b && (f = b);
        b = Math.round(400 * Math.random()) + 200;
        var g = -200;
        a && (b = a.x, g = a.y);
        a = e.physics.add.sprite(b, g, "enemy" + p);
        E.add(a);
        a.type = p;
        a.setCircle(80, 70, 70);
        a.setScale(1 / f);
        a.scale = 1 / f;
        a.sc = f;
        a.enemy = !0;
        a.setCollideWorldBounds(!0);
        a.setBounce(1, 1);
        a.life = c;
        a.def_life = c;
        z(a);
        a.id = D;
        a.rotate = 0;
        a.rotate_min = 4 * Math.random() - 3;
        a.setVelocity(Phaser.Math.Between(-100,
            150), Phaser.Math.Between(d[0], d[1]));
        J && (a.body.velocity.x /= 2, a.body.velocity.y /= 2);
        a.txt = e.add.text(a.x, a.y, v(a.life), {
            fontFamily: "impact",
            fontSize: 30,
            align: "center",
            color: "#fff"
        });
        a.txt.setOrigin(.5);
        a.txt.setScale(1 / f);
        A(a)
    }

    function A(c) {
        c.update = function () {
            this.y > config.height + 310 && (this.y = -310, 4 === this.type && (this.life += Math.round(this.life / 2), this.life > this.def_life && (this.life = this.def_life), this.txt.setText(v(this.life))));
            this.txt.setPosition(this.x, this.y);
            this.rotate += this.rotate_min;
            360 <
                this.rotate && (this.rotate = 0);
            this.rotation = Math.PI / 180 * this.rotate
        }
    }

    function y() {
        for (var c = 0; c < f.length; c++) 0 != f[c] && (f[c].bar.destroy(!0), f[c].icon.destroy(!0), f[c].rect.destroy(!0), f[c] = 0)
    }

    function O(c) {
        for (var a = E.getLength(), b = E.getChildren(), d = 0; d < a; d++) {
            var e = b[d];
            e.body.velocity.x /= c;
            e.body.velocity.y /= c
        }
    }

    function G(c) {
        var p = Math.floor(game_data.upgrades.ship[game_data.player_data.selected_ship].fire_power) + 1;
        K && (p *= 5);
        c.life -= p;
        if (0 >= c.life) {
            play_sound("explosion", e);
            L(c.x, c.y);
            cur_coin +=
                Math.round(c.def_life / 10 * (game_data.upgrades.coin_value / 10 + 1));
            e.events.emit("_update", "coin");
            var b = e.add.sprite(c.x, c.y, "explosion");
            b.setScale(c.scale);
            b.setBlendMode(Phaser.BlendModes.ADD);
            b.play("exp");
            b.on("animationcomplete", function () {
                b.destroy(!0, !0)
            });
            3 === c.type && 75 > 100 * Math.random() && (q += 2, p = c.sc, 2 >= p && (p *= 2), H(Math.round(c.def_life / 2), 1, {
                x: c.x,
                y: c.y
            }, p), H(Math.round(c.def_life / 2), 1, {
                x: c.x,
                y: c.y
            }, p));
            c.txt.destroy(!0);
            c.destroy(!0);
            I++;
            r.width = Math.round(350 - I / q * 350);
            m--;
            if (0 === m && l) {
                a++;
                p = !1;
                for (var d = 0; 20 > d; d++)
                    if (n[a][d].amount) {
                        p = !0;
                        break
                    }
                p && k()
            }
            I === q && (console.log("finish"), S())
        } else if (F && (cur_coin += Math.round(1 + game_data.upgrades.bonus_value / 10)), !c.tween) {
            play_sound("hit", e);
            if (F) {
                play_sound("coin", e);
                e.events.emit("_update", "coin");
                var f = e.add.sprite(c.x, c.y, "coin");
                e.tweens.add({
                    targets: f,
                    x: 560,
                    y: 1050,
                    duration: 1E3,
                    ease: "Back.easeIn",
                    onComplete: function () {
                        f.destroy(!0)
                    }
                })
            }
            c.y -= 10;
            c.tween = !0;
            e.tweens.add({
                targets: c,
                scaleX: c.scale - .05,
                scaleY: c.scale - .05,
                yoyo: !0,
                duration: 50,
                ease: "Linear",
                onComplete: function () {
                    c.tween = !1
                }
            });
            z(c);
            c.txt.setText(v(c.life))
        }
    }

    function v(c) {
        return String(1E3 <= c ? Math.round(c / 1E3 * 10) / 10 + "K" : Math.round(c))
    }

    function M(c) {
        var a = e.add.sprite(c.x, c.y - 30, "hit");
        a.rotation = Math.PI / 180 * Math.round(360 * Math.random());
        e.tweens.add({
            targets: a,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            ease: "Linear",
            onComplete: function () {
                a.destroy(!0)
            }
        })
    }

    function z(c) {
        var a = [16724787, 16724828, 16724858, 16724889, 16724920, 16266239, 13382655, 10695679, 7353343, 4469759, 3362559, 3369471, 3377407, 3388671, 2736895,
            2745087, 3009511, 3009471, 3009430, 3009385, 3201852, 8054837, 10476343, 14084923, 15454523, 16761915, 16747561, 16735017, 16728617
        ];
        c.color_id >= a.length - 1 ? c.color_id = 0 : c.color_id++;
        c.setTint(a[c.color_id])
    }

    function S() {
        play_sound("finish", e);
        y();
        clearInterval(g);
        global_state = "completed";
        t = !0;
        setTimeout(function () {
            e.tweens.add({
                targets: b,
                y: -100,
                duration: 1E3,
                ease: "Sine.easeIn",
                onComplete: function () {
                    r.setVisible(!1);
                    x.setVisible(!1);
                    e.events.emit("completed")
                }
            })
        }, 2E3)
    }

    function C() {
        y();
        clearInterval(g);
        global_state =
            "gameover";
        t = !0;
        b.setVisible(!1);
        O(1E3);
        setTimeout(function () {
            r.setVisible(!1);
            x.setVisible(!1);
            var c = E.getLength(),
                a = E.getChildren();
            for (--c; 0 <= c; c--) {
                var b = a[c];
                b.txt.destroy(!0, !0);
                b.destroy(!0, !0)
            }
            e.events.emit("gameover")
        }, 2E3)
    }
    this.scene.launch("ui");
    var N = this.scene.get("ui"),
        Q = new Phaser.Class({
            Extends: Phaser.Physics.Arcade.Image,
            initialize: function (c) {
                Phaser.Physics.Arcade.Image.call(this, c, 0, 0, "bullet");
                this.speed = 1E3;
                this.bullet = !0
            },
            fire: function (c, a, b, d) {
                this.setFrame(b);
                this.setPosition(c,
                    a - 50);
                this.setActive(!0);
                this.setVisible(!0);
                this.setAngle(d - 270);
                c = Phaser.Math.DegToRad(d);
                this.scene.physics.velocityFromRotation(c, this.speed, this.body.velocity);
                this.body.velocity.x *= 2;
                this.body.velocity.y *= 2
            },
            update: function (c, a) {
                0 > this.y && (this.setActive(!1), this.setVisible(!1), this.body.stop());
                if (0 > this.x || this.y > config.height) this.setActive(!1), this.setVisible(!1), this.body.stop()
            }
        }),
        R = this.add.tileSprite(0, -config.height, config.width, 2 * config.height, "bg").setOrigin(0),
        x = this.add.sprite(360,
            50, "progressbar"),
        r = this.add.tileSprite(185, 50, 350, 11, "progress").setOrigin(0, .5);
    r.setVisible(!1);
    x.setVisible(!1);
    x.setDepth(1);
    r.setDepth(1);
    var t = !0,
        q, I, w, e = this,
        D, f, g, d, n;
    e.tweens.add({
        targets: R,
        y: 0,
        duration: 25E3,
        loop: -1
    });
    var E = this.physics.add.group({
        runChildUpdate: !0
    }),
        T = this.physics.add.group({
            runChildUpdate: !0
        });
    this.add.group();
    this.anims.create({
        key: "exp",
        frames: this.anims.generateFrameNumbers("explosion"),
        frameRate: 25
    });
    var b = this.physics.add.sprite(360, config.height + 100, "ship" + game_data.player_data.selected_ship);
    b.body.setSize(30, 60, !0);
    N.events.on("play", function (c) {
        console.log("<------------ play game level -------> " + game_data.level);
        B();
        e.events.emit("_update", "coin");
        b.setTexture("ship" + game_data.player_data.selected_ship);
        b.setPosition(360, config.height + 100);
        b.setVisible(!0);
        e.tweens.add({
            targets: b,
            y: 900,
            duration: 800,
            ease: "Sine.easeOut",
            onComplete: function () {
                global_state = "play";
                t = !1;
                x.setVisible(!0);
                r.setVisible(!0)
            }
        });
        k()
    });
    N.events.on("pause_game", function () {
        "play" === global_state && e.scene.pause()
    });
    N.events.on("resume_game", function () {
        "play" ===
            global_state && e.scene.resume()
    });
    var P = !1,
        u = this.physics.add.group({
            classType: Q,
            runChildUpdate: !0
        }),
        U = 0,
        V = 0,
        W = 0,
        X = 0;
    this.physics.world.checkCollision.up = !1;
    this.physics.world.checkCollision.down = !1;
    this.physics.world.on("worldbounds", function (c, a, b, d, e) {
        b && console.log("ff")
    });
    this.physics.add.overlap(E, u, function (c, a) {
        a.bullet && (M(a), a.setActive(!1), a.setVisible(!1), a.y = -400, G(c));
        c.bullet && (M(c), c.setActive(!1), c.setVisible(!1), c.y = -400, G(a))
    });
    this.physics.add.overlap(T, b, function (c, a) {
        if ("play" ===
            global_state) {
            play_sound("powerup", e);
            c = a.frame.name;
            a.destroy(!0);
            a = -1;
            for (var b = 0; b < f.length; b++)
                if (0 != f[b] && f[b].data.type === c) {
                    a = -2;
                    f[b].data.time = 100;
                    break
                }
            if (-1 === a)
                for (b = 0; b < f.length; b++)
                    if (0 === f[b]) {
                        a = b;
                        break
                    }
            0 <= a && (0 === c ? (J = !0, O(2)) : 1 === c ? w = 3 : 2 === c ? F = !0 : 3 === c ? K = !0 : 4 === c ? w = 0 : 5 === c && (game_data.life++, e.events.emit("_update", "life"), f[a] = 0), 5 != c && (b = 120 + 80 * a, f[a] = {}, f[a].data = {
                time: 100,
                type: c
            }, f[a].bar = e.add.sprite(660, b, "power_bar"), f[a].icon = e.add.sprite(660, b - 6, "power_active"), f[a].icon.setFrame(c),
                f[a].rect = e.add.rectangle(660, b + 25, 70, 5, 10027007)))
        }
    });
    this.physics.add.overlap(E, b, function (a, b) {
        if (a.ready) {
            if (0 >= game_data.life) {
                play_sound("explosion", e);
                var c = e.add.sprite(a.x, a.y, "explosion");
                c.setScale(.4);
                c.setBlendMode(Phaser.BlendModes.ADD);
                c.play("exp");
                c.on("animationcomplete", function () {
                    c.destroy(!0, !0)
                });
                C()
            }
            game_data.life--;
            e.events.emit("_update", "life");
            a.ready = !1;
            var d = 0,
                f = setInterval(function () {
                    a.alpha = 0 === d % 2 ? 0 : 1;
                    d++;
                    25 <= d && (a.ready = !0, a.alpha = 1, clearInterval(f))
                }, 100)
        }
    });
    this.input.on("pointerdown",
        function (a) {
            U = a.x;
            V = a.y;
            W = b.x;
            X = b.y;
            P = !0
        });
    this.input.on("pointerup", function (a) {
        P = !1
    });
    this.input.on("pointerupoutside", function (a) {
        P = !1
    });
    this.input.on("pointermove", function (a) {
        if (P && "play" === global_state) {
            var c = W + (a.x - U);
            a = X + (a.y - V);
            0 > c ? c = 0 : c > config.width && (c = config.width);
            0 > a ? a = 0 : a > config.height && (a = config.height);
            b.setPosition(c, a)
        }
    });
    setInterval(function () {
        if (!t) {
            play_sound("shoot", e);
            var a = 0;
            K && (a = 1);
            for (var d = w, f = -1 * d; f <= d; f++) {
                var g = u.get();
                g && g.fire(b.x + 20 * f, b.y + 20, a, 270)
            }
            2 === game_data.player_data.selected_ship ?
                ((d = u.get()) && d.fire(b.x + 50, b.y + 40, a, 310), (d = u.get()) && d.fire(b.x - 50, b.y + 40, a, 220)) : 3 === game_data.player_data.selected_ship ? ((d = u.get()) && d.fire(b.x + 50, b.y + 40, a, 290), (d = u.get()) && d.fire(b.x - 50, b.y + 40, a, 240), (d = u.get()) && d.fire(b.x + 50, b.y + 70, a, 0), (d = u.get()) && d.fire(b.x - 50, b.y + 70, a, 180)) : 4 === game_data.player_data.selected_ship && ((d = u.get()) && d.fire(b.x + 50, b.y + 40, a, 290), (d = u.get()) && d.fire(b.x - 50, b.y + 40, a, 250), (d = u.get()) && d.fire(b.x + 50, b.y + 70, a, 320), (d = u.get()) && d.fire(b.x - 50, b.y + 70, a, 210), (d = u.get()) &&
                    d.fire(b.x + 50, b.y + 70, a, 30), (d = u.get()) && d.fire(b.x - 50, b.y + 70, a, 150))
        }
    }, 150 - game_data.upgrades.ship[game_data.player_data.selected_ship].fire_rate);
    setInterval(function () {
        if (!t)
            for (var a = 0; a < f.length; a++)
                if (0 != f[a])
                    if (f[a].data.time -= 2, 0 >= f[a].data.time) {
                        if (0 === f[a].data.type) {
                            J = !1;
                            for (var b = E.getLength(), d = E.getChildren(), e = 0; e < b; e++) {
                                var g = d[e];
                                g.body.velocity.x *= 2;
                                g.body.velocity.y *= 2
                            }
                        } else 1 === f[a].data.type ? w = 1 : 2 === f[a].data.type ? F = !1 : 3 === f[a].data.type ? K = !1 : 4 === f[a].data.type && (w = 1);
                        f[a].bar.destroy(!0);
                        f[a].icon.destroy(!0);
                        f[a].rect.destroy(!0);
                        f[a] = 0
                    } else f[a].rect.width = .7 * f[a].data.time
    }, 300);
    this.input.keyboard.on("keydown", function (a) {
        "q" === a.key && (this.physics.world.timeScale = .3)
    }, this);
    this.input.keyboard.on("keyup", function (a) {
        "q" === a.key && (this.physics.world.timeScale = 1)
    }, this)
};



/* function for play sound */
function play_sound(a, h) {
    game_data.sound && h.sound.play(a)
}


/* function for draw buttons */
function draw_button(a, h, m, l) {
    a = l.add.sprite(a, h, "btn_" + m);
    a.setInteractive();
    a.name = m;
    a.button = !0;
    return a
}



function getDummyData() {
    var gameDataParams = {};
    var dummy_level_data = '{"level":1,"id":"alienspaceshooter","array":[[{"amount":25,"type":1},{"amount":25,"type":1},{"amount":25,"type":1},{"amount":25,"type":1},0,0,0,{"amount":25,"type":1},{"amount":50,"type":1},0,0,0,{"amount":25,"type":1},0,0,0,{"amount":50,"type":1},0,0,0],[0,{"amount":25,"type":1},0,{"amount":25,"type":1},0,0,{"amount":25,"type":1},0,{"amount":50,"type":1},{"amount":25,"type":1},{"amount":25,"type":1},0,0,{"amount":25,"type":1},{"amount":25,"type":1},0,0,{"amount":50,"type":1},0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}';
    var dummy_game_data = '{"sound":true,"player_data":{"unlocked_ship":1,"selected_ship":1},"upgrades":{"ship":[{"fire_power":1,"fire_rate":1},{"fire_power":1,"fire_rate":1},{"fire_power":1,"fire_rate":1},{"fire_power":1,"fire_rate":1},{"fire_power":1,"fire_rate":1}],"coin_value":1,"bonus_value":1},"ship_price":[0,1000,20000,50000],"upgrade_price":1.13,"coin":0,"coin_price":20,"power_price":30,"level":1,"cur_coin":0,"life":1,"total_level":150}';
    gameDataParams['game_level_data'] = JSON.parse(dummy_level_data);
    gameDataParams['game_data'] = JSON.parse(dummy_game_data);
    return gameDataParams
}


/* may be for Game Page Configuration */
var config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1080,
    physics: {
        default: "arcade",
        arcade: {
            debug: !1,
            fps: 60,
            gravity: !1
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "",
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Boot, Load, Game, UI]
},
    game = new Phaser.Game(config);


