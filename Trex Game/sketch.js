var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var gameover,restart,restartvar,gameovervar;

var score=0;

var highScore=0;

var win;

  
  var jumpSound , checkPointSound, dieSound


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  restart = loadImage("restart.png");
  gameover = loadImage("gameOver.png")
  
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

    jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  gameoversound = loadSound("gameover.mp3")
  
    win = loadSound("win.wav")

}

function setup() {
  createCanvas(600, 200);
  
  
  
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Hello" + 5);

  trex.setCollider("rectangle", 0, 0, 100, 100);


  score = 0
  
  restartvar = createSprite(300,100,20,20);
  restartvar.addImage("restart",restart)
  restartvar.scale = 0.4;
  restartvar.visible = false;
  
    gameovervar = createSprite(300,70,20,20);
  gameovervar.addImage("gameover",gameover)
  gameovervar.scale = 0.4;
  gameovervar.visible = false;
  
}

function draw() {
  background(180);
  //displaying score
  fill("black");
  text("Score: " + score, 520, 13);
    text("Best: " + highScore, 440, 13);

  /*if(score%50 == 0)
    {
      win.play();
    }*/

  console.log("this is ", gameState)

            if(score % 100==0 && score>0)
    {
       checkPointSound.play();
    }

  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -4;
    //scoring
    
    if(frameCount%10 == 0 )
    score = score + 1;//Math.round(frameCount / 200);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 100) {
      trex.velocityY = -13;
              jumpSound.play();  
    }
    
      if(highScore <  score)
    {
          highScore = score;//highScore + Math.round(frameCount / 80);
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    if(frameCount % 100 == 0 )
    {
         gameoversound.play(); 
    }
    
    
    text("Press 'Space' To Start again",230,130)

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
        trex.velocityY=0;
      trex.changeAnimation("collided", trex_collided)
    trex.velocityY = trex.velocityY + 20;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    restartvar.visible = true;
            gameovervar.visible = true;
    
    if(keyDown("space"))
      {
        gameState = PLAY;
        cloudsGroup.destroyEach();
        obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
            restartvar.visible = false;
            gameovervar.visible = false;
        score = 0;
        
    if(highScore>score)
  {
    highScore = highScore;
  }
        
  }
  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(630, 165, 10, 40);
    //obstacle.velocityX = -6;
   obstacle.velocityX = -(6+score/100);
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 250;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}