// 定义进度：完成
'use strict';






/* functions and variable needed */
// Vector
function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.plus = function (other) {
    return new Vector(this.x + other.x, this.y + other.y);
};
// grid
function Grid(width, height) {
    this.space = Array(width * height);
    this.width = width;
    this.height = height;
}
Grid.prototype.isInside = function (vector) {
    return vector.x >= 0 && vector.x < this.width &&
        vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function (vector) {
    return this.space[vector.x + vector.y * this.width];
};
Grid.prototype.set = function (vector, value) {
    this.space[vector.x + vector.y * this.width] = value;
};

// randomElement
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
// elementFromChar
function elementFromChar(legend, ch) {
    if (ch == ' ') return null;
    var element = new critter[legend[ch]]();
    element.originChar = ch;
    return element;
}
// charFromElement
function charFromElement(element) {
    if (element == null) return ' ';
    else return element.originChar;
}
// View
function View(world, vector) {
    this.world = world;
    this.vector = vector;
}
View.prototype.look = function (dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
        return charFromElement(this.world.grid.get(target));
    else
        return '#';
};
View.prototype.findAll = function (ch) {
    var found = [];
    for (var dir in directions)
        if (this.look(dir) == ch)
            found.push(dir);
    return found;
};
View.prototype.find = function (ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
};
// dirPlus
function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
}
// variable
// directions
var directions = {
    'n': new Vector(0, -1),
    'ne': new Vector(1, -1),
    'e': new Vector(1, 0),
    'se': new Vector(1, 1),
    's': new Vector(0, 1),
    'sw': new Vector(-1, 1),
    'w': new Vector(-1, 0),
    'nw': new Vector(-1, -1),
};
// directionNames
var directionNames = 'n ne e se s sw w nw'.split(' ');
// actionTypes
var actionTypes = Object.create(null);
actionTypes.grow = function (critter) {
    critter.energy += 0.5;
    return true;
};
actionTypes.move = function (critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    if (dest == null || critter.energy < 1 || this.grid.get(dest) != null)
        return false;
    critter.energy -= 1;
    this.grid.set(vector, null);
    critter.x = dest.x;
    critter.y = dest.y;
    this.grid.set(dest, critter);
};
actionTypes.eat = function (critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    var atDest = dest != null && this.grid.get(dest);
    if (!atDest || atDest.energy == null)
        return false;
    critter.energy += atDest.energy;
    this.grid.set(dest, null);
    return true;
};
actionTypes.reproduce = function (critter, vector, action) {
    var baby = elementFromChar(this.legend, critter.originChar);
    var dest = this.checkDestination(action, vector);
    if (dest == null ||
        critter.energy <= 2 * baby.energy ||
        this.grid.get(dest) != null)
        return false;
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
};
// world
function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;
    map.forEach(function (line, y) {
        var cur;
        for (var x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
            cur = grid.get(new Vector(x, y));
            if (cur && cur.act) {
                cur.x = x;
                cur.y = y;
            }
        }
    });
}
World.prototype.toString = function () {
    var output = '';
    for (var y = 0; y < this.world.grid.height; y++) {
        for (var x = 0; x < this.world.grid.width; x++) {
            var element = this.world.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += '\n';
    }
    return output;
};
World.prototype.turn = function () {
    var acted = [];
    this.world.grid.space.forEach(function (critter) {
        if (critter && critter.act && acted.indexOf(critter) == -1) {
            acted.push(critter);
            this.world.letAct(critter, new Vector(critter.x, critter.y));
        }
    }, this);
};
World.prototype.letAct = function (critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type == 'move') {
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) == null) {
            this.grid.set(vector, null);
            var nextv = vector.plus(directions[action.direction]);
            critter.x = nextv.x;
            critter.y = nextv.y;
            this.grid.set(dest, critter);
        }
    }
};
World.prototype.checkDestination = function (action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest)) return dest;
    }
};
// LifeLikeWorld
function LifeLikeWorld(map, legend) {
    World.call(this, map, legend);
}
LifeLikeWorld.prototype = Object.create(World.prototype);
LifeLikeWorld.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    var handled = action &&
        action.type in actionTypes &&
        actionTypes[action.type].call(this, critter, vector, action);
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0) this.grid.set(vector, null);
    }
};





// get the value
var map;
var legend;
var critter;



/* exports */

// getMapLegend
exports.getMapLegend = function(mapin, legendin) {
    map = mapin;
    legend = legendin;
};

// getCritter
exports.getCritter = function(critterin) {
    critter = critterin;
};

// instance
exports.instance = function() {
    exports.world = new LifeLikeWorld(map, legend);
    exports.toString = exports.world.toString;
    exports.turn = exports.world.turn;
};