const socket = io(window.location.origin);

const form = document.getElementById('msg');
form.addEventListener('submit', sendMessage);
const list = document.getElementById('messages');
const url = 'http://43.204.215.81:3000';



socket.on('group-message', (groupId)=>
{
    const groupid = localStorage.getItem('groupId');
    if(groupId === groupId)
    {
        renderMessages();
    }
})

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
        const res = await axios.post(`${url}/getmessage`, message);
        document.querySelector('#msg-text').value ='';

        socket.emit('new-group-message', groupId);
        renderMessages();
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
            const res = await axios.get(`${url}/fetchMessages?lastMessageId=${lastMessageId}&groupId=${groupId}`);
            localStorage.setItem("messages", JSON.stringify(res.data));
            printMessages();
        }
        else
        {
            const messagestoUpdate = JSON.parse(localStorage.getItem('messages'));
            lastMessageId = messagestoUpdate[messagestoUpdate.length-1].id;
            const res = await axios.get(`${url}/fetchMessages?lastMessageId=${lastMessageId}&groupId=${groupId}`);
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
    openGroupOnRefresh();
}

//setInterval(renderMessages,1000);
getAllUsers();

async function getAllUsers()
{
    const res = await axios.get(`${url}/getAllUsers`);
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
    const res = await axios.post(`${url}/addGroup`, data, { headers: {Authorization : token}});
    console.log(res);
    window.location.reload();
}

async function getUserGroups()
{
    const token = localStorage.getItem('token');
    const res = await axios.get(`${url}/getGroups`, { headers: {Authorization : token}});
    displayGroups(res.data);
}

const groupList = document.getElementById('grouplist');

groupList.addEventListener('click', openGroup)


async function openGroup(e)
{   
    document.getElementById('addUserToGroup').style.visibility = 'hidden';
    document.getElementById('removeUser').style.visibility = 'hidden';
    document.getElementById('groupMembers').style.visibility = 'visible';
    const groupid = e.target.id;
    const res = await axios.get(`${url}/getGroupDetails?groupId=${groupid}`);
    document.getElementById('groupNameFinal').innerHTML=`${res.data.name}`;
    const token = localStorage.getItem('token');
    const data = getTokenDetails(token);
    if(data.userId === res.data.AdminId)
    {
        document.getElementById('addUserToGroup').style.visibility = 'visible';
        document.getElementById('removeUser').style.visibility = 'visible';
    } 
    localStorage.setItem('groupId', e.target.id);
    localStorage.removeItem('messages');
    renderMessages();
}

async function openGroupOnRefresh(e)
{   
    document.getElementById('groupMembers').style.visibility = 'visible';
    const groupid = localStorage.getItem('groupId')
    const res = await axios.get(`${url}/getGroupDetails?groupId=${groupid}`);
    document.getElementById('groupNameFinal').innerHTML=`${res.data.name}`;
    const token = localStorage.getItem('token');
    const data = getTokenDetails(token);
    if(data.userId === res.data.AdminId)
    {
        document.getElementById('addUserToGroup').style.visibility = 'visible';
        document.getElementById('removeUser').style.visibility = 'visible';
    } 
}

function displayGroups(groups)
{
    //console.log(groups);
    groups.groups.forEach((group)=>{
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = "/images/avatar.jpg";
        img.className = "listimage";
        li.appendChild(img);
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

var getGroupMembers = document.getElementById('groupMembers');

getGroupMembers.addEventListener('click',async (e)=>{
    e.preventDefault();
    getGroupMembers.innerHTML = ``;
    getGroupMembers.innerHTML = `<option value="" disabled selected hidden>Participants</option>`;
    const groupId = localStorage.getItem('groupId');
    const res = await axios.get(`${url}/getGroupMembers?groupId=${groupId}`);
    const users = res.data;
    var ul = document.createElement('ul');
    users.forEach((user)=>{
        var li = document.createElement('OPTION');
        li.appendChild(document.createTextNode(`${user.name}`));
        getGroupMembers.appendChild(li);
    })
})

document.getElementById('logout').addEventListener('click', (e)=>{
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('messages');
    localStorage.removeItem('groupId');
    window.location.href = "login";
})

document.getElementById('removeUser').addEventListener('click', groupMembersForRemoval);

async function groupMembersForRemoval()
{
    const groupId = localStorage.getItem('groupId');
    const res = await axios.get(`${url}/getGroupMembers?groupId=${groupId}`);
    const users = res.data;
    //console.log(users);
    printOnModal(users);
}

const deletionList = document.getElementById('participantsToRemove');
function printOnModal(users)
{   
    deletionList.innerHTML=``;
    users.forEach((user)=>{
        var li = document.createElement('li');
        li.className = 'usersToDeleteList'
        var deleteButton = document.createElement('button');
        deleteButton.className = "delete btn btn-danger";
        deleteButton.id = user.id;
        deleteButton.appendChild(document.createTextNode("Remove"));
        let span1 = document.createElement("span");
        span1.textContent = `${user.name}  `;
        span1.style.width = '60%';
        li.appendChild(span1);
        li.appendChild(deleteButton);
        deletionList.appendChild(li);
    })
}

deletionList.addEventListener('click', async function removeUser(e)
{
    e.preventDefault();
    if (e.target.classList.contains("delete"))
    {
        var li = e.target.parentElement;
        const userId = e.target.id;
        const groupId = localStorage.getItem('groupId');
        const res = await axios.get(`${url}/removeUser?userId=${userId}&groupId=${groupId}`);
        console.log(res.message);
        deletionList.removeChild(li);
    }
})

document.getElementById('addUserToGroup').addEventListener('click', groupMembersForAddition);

async function groupMembersForAddition()
{
    const groupId = localStorage.getItem('groupId');
    const res = await axios.get(`${url}/getGroupMembersToAdd?groupId=${groupId}`);
    const users = res.data;
    //console.log(users);
    printOnAddModal(users);
}

const additionList = document.getElementById('participantsToAdd');
function printOnAddModal(users)
{   
    additionList.innerHTML=``;
    users.forEach((user)=>{
        var li = document.createElement('li');
        li.className = 'usersToDeleteList'
        var AddButton = document.createElement('button');
        AddButton.className = "add btn btn-info";
        AddButton.id = user.id;
        AddButton.appendChild(document.createTextNode("Add"));
        let span1 = document.createElement("span");
        span1.textContent = `${user.name}  `;
        span1.style.width = '60%';
        li.appendChild(span1);
        li.appendChild(AddButton);
        additionList.appendChild(li);
    })
}

additionList.addEventListener('click', async function add(e)
{
    e.preventDefault();
    if (e.target.classList.contains("add"))
    {
        var li = e.target.parentElement;
        const userId = e.target.id;
        const groupId = localStorage.getItem('groupId');
        const res = await axios.get(`${url}/addUserToGroup?userId=${userId}&groupId=${groupId}`);
        console.log(res.message);
        additionList.removeChild(li);
    }
})
