var form = document.getElementById('forgotpasswordform');

var email = document.querySelector("#email");

form.addEventListener('submit',async function (e)
{
    e.preventDefault();
    const credential = 
    {
        email : e.target.email.value
    }
    console.log(credential);
    try
    {
        const res = await axios.post("http://localhost:3000/forgotpassword", credential);
        document.getElementById('email-message').innerText = res.data.message;
        document.getElementById('email').value = '';
        console.log(res);
    }
    catch(err)
    {
        console.log(err);
    }
})