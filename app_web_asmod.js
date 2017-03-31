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

// main function
function mainRun() {

    // instance the world
    world.getMapLegend(map, legend);
    world.getCritter(critter);
    world.instance();

    // start the world and make the output
    var result = world.toString();
    for (var i = 0; i < 2000; i++) {
        world.turn();
    }
    result += ("After " + i + " turns:\n");
    result += world.toString();
    result += checkTheSystem(world.world, legend);
    return result;
}


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
    var output = "";
    for (var critterName in legend) {
        if (critterName == '#' || critterName == 'string') continue;
        if (cmap[critterName] == 0) {
            output += 'The critter \'' + legend.string[critterName] + '\' has died out.\n';
        }
        else {
            output += 'The number of critter \'' + legend.string[critterName] + '\' is ' + cmap[critterName] + '.\n';
        }
    }
    return output;
}

// export
exports.mainRun = function() {
    return mainRun();
};