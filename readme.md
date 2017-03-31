# Project World

这个项目（来自 *EloquentJavascript* ）模拟简单的生态系统，用字符来代替各种生物。通过定义它们的随机行为来得到不同的运行结果。  
  
你可以通过修改代码来改变世界的运行次数，下面来讲解一下两种版本的不同运行方式和修改运行次数的方法。

![example](https://cl.ly/0c241y0T390Z/Image%202017-03-31%20at%207.39.28%20PM.png)

## app.js

可以用 node 运行此文件来查看模拟结果。默认运行次数是 2000.

    function checkTheSystem(world, legend) 

这个 checkTheSystem 函数用来检查世界的状态并打印出当前生物的种类和数量。需要检查世界状态的时候就可以调用它来完成任务。
  
当你需要修改世界运行次数时，修改下面的代码：

    for (var i = 0; i < 2000; i++) {
        world.turn();
    }

修改其中的 i 变量的范围到你想要的次数即可。
  
本程序中，由 world 模块导出的 world.turn() 接口是驱动世界运行的引擎，执行它一次即世界运行一次。world.toString() 接口用于返回表示虚拟世界的字符串。

## app_web_asmod.js

本文件是 app.js 的模块化版本，将运行世界部分的代码打包为一个 mainRun() 函数并将返回它结果的函数暴露为接口。
  
同时，checkTheSystem() 函数也做了相应更改来适应返回值需要的改变（嵌入到 html 内容中的时候使用预格式文本标签）。
  
你可以在 node 中将本模块导入并执行 run() 函数来得到运行结果。
  
实例代码：

    const world = require('.../app_web_asmod');
    var result = world.run();
    // 将 result 变量用到生成的网页内容中即可。

## ./mod/mod_critter.js

本模块中存放生物的构造函数并导出被 world 模块使用。

## ./mod/mod_world.js

虚拟世界的主体部分，有各种动作处理器，需要导入 critter 模块。可以在此文件中定义你自己的动作种类。

## legend & map

legend 是图例，里面定义了地图中不同字符所对应的构造函数的名称。它的 string 属性中保存的是所有**生物**字符的名称，用于 checkTheSystem() 函数生成状态报告。map 是定义地图的变量，要注意的是要将地图定义为一个矩形。
