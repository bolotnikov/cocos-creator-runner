// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        jumpSpeed: cc.v2({x: 0, y: 300}),
        maxJumpDistance: 300,
        jumpSprite: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.sprite = this.node.getComponent(cc.Sprite);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, event => {
            switch(event.keyCode) {
                case cc.macro.KEY.space:
                    this.jumpKeyPressed = true;
                    break;
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, event => {
            switch(event.keyCode) {
                case cc.macro.KEY.space:
                    this.jumpKeyPressed = false;
                    this.isJumping = false;
                    break;
            }
        });

        this.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            this.jumpKeyPressed = true;
        });

        this.node.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.jumpKeyPressed = false;
            this.isJumping = false;
        });
    },

    start () {
        this.body = this.getComponent(cc.RigidBody);
        this.isJumping = false;
        this.jumpKeyPressed = false;
        this.touching = false;
        this.startJumpY = false;

    },

    onBeginContact() {
        this.touching = true;
    },

    onEndContact() {
        this.touching = false;
    },

    onCollisionEnter(other, self) {
        if (other.node.name === 'diamond') {
            other.node.destroy();
            this.node.emit('score');
        }


    },

    // onCollisionStay() {

    // },

    // onCollisionExit() {

    // }

    animate() {
        if (this.touching) {
            // hero is running on the platform
            if (!this.animation.getAnimationState('running').isPlaying) {
                this.animation.start('running');
            }
        } else {
            // the hero is jumping
            if (this.animation.getAnimationState('running').isPlaying) {
                this.animation.stop();
                this.sprite.spriteFrame = this.jumpSprite;
            }
        }
    },


    update (dt) {
        if (this.jumpKeyPressed) {
            this.jump();
        }

        this.animate();

        if (this.node.y < -cc.winSize.height / 2) {
            this.node.emit('die');
        }
    },
    jump() {
         //if hero touches the ground
         if (this.touching) {
            //  remember hero's start position
            this.startJumpY = this.node.y;
            //  set jump is not finished
            this.jumpFinished = false;
            //  set jusmp is started
            this.isJumping = true;
            //  set hero's speed on Y axis
            this.body.linearVelocity = this.jumpSpeed;
            //else if hero is jumping and jump is not finished
         } else if (this.isJumping && !this.jumpFinished) {
            const jumpDistance = this.node.y - this.startJumpY;
            //  if jump distance is not maximum
            if (jumpDistance < this.maxJumpDistance) {
                //    keep hero's Y speed
                this.body.linearVelocity = this.jumpSpeed;
            } else {
                //    finish jump
                this.jumpFinished = true;
            }
        }
    }


});
