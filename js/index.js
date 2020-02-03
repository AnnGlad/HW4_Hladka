"use strict"

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');
let raf;
let circleCount = 0;
let squareCount = 0;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomColor() {
  let randomColor = "#" + (Math.floor(Math.random() * 16777216).toString(16));
  return randomColor;
}

class Canvas {
  constructor() {
    this.figures = [];
  }
  animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let idx in this.figures) {
      let value = this.figures[idx];
      value.draw();
      value.animate();
    }
    this.checkCollission();

    raf = window.requestAnimationFrame(() => this.animate());
  }
  checkCollission() {
    for (let i = 0; i < this.figures.length - 1; i++) {
      for (let j = i + 1; j < this.figures.length; j++) {
        let object1 = this.figures[i];
        let object2 = this.figures[j];
        object1.checkCollision(object2);
        object2.checkCollision(object1);
      }
    }
  }
  addFigure(newFigure) {
    for (let i = 0; i < this.figures.length; i++) {
      if (newFigure.isCollided(this.figures[i])) {
        console.log("There's a figure on the way!!!")
        return false;
      }
    }
    // checkCollision(otherObject) 
    this.figures.push(newFigure);
    let figInfo = {};

    if (newFigure instanceof Circle) {
      figInfo.name = "Circle-" + (++circleCount);
    } else {
      figInfo.name = "Square-" + (++squareCount);
    }

    figInfo.x = newFigure.x;
    figInfo.y = newFigure.y;
    figInfo.color = newFigure.color;
    figInfo.area = newFigure.area;
    console.log(figInfo);


  }

}
class Figure {
  constructor(x, y, vx = 1, vy = 4) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = generateRandomColor();
  }
  animate() {
    this.chackWallCollision();
    this.x += this.vx;
    this.y += this.vy;
  }
  bounds() { }

  isCollided(otherObject) {
    let obj1 = this.bounds();
    let obj2 = otherObject.bounds();
    return (obj1.left < obj2.right && obj1.right > obj2.left &&
      obj1.top < obj2.bottom && obj1.bottom > obj2.top);
  }

  checkCollision(otherObject) {
    if (this.isCollided(otherObject)) {
      this.vx = -this.vx;
      this.vy = -this.vy;
    }

  }

}


class Square extends Figure {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy);
    let RandomSize = getRandomIntInclusive(30, 50);
    this.width = RandomSize;
    this.height = RandomSize;
    this.color = generateRandomColor();
    this.area = this.width * this.height;
    this.sizeX = this.width;
    this.sizeY = this.height;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  chackWallCollision() {
    if (this.y + this.vy > (canvas.height - this.sizeY) || this.y + this.vy < 0) {
      this.vy = -this.vy;
    }
    if (this.x + this.vx > (canvas.width - this.sizeX) || this.x + this.vx < 0) {
      this.vx = -this.vx;
    }
  }
  bounds() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };

  }
}

class Circle extends Figure {
  constructor(x, y, radius, vx, vy) {
    super(x + radius, y + radius, vx, vy);
    this.radius = radius;
    this.width = 2 * this.radius;
    this.height = 2 * this.radius;
    this.area = Math.floor(Math.PI * (this.radius ** 2));
  }
  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  chackWallCollision() {
    if (this.y + this.vy > (canvas.height - this.radius) || this.y + this.vy < this.radius) {
      this.vy = -this.vy;
    }
    if (this.x + this.vx > (canvas.width - this.radius) || this.x + this.vx < this.radius) {
      this.vx = -this.vx;
    }
  }
  bounds() {
    return {
      top: this.y - this.radius,
      bottom: this.y + this.radius,
      left: this.x - this.radius,
      right: this.x + this.radius,
    }

  }
}

setTimeout(function () {
  let interval = 2000;
  let c1 = new Canvas();
  c1.addFigure(new Square(0, 0, getRandomIntInclusive(1, 2), getRandomIntInclusive(2, 4)));
  for (let i = 2; i < 21; i++) {


    if (i % 2 === 0) {
      setTimeout(function () {
        let fig1 = c1.addFigure(new Circle(0, 0, getRandomIntInclusive(10, 30), getRandomIntInclusive(2, 4), getRandomIntInclusive(1, 2)));
        // if (fig1 === false) {
        //   i--;
        //   console.log(i);
        // }
      }, i * interval);
    } else {
      setTimeout(function () {
        let fig2 = c1.addFigure(new Square(0, 0, getRandomIntInclusive(1, 2), getRandomIntInclusive(2, 4)));
        // if (fig2 === false) {
        //   i--;
        // }
      }, i * interval);
    }

  }
  c1.animate();
}, 0);




