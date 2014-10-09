var StatusLayer = cc.Layer.extend({
  labelCoin: null,
  labelMeter: null,
  coins: 0,

  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    this._super();

    var winSize = cc.director.getWinSize();

    this.labelCoin = new cc.LabelTTF("Coins:0", "Helvetica", 20);
    this.labelCoin.setColor(cc.color(0, 0, 0));
    this.labelCoin.setPosition(cc.p(70, winSize.height - 20));
    this.addChild(this.labelCoin);

    this.labelMeter = new cc.LabelTTF("0M", "Helvetica", 20);
    this.labelMeter.setPosition(cc.p(winSize.width - 70, winSize.height - 20));
    this.addChild(this.labelMeter);
  }
});
