window.onload = function () {
    const cvs = document.querySelector('canvas');
    const ctx = cvs.getContext('2d');

    //---------------------------------------------------
    var clockProperties = {
        radius: null,
        secondHandLength: null
    }

    var time = {
        full: null,
        hr: null,
        min: null,
        sec: null
    }

    //---------------------------------------------------
    var secondHandPos = {
        x: null,
        y: null
    }

    var longHandPos = {
        x: null,
        y: null
    }

    var shortHandPos = {
        x: null,
        y: null
    }


    changeClock('all');
    window.onresize = function () {
        changeClock('all');
    }

    // window.onresize = changeClockradius;

    //refresh
    refresh();
    setInterval(refresh, 100)

    //---------------------------------------------------
    function changeClock(properties) {
        if (properties === 'cvsSize') {
            changeCvsSize();
        } else if (properties === 'clockRadius') {
            changeClockradius();
        } else if (properties === 'clockHands') {
            changeClockHands();
        } else if (properties === 'all') {
            changeCvsSize();
            changeClockradius();
            changeClockHands();
        }
    }

    function changeCvsSize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        cvs.width = width - 50;
        cvs.height = height - 50;
    }

    function changeClockradius() {
        clockProperties.radius = (cvs.height - 150) / 2;
        // clockProperties.radius = 150;
    }

    function changeClockHands() {
        clockProperties.secondHandLength = clockProperties.radius / 2;
    }

    function refresh() {
        //clean screen
        cvs.width = cvs.width;
        // 把(0, 0) 移動到cvs的中間
        ctx.translate(cvs.width / 2, cvs.height / 2);


        // draw circle
        ctx.lineWidth = '5';
        ctx.beginPath();
        ctx.arc(0, 0, clockProperties.radius, 0, 2 * Math.PI);
        ctx.stroke();

        // draw scale
        drawScale();

        // draw Hands
        ctx.lineJoin = 'round';
        drawSecondHand();
        drawLongHand();
        drawShortHand();

        // draw center
        ctx.fillStyle = '#4f89ff';
        ctx.beginPath();
        ctx.arc(0, 0, clockProperties.radius / 28, 0, 2 * Math.PI);
        ctx.fill();

        // get the time
        getTime();
    }

    function getTime() {
        //get the time

        let fullTime = new Date();
        time.full = fullTime;
        // =>(星期 1~7) (月份) (日期) (年分) xx:xx:xx GMT+0800 (台北標準時間)
        // 取出fullTime 中的hr, min, sec
        time.hr = fullTime.getHours();
        time.min = fullTime.getMinutes();
        time.sec = fullTime.getSeconds();
        // console.log(time.hr + ' : ' + time.min + ' : ' + time.sec);
    }

    // 繪製 秒針
    function drawSecondHand() {
        // 時鐘的一小格(一秒) = 6度)

        // 計算秒針角度
        let deg = time.sec * 6;
        let rad = Rad(deg);
        // console.log(deg);

        // 計算座標(弧度)
        // x
        secondHandPos.x = clockProperties.secondHandLength * Math.sin(rad);
        // y
        secondHandPos.y = -clockProperties.secondHandLength * Math.cos(rad);

        //繪製
        ctx.strokeStyle = '#db0000';
        ctx.lineWidth = `${clockProperties.radius / 15}`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(secondHandPos.x, secondHandPos.y);
        ctx.closePath();
        ctx.stroke();
    }

    // 繪製 分針
    function drawLongHand() {
        // (時鐘的一小格 = 6度)

        // 計算分針角度
        let deg = (time.min + time.sec / 60) * 6;
        let rad = Rad(deg);
        // console.log(deg);

        // 計算座標(弧度)
        // x
        longHandPos.x = (clockProperties.secondHandLength * 1.4) * Math.sin(rad);
        // y
        longHandPos.y = -(clockProperties.secondHandLength * 1.4) * Math.cos(rad);

        //繪製
        ctx.strokeStyle = '#232323';
        ctx.lineWidth = ctx.lineWidth / 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(longHandPos.x, longHandPos.y);
        ctx.closePath();
        ctx.stroke();
    }

    function drawShortHand() {
        // (時鐘的一小格 = 6度)

        // 計算時針角度
        // let deg = time.hr * 30;
        let deg = (time.hr + time.min / 60 + time.sec / 3600) * 30;
        let rad = Rad(deg);
        // console.log(deg);

        // 計算座標(弧度)
        // x
        shortHandPos.x = (clockProperties.secondHandLength * 0.9) * Math.sin(rad);
        // y
        shortHandPos.y = -(clockProperties.secondHandLength * 0.9) * Math.cos(rad);

        //繪製

        ctx.strokeStyle = '#232323';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(shortHandPos.x, shortHandPos.y);
        ctx.closePath();
        ctx.stroke();

    }

    // 繪製時間刻度
    function drawScale() {
        // 時鐘有 60 小格, 一小格是6度
        let perimeter = clockProperties.perimeter * Math.PI; // clock's 周長
        clockProperties.perimeter = perimeter;

        let nowPos = new Object();
        let nowAngle;
        nowAngle = Rad(0);
        nowPos.x = clockProperties.radius * Math.sin(nowAngle);
        nowPos.y = clockProperties.radius * Math.cos(nowAngle);

        // 小刻度
        for (let i = 0, deg = 0; i <= 59; i++) {
            // do 59 times
            nowAngle = Rad(deg);
            deg += 6;
            nowPos.x = clockProperties.radius * Math.sin(nowAngle);
            nowPos.y = clockProperties.radius * Math.cos(nowAngle);

            ctx.beginPath();
            ctx.moveTo(nowPos.x, nowPos.y);

            nowPos.x = nowPos.x - clockProperties.radius / 15 * Math.sin(nowAngle);
            nowPos.y = nowPos.y - clockProperties.radius / 15 * Math.cos(nowAngle);
            // ctx.arc(nowPos.x, nowPos.y, 5, 0, Math.PI * 2);
            ctx.lineTo(nowPos.x, nowPos.y);
            ctx.stroke();
        }

        // 大刻度
        for (let i = 0, deg = 0; i <= 11; i++) {
            nowAngle = Rad(deg);
            deg += 30;
            nowPos.x = clockProperties.radius * Math.sin(nowAngle);
            nowPos.y = clockProperties.radius * Math.cos(nowAngle);

            ctx.beginPath();
            ctx.moveTo(nowPos.x, nowPos.y);

            nowPos.x = nowPos.x - clockProperties.radius / 8 * Math.sin(nowAngle);
            nowPos.y = nowPos.y - clockProperties.radius / 8 * Math.cos(nowAngle);
            // ctx.arc(nowPos.x, nowPos.y, 5, 0, Math.PI * 2);
            ctx.lineTo(nowPos.x, nowPos.y);
            ctx.stroke();
        }

        //數字
        for (let i = 0, deg = 30, num = 1; i <= 11; i++) {
            nowAngle = Rad(deg);
            deg += 30;
            nowPos.x = (clockProperties.radius + clockProperties.radius / 7) * Math.sin(nowAngle) - 30 / 2;
            nowPos.y = -(clockProperties.radius + clockProperties.radius / 7) * Math.cos(nowAngle) + 30 / 2;

            ctx.font = '30px Arial';
            ctx.beginPath();
            ctx.fillText(num, nowPos.x, nowPos.y);
            num += 1;
            // console.log(deg);
        }
    }

    // degrees to radian
    function Rad(degrees) {
        // 360deg = 2 * pi
        return degrees / 360 * 2 * Math.PI;
    }
}