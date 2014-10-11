var PlayScene = cc.Scene.extend({
  space: null,
  gameLayer: null,
  shapesToRemove: [],

  // init space of chipmunk
  initPhysics: function() {
    // 1.new space object
    this.space = new cp.Space();
    // 2.set up the gravity
    this.space.gravity = cp.v(0, -350);
    // 3.set up walls
    var wallBottom = new cp.SegmentShape(
      this.space.staticBody,
      cp.v(0, g_groundHight), // start point
      cp.v(4294967295, g_groundHight), // MAX INT: 4294967295
      0
    ); // thickness of wall
    this.space.addStaticShape(wallBottom);

    // setup chipmunk CollisionHandler
    this.space.addCollisionHandler(
      SpriteTag.runner,
      SpriteTag.coin,
      this.collisionCoinBegin.bind(this),
      null,
      null,
      null
    );
    this.space.addCollisionHandler(
      SpriteTag.runner,
      SpriteTag.rock,
      this.collisionRockBegin.bind(this),
      null,
      null,
      null
    );
  },

  collisionCoinBegin: function(arbiter, space) {
    var shapes = arbiter.getShapes();
    // shapes[0] is runner
    this.shapesToRemove.push(shapes[1]);

    // pickup coin music
    cc.audioEngine.playEffect(res.pickup_coin_mp3);

    var statusLayer = this.getChildByTag(TagOfLayer.Status);
    statusLayer.addCoin(1);
  },

  collisionRockBegin: function(arbiter, space) {
    cc.log("==game over");

    // stop bg music
    cc.audioEngine.stopMusic();

    cc.director.pause();
    this.addChild(new GameOverLayer());
  },

  onEnter: function() {
    this._super();
    this.initPhysics();

    // add three layer in the right order
    // this.addChild(new BackgroundLayer());
    // this.addChild(new AnimationLayer(this.space));
    // this.addChild(new StatusLayer());

    this.gameLayer = new cc.Layer();

    this.gameLayer.addChild(new BackgroundLayer(this.space), 0, TagOfLayer.background);
    this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);
    this.addChild(this.gameLayer);
    this.addChild(new StatusLayer(), 0, TagOfLayer.Status);

    // add background music
    cc.audioEngine.playMusic(res.background_mp3, true);

    this.scheduleUpdate();
  },

  update: function(dt) {
    // chipmunk step
    this.space.step(dt);

    // Simulation cpSpaceAddPostStepCallback
    for (var i = 0; i < this.shapesToRemove.length; i++) {
      var shape = this.shapesToRemove[i];
      this.gameLayer.getChildByTag(TagOfLayer.background).removeObjectByShape(shape);
    }
    this.shapesToRemove = [];

    var animationLayer = this.gameLayer.getChildByTag(TagOfLayer.Animation);
    var eyeX = animationLayer.getEyeX();

    this.gameLayer.setPosition(cc.p(-eyeX, 0));
  }
});
