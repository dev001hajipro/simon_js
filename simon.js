var game = new Phaser.Game(480, 320, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var simonSez = false; // sez == says
var currentCount = 0;
var N = 1;

var userCount = 0;
var sequence;

var loser, winner;

function preload() {
    game.load.spritesheet('item', 'assets/number-buttons2.png', 160, 160);
}
function create() {
    simon = game.add.group();
    // 上段
    for (var i = 0; i < 6; i++) {
        var item = simon.create((160 * (i % 3)), Math.floor((i / 3)) * 160 + 0, 'item', i);
        item.inputEnabled = true;
        item.input.start(0, true);
        item.events.onInputDown.add(onInputDown);
        item.events.onInputUp.add(onInputUp);
        item.events.onInputOut.add(onInputOut);
        simon.getAt(i).alpha = 0.25;
    }

//    blinkAnimation();

    // create sequence.
    sequence = Array.from({length: 16}, (v, k) =>game.rnd.integerInRange(0, 5));

    /*
    setTimeout(function() {
        console.log('simonSequence');
        simonSequence();
        intro = false;
    }, 6000); // 6秒
    */
    simonSequence();
}
function simonSequence() {
    simonSez = true;
    litSquare = sequence[currentCount]; // lit 点灯
    simon.getAt(litSquare).alpha = 1;
    timeCheck = game.time.now;

    currentCount++;
}

// 
function blinkAnimation() {
    intro = true;
    simon.forEach(o => {
        var flashing = game.add.tween(o).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 4, true);

        var final = game.add.tween(o).to({ alpha: .25 }, 500, Phaser.Easing.Linear.None, true);
        flashing.chain(final);
        flashing.start();
    });
};
function update() {
    if (simonSez) {
        console.log('update')
        if (game.time.now - timeCheck > 700 - N * 40) {
            simon.getAt(litSquare).alpha = 0.25;
            game.paused = true;

            setTimeout(function () {
                if (currentCount < N) {
                    simonSequence();
                } else {
                    simonSez = false;
                }
                game.paused = false;
            }, 400 - N * 20);
        }
    }
}
function render() {
    // タイトル
    // ゲーム終了時
}

function onInputDown(item, pointer) {
    !simonSez && (item.alpha = 1);
}
function onInputUp(item, pointer) {
    if (!simonSez) {
        item.alpha = 0.25;
        playerSequence(item);
    }
}
function playerSequence(selected) {
    correctSquare = sequence[userCount++];
    console.log(selected);
    thisSquare = simon.getIndex(selected);

    if (correctSquare == thisSquare) {
        if (userCount === N) {
            // 全てのステージクリア
            if (N === sequence.length) {
                console.log('you win');
                // todo restart.
            } else {
                userCount = 0;
                currentCount = 0;
                N++;
                simonSez = true;
            }
        }
    } else {
        // todo gameover and reset.
        console.log('todo gameover!');
    }
}
function onInputOut(item, pointer) {
    !simonSez && (item.alpha = 0.25);
}
