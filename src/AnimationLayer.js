// define enum for runner status
if (typeof RunnerStat == 'undefined') {
  var RunnerStat = {};
  RunnerStat.running = 0;
  RunnerStat.jumpUp = 1;
  RunnerStat.jumpDown = 2;
}

var AnimationLayer = cc.Layer.extend({
  spriteSheet: null,
  runningAction: null,
  sprite: null,
  space: null,
  body: null,
  shape: null,

  recognizer: null,
  stat: RunnerStat.running, // init with running status
  jumpUpAction: null,
  jumpDownAction: null,

  ctor: function(space) {
    this._super();
    this.space = space;
    this.init();

    this._debugNode = new cc.PhysicsDebugNode(this.space);
    this._debugNode.setVisible(false);
    // parallax ratio and offset
    this.addChild(this._debugNode, 10);
  },

  init: function() {
    this._super();

    // create sprite sheet
    cc.spriteFrameCache.addSpriteFrames(res.runner_plist);
    this.spriteSheet = new cc.SpriteBatchNode(res.runner_png);
    this.addChild(this.spriteSheet);

    // init runningAction
    // var animFrames = [];
    // for (var i = 0; i < 8; i++) {
      // var str = 'runner' + i + '.png';
      // var frame = cc.spriteFrameCache.getSpriteFrame(str);
      // animFrames.push(frame);
    // }

    // var animation = new cc.Animation(animFrames, 0.1);
    // this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
    // this.sprite = new cc.Sprite('#runner0.png');
    // this.sprite.attr({x: 80, y: 85});

    // init actions
    this.initAction();

    // 1.create physics sprite with a sprite frame name
    this.sprite = new cc.PhysicsSprite("#runner0.png");
    var contentSize = this.sprite.getContentSize();
    // 2.init the runner physics body
    this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
    // 3.set the position of the runner
    this.body.p = cc.p(g_runnerStartX, g_groundHight + contentSize.height / 2);
    // 4.apply impulse to the body
    this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0)); // run speed
    // 5.add the created body to space
    this.space.addBody(this.body);
    // 6.create the shape for the body
    this.shape = new cp.BoxShape(this.body, contentSize.width - 14, contentSize.height);
    // 7.add shape to space
    this.space.addShape(this.shape);
    // 8.set body to the physics sprite
    this.sprite.setBody(this.body);

    // run action
    // this.sprite.runAction(this.runningAction);
    this.spriteSheet.addChild(this.sprite);

    // initialize the recognizer
    this.recognizer = new SimpleRecognizer();

    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded
    }, this);

    this.scheduleUpdate();
  },

  onExit: function() {
    this.runningAction.release();
    this.jumpUpAction.release();
    this.jumpDownAction.release();

    this._super();
  },

  initAction: function() {
    // init runningAction
    var animFrames = [];
    // num equal to spriteSheet
    for (var i = 0; i < 8; i++) {
      var str = 'runner' + i + '.png';
      var frame = cc.spriteFrameCache.getSpriteFrame(str);
      animFrames.push(frame);
    }

    var animation = new cc.Animation(animFrames, 0.1);
    this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
    this.runningAction.retain();

    // init jumpupAction
    animFrames = [];
    for (var i = 0; i < 4; i++) {
      var str = 'runnerJumpUp' + i + '.png';
      var frame = cc.spriteFrameCache.getSpriteFrame(str);
      animFrames.push(frame);
    }

    animation = new cc.Animation(animFrames, 0.2);
    this.jumpUpAction = new cc.Animate(animation);
    this.jumpUpAction.retain();

    // init jumpDownAction
    animFrames = [];
    for (var i = 0; i < 2; i++) {
      var str = 'runnerJumpDown' + i +'.png';
      var frame = cc.spriteFrameCache.getSpriteFrame(str);
      animFrames.push(frame);
    }

    animation = new cc.Animation(animFrames, 0.3);
    this.jumpDownAction = new cc.Animate(animation);
    this.jumpDownAction.retain();
  },

  onTouchBegan: function(touch, event) {
    var pos = touch.getLocation();
    event.getCurrentTarget().recognizer.beginPoint(pos.x, pos.y);
    return true;
  },

  onTouchMoved: function(touch, event) {
    var pos = touch.getLocation();
    event.getCurrentTarget().recognizer.movePoint(pos.x, pos.y);
  },

  onTouchEnded: function(touch, event) {
    var rtn = event.getCurrentTarget().recognizer.endPoint();
    cc.log('rnt = ' + rtn);
    switch (rtn) {
      case 'up':
        event.getCurrentTarget().jump();
        break;
      default:
        break;
    }
  },

  jump: function() {
    cc.log('jump');

    if (this.stat == RunnerStat.running) {
      this.body.applyImpulse(cp.v(0, 250), cp.v(0, 0));
      this.stat = RunnerStat.jumpUp;
      this.sprite.stopAllActions();
      this.sprite.runAction(this.jumpUpAction);
      // jump music
      cc.audioEngine.playEffect(res.jump_mp3);
    }
  },

  getEyeX: function() {
    return this.sprite.getPositionX() - g_runnerStartX;
  },

  update: function(dt) {
    // update meter
    var statusLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Status);
    statusLayer.updateMeter(this.sprite.getPositionX() - g_runnerStartX);

    // check and update runner stat
    var vel = this.body.getVel();
    if (this.stat == RunnerStat.jumpUp) {
      if (vel.y < 0.1) {
        this.stat = RunnerStat.jumpDown;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.jumpDownAction);
      }
    } else if (this.stat == RunnerStat.jumpDown) {
      if (vel.y == 0) {
        this.stat = RunnerStat.running;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.runningAction);
      }
    }

    // var eyeX = this.sprite.getPositionX() - g_runnerStartX;
    // var camera = this.getCamera();
    // var eyeZ = cc.Camera.getZEye();
    // camera.setEye(eyeX, 0, eyeZ);
    // camera.setCenter(eyeX, 0, 0);
  }
});
