
const inputElement = document.getElementById('inputElement');
const TasksContainer = document.getElementById('TasksContainer');
const plusIconElement = document.getElementById('plusIcon');
const newTaskContainer = document.getElementById('newTaskContainer');
const buttons = document.querySelectorAll('button:not(#cancelButton):not(#okButton)');
const container=document.getElementById("container");
const actionsContainer = document.getElementById("actionContainer");
const okButton = document.getElementById('okButton');
const contactRegex = /^@[A-Za-z0-9.-]+$/;
const stateRegex = /^#[A-Za-z0-9.-]+$/;
const emailRegex = /([a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9._-]+)/;
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&\=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\=]*)?/;
const dateRegex =[/^\d{4}-\d{2}-\d{2}$/, /^\d{2}-\d{2}-\d{4}$/];


window.onload=initState();
let inputBuffer="";

function initState() {
  actionsContainer.style.visibility="hidden";
  inputElement.textContent="Type to add a task";
  inputElement.style.visibility="visible";
  container.style.visibility="hidden";
  plusIconElement.style.visibility="visible";

}


function isEmail(text) {
    return emailRegex.test(text);
}


function isURL(text) {
    return urlRegex.test(text);
}
    

function isContact(text) {
    return contactRegex.test(text);
}
    

function isState(text) {
    return stateRegex.test(text);
}

    
function isDate(text) {
    let match=false;
    
    for (let index = 0; index < urlRegex.length; index++) {
        match = dateRegex[index].test(text);
        if (match==true) {
            return match;
        }
    }
    return match;             
}


function insertSpan(text) {
    if (!text.trim()) return; // No insertar spans vacíos

    // Crear un nuevo span
    const span = document.createElement("span");
    span.textContent = text;
        
    // Asignar clase dependiendo del tipo de texto
    if (isEmail(text)) {
        span.className = "email";
    } else if (isURL(text)) {
        span.className = "url";
    } else if (isState(text)) {
        span.className = "state";
    } else if (isDate(text)) {
        span.className = "date";
    }else if (isContact(text)) {
        span.className = "contact";
    } else {
        span.className = "default";
    }

    // Insertar el span en el div
    inputElement.appendChild(span);
        
    // Insertar un espacio después del span
    const space = document.createTextNode(" ");
    inputElement.appendChild(space);

    // Colocar el cursor al final del contenido editable
    setCursorToEnd(space);
}


function setCursorToEnd(element) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false); // Mueve el cursor al final

    selection.removeAllRanges();
    selection.addRange(range);

    element.focus();
}


// Manejar entrada del usuario
inputElement.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        // Evitar que se inserte un espacio adicional en el contenido editable
        event.preventDefault();

        // Obtener el contenido antes del cursor
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textBeforeSpace = range.startContainer.textContent.trim();

        // Limpiar el contenido antes de crear el nuevo span
        range.startContainer.textContent = "";

        // Insertar el nuevo span con el texto capturado
        insertSpan(textBeforeSpace);
    }
    
    if (event.key ==="Enter"){
        event.preventDefault();//evitar saltos de linea al presionar Enter
    }

    if (event.key ==="Backspace"){
        
        if(inputElement.hasChildNodes()==true ){
            //Elimina los span uno por uno
            inputElement.removeChild(inputElement.lastChild);
        }
        
        if(inputElement.childElementCount < 1){
            buttons.forEach(button => button.disabled = true);
        }     
    }
});




/*if empty input then disable the action buttons*/
inputElement.addEventListener('input', (event) => {
    if(inputElement.hasChildNodes()==false ){
        buttons.forEach(button => button.disabled = true);
        inputElement.removeAllRanges;
    }
    else {
        buttons.forEach(button => button.disabled = false);
    }
});


inputElement.addEventListener('click',()=>{
    if (inputElement.childElementCount==0){
        showElements(); 
        inputElement.textContent="";
    }    
});


function showElements() {
    actionsContainer.style.visibility="visible";
    container.style.visibility="visible";
    
    newTaskContainer.style.boxShadow="1px 1px  1px #c1c7d0";
    buttons.forEach(button => button.disabled = true);
}


function cancelFunction() {
    inputElement.textContent="";
    initState();
}

okButton.addEventListener('click',()=>{
    
    //vuelve al estado inicial si la entrada esta vacia
    if (inputElement.textContent == ""){
        initState();
    }
    else{
        //evitar introducir la misma tarea
        if (inputElement.textContent != inputBuffer) {
            if(inputElement.textContent != "type to add a task"){
            
                //llamar a funcion para guarduar
                guardartask(inputElement.innerHTML);
                //guardar el texto en el buffer
                inputBuffer = inputElement.textContent;
                
                initState();
            }
        }
        else{
            console.log("ya la tarea existe");
        }
    }
});


function guardartask(dataTask) {
    const list={
        'content':dataTask
    }
    
    fetch('http://127.0.0.1:8000/task',{
        
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(list)
    })
    .then(response => response.json())
    .then(data =>{
        console.log('Server Response :',data);
    })
    .catch(error =>{
        console.error('Error al enviar el POST:', error);
    });

    getDatafromDB();
}


document.addEventListener('DOMContentLoaded', () => {
    getDatafromDB();
  });


  function getDatafromDB() {

    const dbContent = document.querySelectorAll(".dbElement")

    fetch('http://127.0.0.1:8000/task')
    .then(response => response.json())
    .then(data => {
        console.log('Server Response :',data);
        let count=0;  
        data.forEach(task => {
        dbId=dbContent[count].firstElementChild.id;
        contentItem = document.getElementById(dbId);
        console.log(contentItem);
        contentItem.innerHTML = task.content;
        count+=1;
      
      });
    });
    
  }
