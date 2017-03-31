// 定义进度：完成
'use strict';



// Wall
exports.Wall = function() {
};
// Plant
exports.Plant = function() {
    this.energy = 3 + Math.random() * 4;  // 3~7
};
exports.Plant.prototype.act = function (view) {
    if (this.energy > 15) {
        var space = view.find(' ');
        if (space)
            return { type: 'reproduce', direction: space };
    }
    if (this.energy < 20)
        return { type: 'grow' };
};

// PlantEater
exports.PlantEater = function() {
    this.energy = 20;
};
exports.PlantEater.prototype.act = function(view) {
    var space = view.find(' ');
    if (this.energy > 60 && space)
        return { type: 'reproduce', direction: space };
    var plant = view.find('*');
    if (plant)
        return { type: 'eat', direction: plant };
    if (space)
        return { type: 'move', direction: space };
};

// MeatEater
exports.MeatEater = function() {
    this.energy = 25;
};
exports.MeatEater.prototype.act = function(view) {
    var critter = view.find('o');
    if (critter) {
        return { type: 'eat', direction: critter };
    }
    var space = view.find(' ');
    if (space) {
        if (this.energy >= 60) {
            return { type: 'reproduce', direction: space };
        }
        return { type: 'move', direction: space };
    }
};