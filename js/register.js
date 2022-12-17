// register functions
const registerButtons = document.querySelector('.registerButtons');
const registerContent = document.querySelector("#register");
const user = registerContent.querySelector(".username");
const passwd = registerContent.querySelector(".password");
const re_pass= registerContent.querySelector('.re_pass');

registerButtons.addEventListener("click",function(e) {

    if(e.target.innerHTML === 'Cancel'){
        // return to login page
        clear();
        document.querySelector("#login").style.display = "block";
        registerContent.style.display = 'none';
    }else if(e.target.innerHTML==='Reset'){
        clear();
    }else if (passwd.value===re_pass.value){
        // e.target.innerHTML==='Finish'
        registerFn();
    }else{
        // error message
        regErrorFn("Password doesn't match!");
    }

})

const clear = function() {
    user.value = '';
    passwd.value = '';
    re_pass.value = '';
    registerContent.querySelector(".errorMsg").style.display = "none";
}

const regErrorFn = function(msg){
    const errorMsg = registerContent.querySelector(".errorMsg");
    errorMsg.innerHTML = msg;
    errorMsg.style.display = "block";
}

const registerFn = function(){

    if (user.value === '' || passwd.value === '' || re_pass.value === ''){
        regErrorFn("Connot be empty!");
        return;
    }

    const xhr=new XMLHttpRequest();
    xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/login");
    var content={"type":"register","user":user.value,"password":passwd.value};
    xhr.send(JSON.stringify(content));

    xhr.onerror=function(){
        regErrorFn("Network Error!");
    }

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                var statusCode=JSON.parse(xhr.response).statusCode;
                if (statusCode === 200){
                    localStorage.setItem("username",user.value);
                    localStorage.setItem("password",passwd.value);
                    clear();
                    location.replace('./html/homePage.html');
                    // console.log(JSON.parse(xhr.response));
                } else if (statusCode === 401){
                    regErrorFn('Username has been used!');
                } else {
                    regErrorFn('Please try later!');
                }
            }else{
                regErrorFn('Network error!');
            }
        }
    }
}