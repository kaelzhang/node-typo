'use strict';

var async = module.exports = {};

// the `require('async').waterfall` is buggy,
// which could not maintain sync if all tasks are sync

// implement a simple waterfall function, only passing one extra argument
async.waterfall = function(tasks, callback) {
    var pointer = 0;

    // async.waterfall([
    //     function(done){
    //         done(null, value1)
    //     },

    //     // prev -> value1
    //     function(prev, done){
    //         done(null, value2)
    //     }

    // // result -> value2
    // ], function(err, result) {
        
    // })
    function process_task(err, value){
        var i = pointer ++;
        var task = tasks[i];

        if(task && !err){
            i == 0 ? task(process_task) : task(value, process_task);
        }else{
            callback(err, value);
        }
    }

    process_task();
};


// a very simple `async.parallel`
async.parallel = function(tasks, callback) {
    
    var i = 0;
    var len = tasks.length;
    var counter = len;
    var task;
    var error = false;

    function poll(err){
        -- counter;
        if((error = err) || counter === 0){
            callback(err);
        }
    }

    for(; i < len; i ++){
        task = tasks[i];

        if(!error){

            // has no `done` param, task is considered as sync method
            if(task.length === 0){
                task();
                poll(); // without error

            }else{
                task(poll);
            }

        }else{
            break;
        }
    }
};