//debugger;
//Pobierz pole gry z index.html
const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

//wszystkie wartosci (początkowe) zadeklarowane dla łatwych modyfikacji tkz. softcoding
let x = 400;
let y = 400;
let radius = 15;
let defaultRadius = 15;
let speed = 6;
let defaultSpeed = 6;
//jedna sekunda to 60 jednostek
let dashCooldown = 60;
let dashDuration = 30;
let currentDashDuration = 0;
let currentDashCooldown = 0;
let dashSpeed = 6;
let isDashing = false;
let playerColor = "cyan";
let isPlayerAlive = true;
//punktu
let score = 0;
let highscore = 0;
// 1 to ściana górna, 2 to prawa, 3 to dolna, a 4 to lewa
let wallSpawn = 1;
//tablice przechowujące przeciwników / tymczasowe
let enemyBullet = [];
let enemyArrow = [];
let enemyLaser = [];
let enemyBulletCooldown = 60;
let minEnemyBulletCooldown = 5;
let currentEnemyBulletCooldown = 0;
let enemyBulletIndex = 0;
let enemyArrowCooldown = 120;
let minEnemyArrowCooldown = 30;
let currentEnemyArrowCooldown = 0;
let enemyArrowIndex = 0;
let enemyLaserCooldown = 180;
let minEnemyLaserCooldown = 90;
let currentEnemyLaserCooldown = 0;
let enemyLaserIndex = 0;
//wartosci klawiszy / czy nacisniete
let downPressed = false;
let upPressed = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;


//funkcja która rysuje pole calej gry na stronie 
function drawGame(){
    clearScreen();
    if(isPlayerAlive){
        inputs();
        boundryCheck();
        dash();
    }else{
        playerColor = "red";
        music.volume = 0.4;
    }
    drawPlayer();
    enemySpawner();
    scoreManeger();
};

//funkcja która rysuje puste pole gry/tło
function clearScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
};

//funkcja która tworzy gracza na planszy
function drawPlayer(){
    ctx.fillStyle = playerColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
};

//strona czeka na naciśnięcie i puszczenia klawiszy
document.body.addEventListener('keydown', keyDown);
document.body.addEventListener('keyup', keyUp);
//kontroler gracza / pobiera aktualnie wciśnięte klawisze
function keyDown(event){
    if(event.keyCode == 40 || event.keyCode == 83){
        downPressed = true;
    };
    if(event.keyCode == 38 || event.keyCode == 87){
        upPressed = true;
    };
    if(event.keyCode == 37 || event.keyCode == 65){
        leftPressed = true;
    };
    if(event.keyCode == 39 || event.keyCode == 68){
        rightPressed = true;
    };
    if(event.keyCode == 32){
        spacePressed = true;
    };
};
function keyUp(event){
    if(event.keyCode == 40 || event.keyCode == 83){
        downPressed = false;
    };
    if(event.keyCode == 38 || event.keyCode == 87){
        upPressed = false;
    };
    if(event.keyCode == 37 || event.keyCode == 65){
        leftPressed = false;
    };
    if(event.keyCode == 39 || event.keyCode == 68){
        rightPressed = false;
    };
    if(event.keyCode == 32){
        spacePressed = false;
    };
};
//Porusza graczem
function inputs(){
    if(!downPressed && !upPressed && !leftPressed && !rightPressed){
        radius = defaultRadius;
    };
    if(downPressed){
        y += speed;
        radius = defaultRadius - 2;
    };
    if(upPressed){
        y -= speed;
        radius = defaultRadius - 2;
    };
    if(leftPressed){
        x -= speed;
        radius = defaultRadius - 2;
    };
    if(rightPressed){
        x += speed;
        radius = defaultRadius - 2;
    };
};
//mechanika uników
function dash(){
    if(spacePressed == true && currentDashCooldown >= dashCooldown){
        isDashing = true;
        currentDashCooldown = 0;
        currentDashDuration = 0;   
    };
    if(isDashing && currentDashDuration < dashDuration){
        currentDashDuration += 1;
    }else if(isDashing && currentDashDuration >= dashDuration){
        isDashing = false;
    };
    if(!isDashing && currentDashCooldown < dashCooldown){
        currentDashCooldown += 1;
    };
    if(isDashing){
        playerColor = "blue";
        speed = defaultSpeed + dashSpeed;
    }else{
        playerColor = "cyan";
        speed = defaultSpeed;
    };
};

//utrzymuje gracza w polu gry/ściany pola
function boundryCheck(){
    if(y < radius - 8){
        y = radius - 8;
    };
    if(y > canvas.height - radius + 8){
        y = canvas.height - radius + 8;
    };
    if(x < radius - 8){
        x = radius - 8;
    };
    if(x > canvas.width - radius + 8){
        x = canvas.width - radius + 8;
    };
};

//Klasy i funkcje przeciwnikow
//klasy
class EnemyBullet{
    //tworzymy wartości
    constructor(){
        this.ySpawn = 0;
        this.xSpawn = 0;
        this.wallSpawn = 0;
        this.ySpeed = 0;
        this.xSpeed = 0;
        this.isSpawnSet = false;
        this.isSpeedSet = false;
        this.size = 25;
    };
    //funkcja która obsługuje działanie całego przeciwnika
    drawEnemy(){
        //ustawienie startu i prętkości
        if(!this.isSpeedSet && !this.isSpawnSet){
            this.wallSpawn = Math.floor(Math.random() * 4) + 1;
            if(this.wallSpawn == 1){
                this.ySpawn = -this.size;
                this.xSpawn = Math.floor(Math.random() * (canvas.width - 99)) + 50;
            }else if(this.wallSpawn == 2){
                this.ySpawn = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn = canvas.width + this.size;
            }else if(this.wallSpawn == 3){
                this.ySpawn = canvas.height + this.size;
                this.xSpawn = Math.floor(Math.random() * (canvas.width - 99)) + 50;
            }else if(this.wallSpawn == 4){
                this.ySpawn = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn = -this.size;
            };
            if(this.wallSpawn == 1){
                this.ySpeed = Math.floor(Math.random() * 3) - 1;
                this.xSpeed = Math.floor(Math.random() * 5) - 2;
            }else if(this.wallSpawn == 2){
                this.ySpeed = Math.floor(Math.random() * 5) - 2;
                this.xSpeed = Math.floor(Math.random() * -3) - 1;
            }else if(this.wallSpawn == 3){
                this.ySpeed = Math.floor(Math.random() * -3) + 1;
                this.xSpeed = Math.floor(Math.random() * 5) - 2;
            }else if(this.wallSpawn == 4){
                this.ySpeed = Math.floor(Math.random() * 5) - 2;
                this.xSpeed = Math.floor(Math.random() * 3) + 1;
            };
            this.isSpeedSet = true;
            this.isSpawnSet = true;
        };
        //kolizja z graczem
        if(!isDashing && (x > this.xSpawn - (radius / 2) && x < this.xSpawn + this.size + (radius / 2) && y > this.ySpawn - (radius / 2) && y < this.ySpawn + this.size + (radius / 2))){
            isPlayerAlive = false;
        //dodatkowe punkty za unik
        }else if(isDashing && (x > this.xSpawn - (radius / 2) && x < this.xSpawn + this.size + (radius / 2) && y > this.ySpawn - (radius / 2) && y < this.ySpawn + this.size + (radius / 2))){
            score += 1;
        };
        //podstawowe wypisywanie i ruch
        ctx.fillStyle = "white";
        ctx.fillRect(this.xSpawn, this.ySpawn, this.size, this.size);
        if(isPlayerAlive){
            this.xSpawn += this.xSpeed;
            this.ySpawn += this.ySpeed;
        };
    };
};
class EnemyArrow{
    constructor(){
        this.ySpawn = 0;
        this.xSpawn = 0;
        this.wallSpawn = 0;
        this.ySpeed = 0;
        this.xSpeed = 0;
        this.isSpawnSet = false;
        this.isSpeedSet = false;
        this.isDirectionSet = false;
        this.size = 30;
    };
    drawEnemy(){
        //ustawienie startu
        if(!this.isSpawnSet){
            this.wallSpawn = Math.floor(Math.random() * 4) + 1;
            if(this.wallSpawn == 1){
                this.ySpawn = -this.size;
                this.xSpawn = Math.floor(Math.random() * (canvas.width - 99)) + 50;
            }else if(this.wallSpawn == 2){
                this.ySpawn = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn = canvas.width + this.size;
            }else if(this.wallSpawn == 3){
                this.ySpawn = canvas.height + this.size;
                this.xSpawn = Math.floor(Math.random() * (canvas.width - 99)) + 50;
            }else if(this.wallSpawn == 4){
                this.ySpawn = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn = -this.size;
            };
            this.isSpawnSet = true;
        };
        //ustawienie kierunku
        if(!this.isSpeedSet){     
                this.ySpeed = (y - this.ySpawn) / 50;
                this.xSpeed = (x - this.xSpawn) / 50;
                this.isSpeedSet = true;
        };
        //kolizja z graczem
        if(!isDashing && (x > this.xSpawn - (radius / 5) && x < this.xSpawn + this.size + (radius / 5) && y > this.ySpawn - (radius / 5) && y < this.ySpawn + this.size + (radius / 5))){
            isPlayerAlive = false;
        //dodatkowe punkty za unik
        }else if(isDashing && (x > this.xSpawn - (radius / 3) && x < this.xSpawn + this.size + (radius / 3) && y > this.ySpawn - (radius / 3) && y < this.ySpawn + this.size + (radius / 3))){
            score += 5;
        };
        //wypisanie i ruch
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(this.xSpawn, this.ySpawn);
        if(this.wallSpawn == 1){
            ctx.lineTo(this.xSpawn - (this.size / 2) - this.xSpeed, this.ySpawn - this.size + this.ySpeed);
            ctx.lineTo(this.xSpawn + (this.size / 2) - this.xSpeed, this.ySpawn - this.size - this.ySpeed);
        }else if(this.wallSpawn == 2){
            ctx.lineTo(this.xSpawn + this.size - this.xSpeed, this.ySpawn - (this.size / 2) - this.ySpeed);
            ctx.lineTo(this.xSpawn + this.size + this.xSpeed, this.ySpawn + (this.size / 2) - this.ySpeed);
        }else if(this.wallSpawn == 3){
            ctx.lineTo(this.xSpawn + (this.size / 2) - this.xSpeed, this.ySpawn + this.size + this.ySpeed);
            ctx.lineTo(this.xSpawn - (this.size / 2) - this.xSpeed, this.ySpawn + this.size - this.ySpeed);
        }else if(this.wallSpawn == 4){
            ctx.lineTo(this.xSpawn - this.size - this.xSpeed, this.ySpawn - (this.size / 2) - this.ySpeed);
            ctx.lineTo(this.xSpawn - this.size + this.xSpeed, this.ySpawn + (this.size / 2) - this.ySpeed);
        };
        ctx.fill();
        if(isPlayerAlive){
            this.xSpawn += this.xSpeed;
            this.ySpawn += this.ySpeed;
        };

    };
};
class EnemyLaser{
    constructor(){
        this.ySpawn = 0;
        this.xSpawn = 0;
        this.ySpawn2 = 0;
        this.xSpawn2 = 0;
        this.wallSpawn = 0;
        this.wallSpawn2 = 0;
        this.isSpawnSet = false;
        this.size = 50;
        this.isActive = false;
        this.activeDuration = 60;
        this.currentActiveDuration = 0;
        this.isCharging = false;
        this.chargingDuration = 90;
        this.currentChargingDuration = 0;
        this.isDone = false;
        this.collisionXSpeed = 0;
        this.collisionYSpeed = 0;
        this.currentCollisionXSpeed = 0;
        this.currentCollisionYSpeed = 0;
        this.isCollisionSpeedSet = false;
    };
    drawEnemy(){
        //ustawienie startu i końcu lasera
        if(!this.isSpawnSet){
            this.wallSpawn = Math.floor(Math.random() * 3) + 1;
            if(this.wallSpawn == 1){
                this.ySpawn = -this.size;
                this.xSpawn = Math.floor(Math.random() * (canvas.width - 99)) + 50;
                this.wallSpawn2 = Math.floor(Math.random() * 3) + 2;
            }else if(this.wallSpawn == 2){
                this.ySpawn = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn = canvas.width + this.size;
                this.wallSpawn2 = Math.floor(Math.random() * 2) + 3;
            }else if(this.wallSpawn == 3){
                this.ySpawn = canvas.height + this.size;
                this.xSpawn = Math.floor(Math.random() * (canvas.width - 99)) + 50;
                this.wallSpawn2 = 4;
            };
            if(this.wallSpawn2 == 2){
                this.ySpawn2 = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn2 = canvas.width + this.size;
            }else if(this.wallSpawn2 == 3){
                this.ySpawn2 = canvas.height + this.size;
                this.xSpawn2 = Math.floor(Math.random() * (canvas.width - 99)) + 50;
            }else if(this.wallSpawn2 == 4){
                this.ySpawn2 = Math.floor(Math.random() * (canvas.height - 99)) + 50;
                this.xSpawn2 = -this.size;
            };
            this.size = Math.floor(Math.random() * 50) + 51;
            this.isSpawnSet = true;
        };

        //stany laseu
        if(!this.isCharging && !this.isActive && !this.isDone && isPlayerAlive){
            this.isCharging = true;
        };
        if(this.isCharging){
            ctx.fillStyle = "rgba(0, 210, 60, 0.4)";
            if(this.currentChargingDuration >= this.chargingDuration){
                this.isActive = true;
                this.isCharging = false;
            };
            if(isPlayerAlive){
                this.currentChargingDuration++;
            };
        };
        if(this.isActive){
            ctx.fillStyle = "rgba(0, 210, 60, 1)";
            if(this.currentActiveDuration >= this.activeDuration){
                this.isActive = false;
                this.isDone = true;
            };
            if(isPlayerAlive){
                this.currentActiveDuration++;
            };
        };
        if(this.isDone){
            this.xSpawn = -100;
            this.ySpawn = -100;
            this.xSpawn2 = -100;
            this.ySpawn2 = -100;
        };

        //kolizja z graczem 
        if(!this.isCollisionSpeedSet){
            this.collisionXSpeed = (this.xSpawn2 - this.xSpawn) / 50;
            this.collisionYSpeed = (this.ySpawn2 - this.ySpawn) / 50;
            this.isCollisionSpeedSet = true
        };
        this.currentCollisionXSpeed = this.xSpawn;
        this.currentCollisionYSpeed = this.ySpawn;
        for(let i = 0; i < 50; i++){
            if(!isDashing && this.isActive && (x > this.currentCollisionXSpeed - (radius / 2) && x < this.currentCollisionXSpeed + (radius / 2) - this.collisionXSpeed + (this.size * 0.6) && y > this.currentCollisionYSpeed - (radius / 2) && y < this.currentCollisionYSpeed + (radius / 2) - this.collisionYSpeed + (this.size * 0.6))){
                isPlayerAlive = false;
                break;
            }
            if(isDashing && this.isActive && (x > this.currentCollisionXSpeed - (radius / 2) && x < this.currentCollisionXSpeed + (radius / 2) - this.collisionXSpeed + (this.size * 0.6) && y > this.currentCollisionYSpeed - (radius / 2) && y < this.currentCollisionYSpeed + (radius / 2) - this.collisionYSpeed + (this.size * 0.6))){
                score += 7;
            }
            this.currentCollisionXSpeed += this.collisionXSpeed;
            this.currentCollisionYSpeed += this.collisionYSpeed;
        };
        //wypisanie
        ctx.beginPath();
        ctx.beginPath();
        ctx.moveTo(this.xSpawn, this.ySpawn);
        if(this.wallSpawn % 2 == 1){
            ctx.lineTo(this.xSpawn + this.size, this.ySpawn);
        }else{
            ctx.lineTo(this.xSpawn, this.ySpawn + this.size);
        };
        if(this.wallSpawn2 == 2 || (this.wallSpawn2 == 4 && this.wallSpawn == 3)){
            ctx.lineTo(this.xSpawn2, this.ySpawn2);
            ctx.lineTo(this.xSpawn2, this.ySpawn2 + this.size);
        }else{
            if(this.wallSpawn2 % 2 == 1){
                ctx.lineTo(this.xSpawn2 + this.size, this.ySpawn2);
            }else{
                ctx.lineTo(this.xSpawn2, this.ySpawn2 + this.size);
            };
            ctx.lineTo(this.xSpawn2, this.ySpawn2);
        };
        ctx.fill();
    };
};

//funkcje tworząca przeciwników
function enemySpawner(){
    //enemy bullet
    if(currentEnemyBulletCooldown >= enemyBulletCooldown){
        enemyBullet[enemyBulletIndex] = new EnemyBullet();
        currentEnemyBulletCooldown = 0;
        enemyBulletIndex++;
        if(enemyBulletCooldown > minEnemyBulletCooldown){
            enemyBulletCooldown--;
        }
    };
    for(let i = 0; i < enemyBulletIndex; i++){
        enemyBullet[i].drawEnemy();
    };
    currentEnemyBulletCooldown++;
    //enemy arrow
    if(currentEnemyArrowCooldown >= enemyArrowCooldown){
        enemyArrow[enemyArrowIndex] = new EnemyArrow();
        currentEnemyArrowCooldown = 0;
        enemyArrowIndex++;
        if(enemyArrowCooldown > minEnemyArrowCooldown){
            enemyArrowCooldown--;
        };
    };
    for(let i = 0; i < enemyArrowIndex; i++){
        enemyArrow[i].drawEnemy();
    };
    currentEnemyArrowCooldown++;
    //enemy Laser
    if(currentEnemyLaserCooldown >= enemyLaserCooldown && isPlayerAlive){
        enemyLaser[enemyLaserIndex] = new EnemyLaser();
        currentEnemyLaserCooldown = 0;
        enemyLaserIndex++;
        if(enemyLaserCooldown > minEnemyLaserCooldown){
            enemyLaserCooldown--;
        };
    };
    for(let i = 0; i < enemyLaserIndex; i++){
        enemyLaser[i].drawEnemy();
    };
    currentEnemyLaserCooldown++;
};

//funkcja która liczy punkty
function scoreManeger(){
    if(document.cookie != ""){
        highscore = 0;
        highscore = cookies.highscore;
    }else{
        highscore = 0;
    };
    if(!isPlayerAlive){
        if(parseInt(score) > parseInt(highscore)){
            setCookie("highscore", score);
            highscore = score;
        };
    }else{
        score += 1;
    };
    document.getElementById("score").innerHTML = score;
    document.getElementById("highscore").innerHTML = highscore;
};

//funkcja obsługująca menu
//WIP

//ciasteczka :)
let cookies = document.cookie
  .split(';')
  .map(cookie => cookie.split('='))
  .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
function setCookie(name, value, options) {
    const opts = {
        path: "/",
        ...options
    }

    if (navigator.cookieEnabled) { //czy ciasteczka są włączone
        const cookieName = encodeURIComponent(name);
        const cookieVal = encodeURIComponent(value);
        let cookieText = cookieName + "=" + cookieVal;

        if (opts.days && typeof opts.days === "number") {
            const data = new Date();
            data.setTime(data.getTime() + (opts.days * 24*60*60*1000));
            cookieText += "; expires=" + data.toUTCString();
        }

        if (opts.path) {
            cookieText += "; path=" + opts.path;
        }
        if (opts.domain) {
            cookieText += "; domain=" + opts.domain;
        }
        if (opts.secure) {
            cookieText += "; secure";
        }

        document.cookie = cookieText;
    }
}
function getCookie(name) {
    if (document.cookie !== "") {
        const cookies = document.cookie.split(/; */);

        for (let cookie of cookies) {
            const [ cookieName, cookieVal ] = cookie.split("=");
            if (cookieName === decodeURIComponent(name)) {
                return decodeURIComponent(cookieVal);
            }
        }
    }

    return undefined;
}
function deleteCookie(name) {
    const cookieName = encodeURIComponent(name);
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

//muzyka
let music = new Audio("bossfight-milky-ways.mp3");
let userInteraction = 0;
document.addEventListener("keypress",()=>{if(userInteraction)return; userInteraction++; music.play();});

//wywołanie gry / ciągłe zapętlenie aby gra mogła działać
setInterval(drawGame, 1000 / 60);