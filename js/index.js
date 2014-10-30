(function(){

// set header-side link
util.setSideLink('本周周报', './list.html');

// doms
var list = $('#list');

// inputs
var inputs = {
    person: $('#person-in'),
    project: $('#project-in'),
    task: $('#task-in'),
    status: $('#status-in')
};

// validate inputs method
var validate = function(){
    var legal = true;

    $.forEach(inputs, function(input, name){
        if(name !== 'status' && !input.value){
            input.addClass('invalid');
            return (legal = false);
        }
    });

    return legal;
};

// restore username
localStorage.username && (inputs.person.value = localStorage.username);

X.ready(function(){
    // get model
    var Task = X.model('Task', util.Task);

    // render list & bind events
    var renderList = function(tasks){
        var data = util.transform(tasks);

        // render list
        list.innerHTML = template('template-list', $.extend(data, {
            removeable: true
        }));

        // bind events (remove btn)
        list.findAll('.j-remove').forEach(function(removeBtn){
            var taskId = removeBtn.getAttribute('data-task-id');

            removeBtn.on('click', function(e){
                Task.remove({
                    _id: taskId
                }, function(err, result){
                    if(err) alert(err);
                    else refreshList();
                });
            });
        });
    };

    // fetch task list & render list
    var refreshList = function(){
        Task.list({
            week: util.currWeek,
            person: inputs.person.value
        }, function(err, tasks){
            if(err) alert(err);
            else renderList(tasks);
        });
    };

    // refresh list while person-input blurs
    inputs.person.on('blur', function(e){
        // save to local
        localStorage.username = inputs.person.value;

        refreshList();
    });

    // do create task then refresh list while submit clicked
    $('#submit').on('click', function(e){
        if(!validate()) return;

        var task = {
            person: inputs.person.value,
            project: inputs.project.value,
            cnt: inputs.task.value,
            status: inputs.status.value,
            week: util.currWeek
        };

        Task.create(task, function(err, task){
            if(err) alert(err);
            else refreshList();
        });
    });

    // refresh list
    refreshList();
});

})();