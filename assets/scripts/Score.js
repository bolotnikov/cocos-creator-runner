let Globals = require('Globals');

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        bestScoreLabel: {
            default: null,
            type: cc.Label
        }
    },

    // onLoad () {},

    start () {
        let bestScore = localStorage.getItem('score') || 0;

        if (!bestScore || Globals.score > bestScore) {
            bestScore = Globals.score;
            localStorage.setItem('score', bestScore);
        }

        this.scoreLabel.string = `Score: ${Globals.score.toString()}`;
        this.bestScoreLabel.string = `Best Score: ${bestScore.toString()}`;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene('Game');
        });
    },

    // update (dt) {},
});
