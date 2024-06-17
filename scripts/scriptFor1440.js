

let bear = document.getElementById("bear");

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//создаем изображение мишки
let bearImage = new Image();
bearImage.src = "../img/bear_go.png";

//создаем изображение мишки в левую сторону
let bearImageLeft = new Image();
bearImageLeft.src = "../img/bear_goLeft.png";

//Создадим класс спрайтов. Его объектам потребуется 4 свойства:
//контекст для рисования;
//ширина изображения;
//высота изображения;
//само изображение с фреймами. 
class Sprite {
    constructor(options){
        this.ctx = options.ctx;
        this.image = options.image;
        this.width = options.width;
        this.height = options.height;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = options.ticksPerFrame || 0;
        this.numberOfFrames = options.numberOfFrames || 1;
        this.isAnimating = true;
        this.animationFrameId = null;
        this.x = options.x || 0; // Добавляем свойство x с значением по умолчанию 0
        this.y = options.y || 0; // Добавляем свойство y с значением по умолчанию 0
        this.render();
        this.update();
        this.render();
    }

    render() {
        // Очищаем только необходимую область холста
        this.ctx.clearRect(this.x, this.y, this.width / this.numberOfFrames, this.height);
        // Рисуем изображение в координатах x и y
        this.ctx.drawImage(
        this.image,
        this.frameIndex * this.width / this.numberOfFrames,
        0,
        this.width / this.numberOfFrames,
        this.height,
        this.x, // Используем свойство x для позиционирования
        this.y, // Используем свойство y для позиционирования
        this.width / this.numberOfFrames,
        this.height
        );
    }

    update() {
        if (this.isAnimating){
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                if (this.frameIndex < this.numberOfFrames - 1) {
                        this.frameIndex++;
                } else {
                    this.frameIndex = 0;
                }
            }
        }
    }

    start() {
        this.isAnimating = true;
        let loop = () => {
            this.update();
            this.render();
            this.animationFrameId = window.requestAnimationFrame(loop);
        }
        this.animationFrameId = window.requestAnimationFrame(loop);
    }

    stop() {
        this.isAnimating = false; // Устанавливаем флаг анимации в false
        window.cancelAnimationFrame(this.animationFrameId);
        this.ctx.clearRect(this.x, this.y, this.width / this.numberOfFrames, this.height);
        }
}


let bearGo;

//слздаем объект мишка-идет-анимация 
function showBear() {
    bear.style.visibility = "hidden";
    bearGo = new Sprite({
        ctx: canvas.getContext('2d'),
        image: bearImage,
        width: 600,
        height: 150,
        numberOfFrames: 6,
        ticksPerFrame: 4,
        x: parseInt(bear.style.left) || 681, // Координата x для размещения изображения
        y: parseInt(bear.style.top) || 0,  // Координата y для размещения изображения
        stop(){
            super.stop();
            bear.style.left = this.x + "px";
            bear.style.top = this.y + "px";
            bear.style.visibility = "visible";
        }
    })
console.log("покажи х"+bearGo.x);
console.log("покажи у"+bearGo.y);
bearGo.ctx.clearRect(bearGo.x, bearGo.y, bearGo.width / bearGo.numberOfFrames, bearGo.height);
}


//Это пока не надо, просто добавила в первый объект доп ссылку на изображение
//let bearGoLeft;
/*function showBearLeft() {
    bear.style.visibility = "hidden";
    bearGoLeft = new Sprite({
        ctx: canvas.getContext('2d'),
        image: bearImageLeft,
        width: 600,
        height: 150,
        numberOfFrames: 6,
        ticksPerFrame: 4,
        x: parseInt(bear.style.left) || 681, // Координата x для размещения изображения
        y: parseInt(bear.style.top)-150 || 0  // Координата y для размещения изображения
    }) 
console.log(bearGoLeft.x);
console.log(bearGoLeft.y);
bearGoLeft.start();
}*/


//определяем где медведь
let closestPointToBear = {};
function findClosestPointsToBear(){
    let bearStatic = document.querySelector('#bear');
    let bearStaticX = bearStatic.style.left || 681;
    let bearStaticY = bearStatic.style.top -150 || 0; 
    return closestPointToBear = {x:bearStaticX, y:bearStaticY};
}



//определяем точку клика с учетом возможной ширины экрана больше 1440
let PointToClick = {};

function findPointToClick(event){
    findClosestPointsToBear();
    let Xclick;
    let Yclick;
    //если ширина окна браузера больше чем 1440
    let allWindow = window.innerWidth;
    if(allWindow>1440){
        let side = (allWindow-1440)/2;
        Xclick = event.pageX-side;
        Yclick = event.pageY-221;
    }
    else{
        Xclick = event.pageX;
        Yclick = event.pageY-221;
    }
    PointToClick = {
        x: parseInt(Xclick),
        y: parseInt(Yclick)
    };   
           console.log(PointToClick) ;
}
document.addEventListener('click', findPointToClick);
document.addEventListener('click', go);








let currentBearX = 681; // Глобальная переменная для хранения текущей координаты X медведя
let currentBearY = 0; // Глобальная переменная для хранения текущей координаты Y медведя


let timeoutMove;

let flag = false;
function goTo(sprite, PointToClick) {
    if(flag){
        clearTimeout(timeoutMove);
        sprite.stop();
    }
    flag = true;

    function move() {
       
        let reachedX = false;
        let reachedY = false;
        sprite.ctx.clearRect(sprite.x, sprite.y, sprite.width / sprite.numberOfFrames, sprite.height);
        // Движение по оси X
        if (sprite.x < PointToClick.x && sprite.x < 1440) {
            sprite.x++;
        } else if (sprite.x > PointToClick.x && sprite.x > 0) {
            sprite.x--;
        } else {
            reachedX = true; // Достигли координаты X
        }

        // Движение по оси Y
        if (sprite.y < PointToClick.y && sprite.y < 900) {
            sprite.y++;
        } else if (sprite.y > PointToClick.y && sprite.y > 0) {
            sprite.y--;
        } else {
            reachedY = true; // Достигли координаты Y
        }

        // Обновление позиции спрайта
        currentBearX = sprite.x;
        currentBearY = sprite.y;
        //sprite.update();
        sprite.render();
        // Проверка, достиг ли спрайт обеих координат
        if (!reachedX || !reachedY) {
            console.log("x: " + sprite.x + ", y: " + sprite.y);
            timeoutMove = setTimeout(move, 10);
        }
        else {
            sprite.stop();
            sprite.ctx.clearRect(sprite.x, sprite.y, sprite.width / sprite.numberOfFrames, sprite.height);
            bear.style.left = currentBearX + "px";
            bear.style.top = currentBearY + 150 + "px";
            console.log("статик лефт "+bear.style.left + "статик райт "+ bear.style.top);
            bear.style.visibility = "visible";
            flag = false;
        }
    }
    move(); // Начало движения
}

function go(){
    if(bearGo){
        bearGo.stop();
    }
    showBear();
    bearGo.x = currentBearX;
    bearGo.y = currentBearY;
    if(parseInt(closestPointToBear.x) > PointToClick.x){
        bearGo.image = bearImageLeft;
    }
    goTo(bearGo, PointToClick);
    bearGo.start();
}

let fire = document.querySelector("#fire");
fire.addEventListener("click", go);


//функция для снятия выделения на странице
/*
function clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else { // старый IE
      document.selection.empty();
    }
  }
  */