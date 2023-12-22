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
        const messagesInitially = localStorage.getItem('messages');
        let lastMessageId=0;
        if(messagesInitially === null)
        {
            const res = await axios.get(`http://localhost:3000/fetchMessages?lastMessageId=${lastMessageId}`);
            console.log(res.data);
            localStorage.setItem("messages", JSON.stringify(res.data));
            printMessages();
        }
        else
        {
            const messagestoUpdate = JSON.parse(localStorage.getItem('messages'));
            lastMessageId = messagestoUpdate[messagestoUpdate.length-1].id;
            const res = await axios.get(`http://localhost:3000/fetchMessages?lastMessageId=${lastMessageId}`);
            console.log(res.data);
            const updatedMessages = messagestoUpdate.concat(res.data);
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            printMessages();
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

function printMessages()
{
    const messages = JSON.parse(localStorage.getItem("messages"));
    list.innerHTML=``;
    messages.forEach((message)=>{
        var li = document.createElement('li');
        li.className = 'messageList'
        li.appendChild(document.createTextNode(`${message.sentBy} : ${message.text}`));
        list.appendChild(li);
    })
}

setInterval(renderMessages,1000);