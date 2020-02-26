// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const tileSize = 64;

cc.Class({
    extends: cc.Component,

    properties: {
        coinsOffsetMin: 100,
        coinsOffsetMax: 200,
        diamond: {
            default: null,
            type: cc.Prefab
        },
        tile: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    init(tilesCount, x, y) {
        this.active = true;
        this.node.removeAllChildren();

        // put the node in the desired position
        this.node.setPosition(cc.v2(x, y));

        // create the number of tiles we need
        for (let i = 0; i < tilesCount; i++) {
            // initialize the node from the prefab
            const tile = cc.instantiate(this.tile);
            // make the created node a child of the component's node
            this.node.addChild(tile);
            // set it to the correct position
            tile.setPosition(i * tile.width, 0);
        }

        // update the size of the node
        this.node.width = tileSize * tilesCount;
        this.node.height = tileSize;

        // update the collider size
        let collider = this.node.getComponent(cc.PhysicsBoxCollider);
        collider.size.width = this.node.width;
        collider.size.height = this.node.height;

        collider.offset.x = this.node.width / 2 - tileSize / 2;

        collider.apply();

        this.createDiamonds();
    },

    createDiamonds() {
        const y = this.coinsOffsetMin + Math.random() * (this.coinsOffsetMax - this.coinsOffsetMin);

        this.node.children.forEach(tile => {
            if (Math.random() <= 0.4) {
                const diamond = cc.instantiate(this.diamond);
                tile.addChild(diamond);
                diamond.setPosition(0, y);
            }
        });
    },

    update (dt) {
        if (this.active) {
            this.node.x -= 150 * dt;

            const platformRight = this.node.x + this.node.width;

            if (platformRight < -cc.winSize.width / 2) {
                this.active = false;
            }
        }
    },

});
