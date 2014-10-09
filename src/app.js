var MenuLayer = cc.Layer.extend({
  ctor: function(){
    // 1. call super class's ctor function
    this._super();
  },
  init: function(){
    // 1.call super class's super function
    this._super();

    // 2.get the screen size of your game canvas
    var winSize = cc.director.getWinSize();

    // 3.calculate the center point
    var centerPos = cc.p(winSize.width / 2, winSize.height / 2);

    // 4.create a background image and set it's position at the center of the screen
    var spriteBg = new cc.Sprite(res.helloBG_png);
    spriteBg.setPosition(centerPos);
    this.addChild(spriteBg);

    // 5.set font size
    cc.MenuItemFont.setFontSize(60);

    // 6.create a menu and assign onPlay event callback to it
    var menuItemPlay = new cc.MenuItemSprite(
      new cc.Sprite(res.start_n_png), // normal state image
      new cc.Sprite(res.start_s_png), //select state image
      this.onPlay,
      this);

    // 7.create the menu
    var menu = new cc.Menu(menuItemPlay);
    menu.setPosition(centerPos);
    this.addChild(menu);
  },

  // this is the callback when the menu is clicked
  onPlay: function(){
    cc.log("==onplay clicked");
    cc.director.runScene(new PlayScene());
  }
});

var MenuScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    var layer = new MenuLayer();
    layer.init();
    this.addChild(layer);
  }
});
