var saveData = (function () { 
    var a = document.createElement("a"); 
    document.body.appendChild(a); 
    a.style = "display: none"; 
    return function (data, fileName) { 
        var json = JSON.stringify(data), 
            blob = new Blob([json], {type: "octet/stream"}), 
            url = window.URL.createObjectURL(blob); 
        a.href = url; 
        a.download = fileName; 
        a.click(); 
        window.URL.revokeObjectURL(url); 
    }; 
}()); 

var data = {},
    fileName = document.querySelector('#fileName'),
    javaVariables = []
    keys = [];
const JSONkey = document.querySelector('#key');
const JSONvalue = document.querySelector('#value');

function generate_Java_template(key){
    var template = `String ${key} = HtmlEscape.unescapeHtml((String) fetchValueMap.get("${key}"));`
    javaVariables.push(template);
}
function showJSON(){
    let container = document.querySelector("#jsonView");
    container.innerHTML = "";
    for(let key in data){
    container.innerHTML += `<li class="bg-light py-1 px-1 br-8 mt-1">${key} : ${data[key]}</li>`;   
    } 
}
function generateJSON(){
    let fileName_with_ext = fileName.value+".json";
    saveData(data, fileName_with_ext);
}
function generate_Java_Variables(){
    let container = document.querySelector("#javaVariables");
    container.innerHTML = "";
    javaVariables.map((template)=>{
        container.innerHTML+=`<li  class="bg-light py-1 px-1 br-8 mt-1">${template}</li>`;
    });
}
function generate_keys(){
    let container = document.querySelector("#keys");
    container.innerHTML = "";
    keys.map((template)=>{
        container.innerHTML+=`<li  class="bg-light py-1 px-1 br-8 mt-1"><%=${template}></li>`;
    });
}

function delete_data(){
    if(JSONkey.value == ""){
        window.alert("Enter data to delete");
    }
    else{
        delete data[JSONkey.value];
        keys.map((key,index)=>{
            if(key == JSONkey.value){
                keys.splice(index,1);
            }
        })
        javaVariables.map((data,index)=>{
            let template = data.toString();
         if(template.includes(JSONkey.value)){
             javaVariables.splice(index,1);
             }
         })
        showJSON();        
        generate_Java_Variables();
        generate_keys();
    }
}
function addData(){
    if(JSONkey.value && JSONvalue.value && fileName.value){
        data[JSONkey.value] = JSONvalue.value;
        keys.push(JSONkey.value);
        generate_Java_template(JSONkey.value);
        showJSON();
        generate_Java_Variables();
        generate_keys();
        JSONkey.value = "";
        JSONvalue.value = "";    
    }else{
        window.alert('Enter filename,key and value')
    }
}

function copy_text(container) {
    const str = document.getElementById(`'${container}'`).innerText;
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

document.addEventListener('keyup',(event)=>{
    if(event.keyCode == 13){
        addData();
    }
    if(event.keyCode == 46){
        delete_data();
    }
    if ( event.keyCode === 27 ) { //ESC key code
        JSONkey.focus();
    }
});