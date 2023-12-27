const form = document.getElementById('msg');
form.addEventListener('submit', sendMessage);
const list = document.getElementById('messages');

async function sendMessage(e)
{
    e.preventDefault();
    var text = document.querySelector('#msg-text').value;
    const token = localStorage.getItem('token');
    const tokenDetails = getTokenDetails(token);
    const groupId = localStorage.getItem('groupId');
    const message = {
        message : text,
        user : tokenDetails.userId,
        groupId : groupId
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
    getUserGroups();
  });

async function renderMessages()
{
    try
    {
        const messagesInitially = localStorage.getItem('messages');
        const groupId = localStorage.getItem('groupId');
        let lastMessageId=0;
        if(messagesInitially === null)
        {
            const res = await axios.get(`http://localhost:3000/fetchMessages?lastMessageId=${lastMessageId}&groupId=${groupId}`);
            localStorage.setItem("messages", JSON.stringify(res.data));
            printMessages();
        }
        else
        {
            const messagestoUpdate = JSON.parse(localStorage.getItem('messages'));
            lastMessageId = messagestoUpdate[messagestoUpdate.length-1].id;
            const res = await axios.get(`http://localhost:3000/fetchMessages?lastMessageId=${lastMessageId}&groupId=${groupId}`);
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
getAllUsers();

async function getAllUsers()
{
    const res = await axios.get(`http://localhost:3000/getAllUsers`);
    //console.log(res.data);
    setUsers(res.data);
}
const userList = document.getElementById('participants');
function setUsers(users)
{
    users.forEach((user)=>{
        var li = document.createElement('li');
        var input = document.createElement('input');
        input.setAttribute("type", "checkbox");
        input.value = user.id;
        input.name = 'user';
        li.appendChild(input);
        li.id = user.id;
        li.appendChild(document.createTextNode(`${user.name}`));
        userList.appendChild(li);
    })
}

const groupForm = document.getElementById('data-received');

groupForm.addEventListener('submit', getGroupDetails);

async function getGroupDetails(e)
{
    e.preventDefault();
    var groupName = document.getElementById('group-name').value;
    var groupDescription = document.getElementById('group-description').value;
    var checkboxes = document.querySelectorAll('input[name="user"]:checked');
    const token = localStorage.getItem('token');
    let users = [];
    checkboxes.forEach((checkbox)=>{
        users.push(checkbox.value);
    })
    const data ={
        name : groupName,
        memberIds : users
    }
    const res = await axios.post(`http://localhost:3000/addGroup`, data, { headers: {Authorization : token}});
    console.log(res);
}

async function getUserGroups()
{
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/getGroups', { headers: {Authorization : token}});
    displayGroups(res.data);
}

const groupList = document.getElementById('grouplist');

groupList.addEventListener('click', (e)=>{
    console.log(e.target.id)
    localStorage.setItem('groupId', e.target.id);
    localStorage.removeItem('messages');
    renderMessages();
})

function displayGroups(groups)
{
    console.log(groups);
    groups.groups.forEach((group)=>{
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(`${group.name}`));
        li.id = group.id;
        li.className = 'groupList';
        groupList.appendChild(li);
    })
}

var checkList = document.getElementById('list1');
checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}

