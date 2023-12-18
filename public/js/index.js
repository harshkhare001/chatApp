const form = document.getElementById('msg');
form.addEventListener('submit', sendMessage);

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