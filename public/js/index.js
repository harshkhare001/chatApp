const form = document.getElementById('msg');
form.addEventListener('submit', sendMessage);
const list = document.getElementById('messages');

async function sendMessage(e)
{
    e.preventDefault();
    var text = document.querySelector('#msg-text').value;
    const token = localStorage.getItem('token');
    const tokenDetails = getTokenDetails(token);
    const message = {
        message : text,
        user : tokenDetails.userId
    }
    console.log(message);
    try
    {
        const res = await axios.post("http://localhost:3000/getmessage", message);
        console.log(res);
        document.querySelector('#msg-text').value ='';
        window.location.reload();
    }
    catch(err)
    {
        console.log(err);
    }
}

function getTokenDetails(token)
{
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
    renderMessages();
  });

async function renderMessages()
{
    try
    {
        const res = await axios.get("http://localhost:3000/fetchMessages");
        printMessages(res.data)
    }
    catch(err)
    {
        console.log(err);
    }
}

function printMessages(messages)
{
    console.log(messages);
    messages.forEach((message)=>{
        var li = document.createElement('li');
        li.className = 'messageList'
        li.appendChild(document.createTextNode(`${message.sentBy} : ${message.text}`));
        list.appendChild(li);
    })
}