/*PT-109
Chase Thompson - June 2021
A top down shooter where you control a PT boat and shoot at enemy planes*/

//variables for your boat
var pt109Sprite, pt109Animation, ptFireAnimation
//variables for the enemies
var planeSprite, planeAnimation
//variables for the explosion
var explosionSprite, explosionAnimation
//variables for the bullets
var playerBulletSprite, playerBulletImage
var enemyBulletSprite, enemyBulletImage
//variable containing the sound effects
var explosionSound
//variable containing the background
var bgImage
//variable containing the score
var score = 0
//variable for the multiplier of the plane spawn area
var spawnArea = (-15)
//variables for the different levels of the game
var titleScreen = true
var instructions = false
var gameOver = false
var level1 = false
var win = false

function preload() {
  // load the images. The first paramter is the first frame of the animation. The second parameter is the last frame of the animation.
  //pt boat sources: made by me
  pt109Animation = loadAnimation('PTboat0.png', 'PTboat5.png');
  ptFireAnimation = loadAnimation('PTfire0.png', 'PTfire1.png');
  //zero source: made by me
  planeAnimation = loadAnimation('zero0.png', 'zero3.png');
  //source: made by me
  bgImage = loadImage('bg.png');
  //load bullet images
  //source: made by me
  playerBulletImage = loadImage('player bullet.png');
  enemyBulletImage = loadImage('enemy bullet.png');
  //source: made by me
  explosionAnimation = loadAnimation('explosion0.png', 'explosion7.png');
  // Load the sound effects
  //source: https://soundbible.com/1234-Bomb.html
  explosionSound = loadSound('explosion.mp3');

}
function setup() {
  // Create the canvas
  createCanvas(800, 600);
  // Variables containing the boat's position
  var pt109x = width / 2
  var pt109y = height / 1.4
  // Create the Player sprite and add its animations
  pt109Sprite = createSprite(pt109x, pt109y)
  pt109Sprite.addAnimation('moving', pt109Animation)
  pt109Sprite.addAnimation('firing', ptFireAnimation)
  // Create a group for the enemy planes
  planeGroup = new Group();
  // Create 100 planes that have a random position along the x & y axis
  for (var j = 0; j < 100; j++) {
    var planeSprite = createSprite(random(0, width), random(0, height * (-15)));
    planeSprite.addAnimation("flying", planeAnimation);
    //add each plane to the group
    planeGroup.add(planeSprite);
    //set each plane's vertical speed to 0.75
    planeSprite.velocity.y = 0.75
  }
  //Ms. E
  //Create the groups for the bullets & the explosion
  playerBulletGroup = new Group();
  enemyBulletGroup = new Group();
  explosionGroup = new Group();
}

function draw() {
  clear();
  background(bgImage);
  /* If the current screen is the title screen, execute the following;
  This only shows at the start of the game, it's the title screen */
  if (titleScreen === true) {
    // Center align the text
    textAlign(CENTER, CENTER)
    // Set the text size to 72 for the title
    textSize(72)
    // Colour the text white
    fill("white")
    // Write "PT-109" at the top of the screen
    text("PT-109", width / 2, height / 6)
    // Make the text size smaller
    textSize(20)
    // Write "press ENTER to advance" at the bottom of the screen
    text("press SPACE to advance.", width / 2, height / 1.15)
    // If enter is pressed, set titleScreen to false and instructions to true.
    if (keyIsDown(32)) {
      titleScreen = false
      instructions = true
    }
    // If the instructions screen is the current screen, do this;
  } else if (instructions === true) {
    // Center align the text
    textAlign(CENTER, CENTER)
    // Set the text size to 24
    textSize(24)
    // Colour the text white
    fill("white")
    // Display the instructions in the center of the screen
    text("Welcome aboard PT-109, sailor!\nUse the arrow keys to move your boat, and press SPACE\nto fire your machine gun! Watch out for the enemy\nplanes and ships trying to sink you!", width / 2, height / 2)
    text("Press ENTER to play.", width / 2, height / 1.15)
    if (keyIsDown(ENTER)) {
      instructions = false
      level1 = true
    }
    /*This screen appears when you are sunk by the enemy. You can try again by pressing enter.*/
  } else if (gameOver === true) {
    // Changes the background to red
    background("red")
    // Set the text size to 32
    textSize(32)
    // Center align the text
    textAlign(CENTER, CENTER)
    // Display "You were sunk! Your score was "score". Press enter to play again."
    text("You were sunk!\n Your score was", width / 2, height / 2)
    text(score, width / 2, height / 1.5)
    text("Press enter to play again.", width / 2, height / 1.25)
    //when you press enter, your boat is put back to the starting position, the score and the planes are reset.
    if (keyIsDown(ENTER)) {
      pt109Sprite.position.x = width / 2
      pt109Sprite.position.y = height / 1.4
      score = 0
      gameOver = false;
      level1 = true;
      for (var j = 0; j < planeGroup.length; j++) {
        planeGroup[j].position.x = random(0, width)
        planeGroup[j].position.y = random(0, height*(-15))
      }
    }
  } else if (level1 === true) {
    //this is level 1
    //set the background to the water
    background(bgImage);
    // Center align the text
    textAlign(CENTER, CENTER)
    // Set the text size to 30
    textSize(30)
    // Colour the text white
    fill("white")
    // Display the score at the top of the screen
    text(score, width / 2, 50)
    // Run the movement function for pt109
    ptMovement();
    // Make the enemy planes fire bullets straight ahead of them every 4 seconds
    if (frameCount % 240 == 0) {
      for (var j = 0; j < planeGroup.length; j++) {
        enemyBulletSprite = createSprite(planeGroup[j].position.x, planeGroup[j].position.y + 10);
        enemyBulletSprite.addImage("ebullet", enemyBulletImage);
        //add each bullet to the group
        enemyBulletGroup.add(enemyBulletSprite);
        //set each bullet's vertical speed to 2
        enemyBulletSprite.velocity.y = 2
      }
    }
    //Check to see if any enemy bullets are off of the screen, if so, delete them
    for (var j = 0; j < enemyBulletGroup.length; j++) {
      if (enemyBulletGroup[j].position.y < 10 || enemyBulletGroup[j].position.y > 590) {
        enemyBulletGroup[j].remove()
      }
    }
    // If space is pressed, change the pt boat's animation to the firing animation and spawn a bullet every 0.25 seconds
    if (keyIsDown(32)) {
      pt109Sprite.changeAnimation('firing')
      if (frameCount % 15 == 0) {
        //for (var j = 0; j < 1; j++) {
        var playerBulletSprite = createSprite(pt109Sprite.position.x + 1, pt109Sprite.position.y - 70);
        playerBulletSprite.addImage("bullet1", playerBulletImage);
        //add each bullet to the group
        playerBulletGroup.add(playerBulletSprite);
        //set each bullet's vertical speed to -5
        playerBulletSprite.velocity.y = -5
      }
    } else {
        pt109Sprite.changeAnimation('moving')
      }
    //Check to see if any player bullets are off of the screen, and if they are, delete them
    for (var j = 0; j < playerBulletGroup.length; j++) {
      if (playerBulletGroup[j].position.y < 10) {
        //playerBulletGroup[j].velocity.y = 0;
        playerBulletGroup[j].remove()
      }
    }
    // If a player bullet overlaps a plane, the plane explodes, and it is moved back to the top of the screen
    for (var j = 0; j < planeGroup.length; j++) {
      if (planeGroup[j].overlap(playerBulletGroup)) {
        explosionSound.play()
        explosionSprite = createSprite(planeGroup[j].position.x, planeGroup[j].position.y)
        explosionSprite.addAnimation ('boom', explosionAnimation);
        explosionSprite.animation.looping = false;
        planeGroup[j].position.x = random(0, width)
        planeGroup[j].position.y = random(0, height*(-15))
        score = score + 1
        explosionGroup.add(explosionSprite);
      }
    }
    // If the plane reaches the bottom of the screen without being shot down, it goes back up to the top
    for (var j = 0; j < planeGroup.length; j++) {
      if (planeGroup[j].position.y > 650) {
        planeGroup[j].position.x = random(0, width)
        planeGroup[j].position.y = random(0, height*(-15))
      }
    }
    // If a plane's bullet hits your boat, you lose
    for (var j = 0; j < enemyBulletGroup.length; j++) {
      if (enemyBulletGroup[j].overlap(pt109Sprite)) {
        explosionSound.play()
        gameOver = true
        level1 = false
      }
    }
    // If your score reaches 50, go to level 2
    if (score > 49) {
      level1 = false
    }
    //draw the sprites
    drawSprites();
  } else if (win === true) {
    // Changes the background to blue
    background("blue")
    // Set the text size to 32
    textSize(32)
    // Center align the text
    textAlign(CENTER, CENTER)
    // Display "You survived the onslaught! Your score was "score". Press enter to play again."
    text("You survived the onslaught!\n Your score was", width / 2, height / 2)
    text(score, width / 2, height / 1.5)
    text("Press enter to go back to the title screen.", width / 2, height / 1.25)
    //when you press enter, the title screen is displayed.
    if (keyIsDown(ENTER)) {
      pt109Sprite.position.x = width / 2
      pt109Sprite.position.y = height / 1.4
      score = 0
      gameOver = false;
      level1 = false;
      titleScreen = true;
      for (var j = 0; j < planeGroup.length; j++) {
        planeGroup[j].position.x = random(0, width)
        planeGroup[j].position.y = random(0, height*(-15))
      }
    }
  } else {
    //this is level 2
    //set the background to the water
    background(bgImage);
    // Center align the text
    textAlign(CENTER, CENTER)
    // Set the text size to 30
    textSize(30)
    // Colour the text white
    fill("white")
    // Display the score at the top of the screen
    text(score, width / 2, 50)
    // Run the movement function for pt109
    ptMovement();
    // Make the enemy planes fire bullets straight ahead of them every 4 seconds
    if (frameCount % 240 == 0) {
      for (var j = 0; j < planeGroup.length; j++) {
        enemyBulletSprite = createSprite(planeGroup[j].position.x, planeGroup[j].position.y + 10);
        enemyBulletSprite.addImage("ebullet", enemyBulletImage);
        //add each bullet to the group
        enemyBulletGroup.add(enemyBulletSprite);
        //set each bullet's vertical speed to 2
        enemyBulletSprite.velocity.y = 2
      }
    }
    //Every five seconds, make the area above the screen where the planes spawn smaller, so more planes will be on screen at once.
    if (frameCount % 300 == 0 && spawnArea < (-2)) {
      spawnArea = spawnArea + 1
    }
    //Check to see if any enemy bullets are off of the screen, if so, delete them
    for (var j = 0; j < enemyBulletGroup.length; j++) {
      if (enemyBulletGroup[j].position.y < 10 || enemyBulletGroup[j].position.y > 590) {
        enemyBulletGroup[j].remove()
      }
    }
    // If space is pressed, change the pt boat's animation to the firing animation and spawn a bullet every 0.2 seconds
    if (keyIsDown(32)) {
      pt109Sprite.changeAnimation('firing')
      if (frameCount % 10 == 0) {
        //for (var j = 0; j < 1; j++) {
        var playerBulletSprite = createSprite(pt109Sprite.position.x + 1, pt109Sprite.position.y - 70);
        playerBulletSprite.addImage("bullet1", playerBulletImage);
        //add each bullet to the group
        playerBulletGroup.add(playerBulletSprite);
        //set each bullet's vertical speed to -5
        playerBulletSprite.velocity.y = -5
      }
    } else {
        pt109Sprite.changeAnimation('moving')
      }
    //Check to see if any player bullets are off of the screen, and if they are, delete them
    for (var j = 0; j < playerBulletGroup.length; j++) {
      if (playerBulletGroup[j].position.y < 10) {
        //playerBulletGroup[j].velocity.y = 0;
        playerBulletGroup[j].remove()
      }
    }
    // If a player bullet overlaps a plane, the plane explodes, and it is moved back to the top of the screen
    for (var j = 0; j < planeGroup.length; j++) {
      if (planeGroup[j].overlap(playerBulletGroup)) {
        explosionSound.play()
        explosionSprite = createSprite(planeGroup[j].position.x, planeGroup[j].position.y)
        explosionSprite.addAnimation ('boom', explosionAnimation);
        explosionSprite.animation.looping = false;
        planeGroup[j].position.x = random(0, width)
        planeGroup[j].position.y = random(0, height*(spawnArea))
        score = score + 1
        explosionGroup.add(explosionSprite);
      }
    }
    // If the plane reaches the bottom of the screen, it goes back up to the top
    for (var j = 0; j < planeGroup.length; j++) {
      if (planeGroup[j].position.y > 650) {
        planeGroup[j].position.x = random(0, width)
        planeGroup[j].position.y = random(0, height*(-15))
      }
    }
    // If a plane's bullet hits your boat, you lose
    for (var j = 0; j < enemyBulletGroup.length; j++) {
      if (enemyBulletGroup[j].overlap(pt109Sprite)) {
        gameOver = true
      }
    }
    // If you can last until the spawn area multiplier goes down to -2, you win
    if (spawnArea > -2) {
      win = true;
    }
    //draw the sprites
    drawSprites();
    }
  }
  function ptMovement() {
    // If you press the left arrow key, then the boat will move left
    if (keyIsDown(LEFT_ARROW)) {
      pt109Sprite.position.x = pt109Sprite.position.x - 2
    }
    // If you press the right arrow key, then the boat will move right
    if (keyIsDown(RIGHT_ARROW)) {
      pt109Sprite.position.x = pt109Sprite.position.x + 2
    }
    // If you press the up arrow key, then the boat will move up
    if (keyIsDown(UP_ARROW)) {
      pt109Sprite.position.y = pt109Sprite.position.y - 2
    }
    // If you press the down arrow key, then the boat will move down
    if (keyIsDown(DOWN_ARROW)) {
      pt109Sprite.position.y = pt109Sprite.position.y + 2
    }
    //Make sure that the boat can't move off of the edge of the screen
    if (pt109Sprite.position.x <= 0) {
      pt109Sprite.position.x = 0;
    } if (pt109Sprite.position.y >= height) {
      pt109Sprite.position.y = height;
    } if (pt109Sprite.position.y <= 0) {
      pt109Sprite.position.y = 0;
    } if (pt109Sprite.position.x >= width) {
      pt109Sprite.position.x = width
    }
  }