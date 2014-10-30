(function(){

// set header-side link
util.setSideLink('返回', './index.html');

X.ready(function(){
    // get model
    var Task = X.model('Task', util.Task);

    // doms
    var main = $('#main'),
        personList = $('#person-list'),
        list = $('#list'),
        downLink = $('#down-link');

    // render list method
    var renderList = function(tasks){
        // do transform (task list -> data including projects)
        var data = util.transform(tasks);

        // person list
        var exists = {},
            persons = tasks.map(function(task){
            return task.person;
        }).filter(function(person){
            return exists[person] ? false : (exists[person] = true);
        });
        personList.innerHTML = '已提交：' + persons.join('，');

        // list
        list.innerHTML = template('template-list', data);

        // dowload link
        var downContent = data.projects.map(function(project){
            return $.format('${project}：\r\n\r\n\t${tasks}', {
                project: project.name,
                tasks: project.tasks.map(function(task, i){
                    task.seq = i + 1;
                    return $.format('${seq}. ${cnt} （${status}） 【${person}】', task);
                }).join('\r\n\t')
            });
        }).join('\r\n\r\n');
        downLink.download = 'weekly-' + util.currWeek + '.txt';
        downLink.href = URL.createObjectURL(new Blob([downContent]));
    };

    // get list and render
    Task.list({
        week: util.currWeek
    }, function(err, list){
        if(err){
            alert(err);
        }else{
            renderList(list);
            main.show();
        }
    });
});

})();