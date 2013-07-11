#!/usr/bin/gjs

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Webkit = imports.gi.WebKit2;

const Spotty = new Lang.Class({
    Name: 'Spotty',

    _init: function() {
        this.application = new Gtk.Application();

        this.application.connect('activate', Lang.bind(this, this._onActivate));
        this.application.connect('startup', Lang.bind(this, this._onStartup));
    },

    _onActivate: function() {
        this._window.present();
    },

    _onStartup: function() {
        this._buildUI();
    },

    _buildUI: function() {

        this._window = new Gtk.ApplicationWindow({
            application: this.application,
            title: "Spotty",
            default_width: 1294,
            default_height: 800,
            window_position: Gtk.WindowPosition.CENTER });

        var cacheDir = GLib.get_user_cache_dir() + "/spotty-gnome";
        GLib.mkdir_with_parents(cacheDir, parseInt("755", 8));
        var cookiesFile = cacheDir + "/cookies.txt";
        var context = Webkit.WebContext.get_default();
        var cookieManager = context.get_cookie_manager();
        cookieManager.set_persistent_storage(cookiesFile, Webkit.CookiePersistentStorage.TEXT);

	    Gio.DBus.session.watch_name("org.gnome.SettingsDaemon", Gio.BusNameWatcherFlags.NONE,
            Lang.bind(this, this._onBusNameAppeared), function() {}, null);

        this._webView = new Webkit.WebView();
        this._webView.load_uri("https://play.spotify.com/");

        this._scrolled = new Gtk.ScrolledWindow();
        this._scrolled.add(this._webView);

        this._window.add(this._scrolled);
        this._window.show_all();
    },

    _onBusNameAppeared: function(connection, name, nameOwner, data) {
        var proxy = Gio.DBusProxy.new_for_bus_sync(Gio.BusType.SESSION,
                Gio.DBusProxyFlags.DO_NOT_LOAD_PROPERTIES | Gio.DBusProxyFlags.DO_NOT_AUTO_START,
                null,
                "org.gnome.SettingsDaemon",
                "/org/gnome/SettingsDaemon/MediaKeys",
                "org.gnome.SettingsDaemon.MediaKeys",
                null);
        if (proxy == null) {
            log("Media keys will not work (could not get proxy for DBus interface).");
            return;
        }
        proxy.call("GrabMediaPlayerKeys",
                new GLib.Variant("(su)", "Spotty"),
                Gio.DBusCallFlags.NONE, -1, null,
                function (proxy, result) {
                    var value = proxy.call_finish(result);
                    if (value == null) {
                        log("Media keys will not work (grab failed).");
                    }
                });
        proxy.connect("g-signal", Lang.bind(this, this._onMediaPlayerKeyPressed));
    },

    _onMediaPlayerKeyPressed: function(proxy, senderName, signalName, parameters, data) {
        if (signalName != "MediaPlayerKeyPressed") {
            return;
        }
        var params = parameters.deep_unpack();
        var key = params[1];
        if (key == "Play" || key == "Pause") {
            this._clickPlayerButton("play-pause");
        } else if (key == "Next") {
            this._clickPlayerButton("next");
        } else if (key == "Previous") {
            this._clickPlayerButton("previous");
        }
    },

    _clickPlayerButton: function(id) {
        var js = "var player = document.getElementById('app-player'); " +
                 "if (player != null) player.contentWindow.document.getElementById('" + id + "').click();";
	    this._webView.run_javascript(js, null, null);
    },

});

// Run the application
let app = new Spotty();
app.application.run(ARGV);

// vim: set et sw=4 ts=4 smarttab:
