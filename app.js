// 运行结果：成功
'use strict';

// get module world
var world = require('./mod/mod_world');
var critter = require('./mod/mod_critter');

// map
var map = [
    '###############################',
    '#     #***  #    o    o      ##',
    '#    o# *   #                 #',
    '#                 ########    #',
    '#      x ******               #',
    '####          ##      # x     #',
    '#       ##    o               #',
    '#       ##        *****  ######',
    '#   o  ****      o ##*      * #',
    '#        **    o          *** #',
    '#   ***#   o        **********#',
    '###############################',
];

// legend
var legend = {
    '#': 'Wall',
    '*': 'Plant',
    'o': 'PlantEater',
    'x': 'MeatEater',
    'string': {
        '*': 'plant',
        'o': 'plant eater',
        'x': 'meat eater',
    },
};

// instance the world
world.getMapLegend(map, legend);
world.getCritter(critter);
world.instance();

// define the check-system
function checkTheSystem(world, legend) {
    var cmap = {};
    for (var critterName in legend) {
        if (critterName == '#' || critterName == 'string') continue;
        var n = 0;
        world.grid.space.forEach(function (curob) {
            if (curob && curob.originChar == critterName) n++;
        });
        cmap[critterName] = n;
    }
    for (var critterName in legend) {
        if (critterName == '#' || critterName == 'string') continue;
        if (cmap[critterName] == 0) {
            console.log('The critter \'' + legend.string[critterName] + '\' has died out.');
        }
        else {
            console.log('The number of critter \'' + legend.string[critterName] + '\' is ' + cmap[critterName] + '.');
        }
    }
}

// start the world
console.log(world.toString());
for (var i = 0; i < 2000; i++) {
    world.turn();
}
console.log('after ' + i + ' turns:');
console.log(world.toString());
checkTheSystem(world.world, legend);