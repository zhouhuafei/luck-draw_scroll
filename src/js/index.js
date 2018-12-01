const randomNum = require('zhf.random-num');
const sku = require('zhf.sku');

function px2rem(px) {
    return px / 37.5 + 'rem';
}

class Game {
    constructor() {
        this.init();
    }

    init() {
        const domItems = document.querySelectorAll('.prize-item');
        const domLamp = document.querySelector('.lamp');
        const domHandle = document.querySelector('.handle');
        const $remainderNum = $('.btn-remainder-num');
        const $message = $('.message');
        const $luck = $('.luck');
        const $transparent = $('.transparent');
        const $tel = $('.tel');
        const $rule = $('.rule');
        const prizeH = 267 / 2; // 一个奖品的高度
        const prizeNum = 5; // 奖品数量
        const prizeAllH = prizeH * prizeNum; // 奖品总高度
        const prizeScroll = 15; // 奖品滚动基数
        const handleMoveTime = 200; // 摇杆的动画间隔时间
        let remainder = 3; // 剩余抽奖次数
        let timer = null;
        let isClick = false; // 防止重复点击
        const noPrize = sku([[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]]);
        noPrize.forEach(function (v, i, a) {
            if (v[0] === v[1] && v[0] === v[2]) {
                a.splice(i, 1);
            }
        });
        $('.rule-btn').on('click', function () {
            $rule.addClass('rule_show');
        });
        $('.handle-btn,.btn').on('click', function () {
            if (remainder === 0) {
                messageShow('您今天的抽奖次数用完了!');
                return;
            }
            if (!(/1\d{10}/.test($tel.val()))) {
                messageShow('请输入正确的11位手机号码!');
                return;
            }
            fnHandleMove();
            if (!isClick) {
                isClick = true;
                $.ajax({
                    url: '/luck-draw_scroll/dist/views/index.html', // 待续...
                    method: 'get', // 待续...
                    data: {
                        tel: $tel.val(),
                    },
                    // dataType: 'jsonp', // 待续...
                    success: function (res) {
                        const level = 3; // 待续...
                        // const remainder = response.remainder; // 待续...
                        if (remainder === 0) {
                            messageShow('您今天的抽奖次数用完了!');
                            isClick = false;
                            return;
                        }
                        let levelResult = [];
                        if (level === 0) { // 没中奖
                            const noPrizeRandomOne = noPrize[randomNum(0, noPrize.length - 1)];
                            levelResult = levelResult.concat(noPrizeRandomOne);
                        } else {
                            for (let i = 0; i < 3; i++) {
                                levelResult.push(level);
                            }
                        }
                        selected(levelResult, remainder);
                        fnLampMove();
                        setTimeout(function () {
                            if (level === 0) { // 未中奖
                                messageShow('未中奖!');
                            } else {
                                luckShow();
                            }
                            fnLampStop();
                            fnHandleStop();
                            isClick = false;
                        }, 3400);
                        remainder--; // 删除待续...
                        $remainderNum.html(remainder);
                    },
                });
            }
        });

        // css中修改message的样式。待续...
        $('.message-close').on('click', function () {
            messageHide();
        });

        $('.luck-close').on('click', function () {
            luckHide();
        });

        function luckShow() {
            $luck.addClass('luck_show');
            $transparent.addClass('transparent_show');
        }

        function luckHide() {
            $luck.removeClass('luck_show');
            $transparent.removeClass('transparent_show');
        }

        function messageShow(text) {
            $message.addClass('message_show');
            $message.find('.message-info').html(text);
            setTimeout(function () {
                messageHide();
            }, 3000);
        }

        function messageHide() {
            $message.removeClass('message_show');
        }

        function selected(levelResult, remainder) {
            domItems.forEach(function (v, i) {
                v.style.backgroundPosition = `0 ${px2rem(-((3 - remainder + 1) * prizeScroll * prizeAllH + prizeH * (levelResult[i] - 1)))}`;
            });
        }

        function fnLampMove() {
            timer = setInterval(function () {
                domLamp.classList.toggle('lamp_selected');
            }, 80);
        }

        function fnLampStop() {
            clearInterval(timer);
        }

        function fnHandleMove() {
            setTimeout(function () {
                domHandle.classList.remove('handle_selected1');
                domHandle.classList.add('handle_selected2');
            }, handleMoveTime);
            setTimeout(function () {
                domHandle.classList.remove('handle_selected2');
                domHandle.classList.add('handle_selected3');
            }, handleMoveTime * 2);
        }

        function fnHandleStop() {
            domHandle.classList.remove('handle_selected3');
            domHandle.classList.add('handle_selected2');
            setTimeout(function () {
                domHandle.classList.remove('handle_selected2');
                domHandle.classList.add('handle_selected1');
            }, handleMoveTime);
        }
    }
}

new Game();
