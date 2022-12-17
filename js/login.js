// login funtions
const loginButtons = document.querySelector('.loginButtons');
const loginContent = document.querySelector('#login');

loginButtons.addEventListener('click',function(e){
    const user = loginContent.querySelector(".username");
    const passwd = loginContent.querySelector(".password");

    if(e.target.innerHTML==='Sign in'){
        loginFn(user,passwd);
    }else if(e.target.innerHTML==='Reset'){
        user.value = '';
        passwd.value = '';
        loginContent.querySelector(".errorMsg").style.display = "none";
    }else if(e.target.innerHTML === 'Register'){
        loginContent.querySelector(".errorMsg").style.display = "none";
        document.querySelector("#register").style.display = "block";
        loginContent.style.display = 'none';
        
    }
})

var loginFn = function(user,passwd){
    if (user.value === '' || passwd.value === ''){
        errorFn('Cannot empty!');
        return;
    }

    const xhr=new XMLHttpRequest();
    xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/login");
    var content={"type":"login","user":user.value,"password":passwd.value};
    xhr.send(JSON.stringify(content));

    xhr.onerror=function(){
        alert("Send request failed!");
    }

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                var statusCode=JSON.parse(xhr.response).statusCode;
                if (statusCode === 200){
                    loginContent.querySelector(".errorMsg").style.display = "none";
                    localStorage.setItem("username",user.value);
                    localStorage.setItem("password",passwd.value);
                    location.replace('./html/homePage.html');
                    // console.log(JSON.parse(xhr.response).body);
                } else if(statusCode === 401){
                    errorFn('NO AUTHENTICATION!');
                } else{
                    errorFn('Please try later!');
                }
            }else{
                errorFn('Network error!');
            }
        }
    }
}

const errorFn = function(msg){
    const errorMsg = loginContent.querySelector(".errorMsg");
    errorMsg.innerHTML = 'Network error!';
    errorMsg.style.display = "block";
}