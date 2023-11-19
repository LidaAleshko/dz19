function ToDoList () {                                                      
    let todos = [
        {
            id: '1',
            task: 'Выучить js',
            isDone: false,
            isEdit: false,             
        },
        {
            id: '2',
            task: 'Выучить css',
            isDone: true,
            isEdit: false,               
        }
    ];                                                       

    this.init = (className) => {                                            
        const parentConteiner = document.querySelector(`.${className}`);    
        if(!parentConteiner) {                                              
            console.log('Ошибка в указании селектора класса');
            return;
        }
        
        const elementHTMLToDo = createHTMLToDo();                           
        parentConteiner.appendChild(elementHTMLToDo);                       
        addToDoInputEvent();                                                
        showToDoTask();
        addDeleteAllTodosEvent();    
        addDeleteAllTodosEventBtn();                           
        
    }
    const addDeleteAllTodosEventBtn = () => {
        const deleteAllBtnBtn = document.querySelector('.deleteall_btn');
        deleteAllBtnBtn.addEventListener('click', () =>{
            if (todos.length !== 0){
                todos = [];
                showToDoTask();
            }
            return;
        })
    };
    const addDeleteAllTodosEvent = () => {                                  
        const deleteAllBtn = document.querySelector('.delete__all__btn');  
        deleteAllBtn.addEventListener('click', () => {                      
            if(todos.length !== 0) {                                       
                todos = [];
                showToDoTask();
            }
            return;
        })
    }

    const addToDoInputEvent = () => {                                       
        const toDoInput = document.querySelector('.todo__input');           
        toDoInput.addEventListener('keydown', (event) => {                  
            if(event.keyCode === 13) {                                      
                todos.push(
                    {
                        id: `${new Date().getTime()}`,
                        task: event.target.value,
                        isDone: false,
                        isEdit: false,     
                    }
                )                       
                event.target.value = '';
                showToDoTask();
            }
        })
    }

    const createHTMLToDo = () => {                                          
        const todoElement = document.createElement('div');                  
        todoElement.classList.add('todo');                                  
        todoElement.innerHTML = `<div class="todo__wrapper">    
                                    <div class="todo__header">
                                    <button class="deleteall_btn">Удалить все</button>
                                        <h2>Список дел</h2>
                                        <input type="text" class="todo__input">
                                        <button class="delete__all__btn">Очистить список дел</button>
                                    </div>
                                    <div class="todo__body"></div>
                                 </div>`                                    
        return todoElement;                                                 
    }

    const showToDoTask = () => {                                            
        const todoBody = document.querySelector('.todo__body');
        if(todos.length === 0){
            todoBody.innerHTML = '<h2 class="empty__resalt">Список дел пуст</h2>';
            return;
        }

        console.log(todos);

        const ul = document.createElement('ul');
        ul.classList.add('todo__tasks');

        let listToDo = '';
        const chackEdit = checkEditTodoHelper();
        todos.forEach(({id, task, isDone, isEdit}) => {
            listToDo += `<li class="todo__task${isDone ? " isDone": ""}">
                            ${!isEdit ? `<input type="checkbox" ${isDone ? "checked": ""} id="${id}" class="todo__checkbox">
                            <p class="todo__task__content">${task}</p>
                            <button class="tood__delete__btn btn" ${!isDone ? "disabled": ""} data-delete="${id}">Удалить</button> 
                            <button class="tood__edit__btn btn" ${chackEdit ? "disabled": ""} data-edit="${id}">Редактировать</button>`
                            :`
                            <input type="text" value="${task}" class="todo__edit__input">
                            <button class="tood__edit__cancel btn" data-edit-cancel="${id}">Отменить</button>
                            <button class="tood__edit__save btn" data-edit-save="${id}">Сохранить</button>                            
                            `}                            
                        </li>`;
        })

        
        
        ul.innerHTML = listToDo;
        todoBody.innerHTML = '';
        todoBody.appendChild(ul);

        addCheckBoxEvent();        
        addDeleteTodoEvent();
        addEditTodoEvent();
        
        if(chackEdit) {
            addEditCancelTodo();
            addEditSavelTodo();
        }
        
    }

    const checkEditTodoHelper = () => {
        return todos.some(({isEdit}) => isEdit)
    }

    const addEditCancelTodo = () => {
        const cancelButton = document.querySelector('.tood__edit__cancel');
        cancelButton.addEventListener('click', (event) => {
            const btn = event.target;
            const todoId = btn.dataset.editCancel;
            // todos = todos.map((todo) => {
            //     if(todo.id === todoId){
            //         todo.isEdit = false;
            //     }
            //     return todo;
            // });
            todos = todos.map((todo) => ({                           
                    ...todo,                                  
                    ...(todo.id === todoId ? {isEdit: false} : undefined)
                })
            );
            showToDoTask();
        })
    }

    const addEditSavelTodo = () => {
        const saveButton = document.querySelector('.tood__edit__save');
        saveButton.addEventListener('click', (event) => {
            const btn = event.target;
            const todoId = btn.dataset.editSave;
            const newTaskValue = document.querySelector('.todo__edit__input').value;
            todos = todos.map((todo) => {
                if(todo.id === todoId){
                    todo.isEdit = false;
                    todo.task = newTaskValue;
                }
                return todo;
            });           
            showToDoTask();
        })
    }

    const addEditTodoEvent = () => {
        const editButtons = document.querySelectorAll('.tood__edit__btn');
        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', (event) => {
                const btn = event.target;
                const todoId = btn.dataset.edit;                     
                todos = todos.map((todo) =>{
                    if(todo.id === todoId){
                        todo.isEdit = true;
                    }
                    return todo;
                });
                showToDoTask();
            })
        })
    }

    const addDeleteTodoEvent = () => {
        const deleteButtons = document.querySelectorAll('.tood__delete__btn');
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', (event) => {
                const btn = event.target;
                const todoId = btn.dataset.delete;        
                const isDisabled = btn.disabled;
                todos = todos.filter((todo) => todo.id !== todoId);
                showToDoTask();
            })
        })
    }

    const addCheckBoxEvent = () => {
        const checkBoxs = document.querySelectorAll('.todo__checkbox');    
        checkBoxs.forEach((checkbox) => {                                 
            checkbox.addEventListener('change', (event) => {
                const todoId = event.target.id;
                changeStatusTodo(todoId);
            })
        })
    }

    const changeStatusTodo = (todoId) => {
        todos = todos.map((todo) => {
            if(todo.id === todoId) {
                todo.isDone = !todo.isDone
            }
            return todo
        })
        showToDoTask();
    }
}

window.addEventListener('load', () => {                                     
    const todo = new ToDoList();                                            
    todo.init('app');                                                       
    
})


