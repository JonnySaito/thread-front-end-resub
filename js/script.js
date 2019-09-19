let serverURL;
let serverPort;
let url;

$(document).ready(function(){
    if(sessionStorage['username']){
        console.log('you are fully logged in, buddy');
        $('#loginBtn').hide();
        $('#logoutBtn').removeClass('d-none');

    } else{
        console.log('please sign in');
    }
    console.log(sessionStorage);
})

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
    // need to run a function to get all the items data, right?
    // getItemsData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

// Ajax get request to get all the items
// getItemsData = () => {
//     $.ajax({
//         url: `${url}/allItems`,
//         type: 'GET',
//         dataType: 'json',
//         success: function(data){
//             $('#itemList').empty();
//             for (var i = 0; i < data.length; i++) {
//                 let item = `
//                      NEED TO ADD HTML FOR ITEMS IN GALLERY
//                 `
//             }
//         }
//     })
// }

$('#loginBtn').click(function(){
  $('.main').addClass('d-none');
  $('#userForm').removeClass('d-none');
});

$('#logoutBtn').click(function(){
  $('.main').removeClass('d-none');
  $('#userForm').addClass('d-none');
});

$('#registerForm').submit(function(){
  event.preventDefault();

  console.log('got a click');
  const username = $('#rUsername').val();
  const email = $('#rEmail').val();
  const password = $('#rPassword').val();
  const confirmPassword = $('#rConfirmPassword').val();

  if(username.length === 0){
       console.log('please enter a username');
   } else if(email.length === 0){
       console.log('please enter an email');
   } else if(password.length === 0){
       console.log('please enter a password');
   } else if(confirmPassword.length === 0){
       console.log('please confirm your password');
   } else if(password !== confirmPassword){
       console.log('your passwords do not match');
   } else {
     $.ajax({
       url: `${url}/users`,
       type: 'POST',
       data: {
         username: username,
         email: email,
         password: password
       },
       success: function(result){
          console.log(result);
          if (result === 'Invalid user') {
            $('#errRego').append('<p class="text-danger">Sorry, this already exists </p>');
          } else {
            $('#loginBtn').text('Logout');
          }
       },
       error: function(err){
          console.log(err);
          console.log('Something went wrong registering a new user');
       }
     })
   }
});

$('#loginForm').submit(function(){
  event.preventDefault();
  const username = $('#lUsername').val();
  const password = $('#lPassword').val();

  if ((username.length === 0)||(password.length === 0)) {
      console.log('Please enter your username and password');
  } else {
    $.ajax({
      url: `${url}/getUser`,
      type: 'POST',
      data: {
        username: username,
        password: password
      },
      success: function(result){
             if (result === 'user does not exist'){
                 console.log('user does not exist');
             } else if (result === 'invalid password'){
                 console.log('invalid password');
             } else {
                 console.log(result);
             }
         } ,
      error: function(err){
          console.log(err);
          console.log('Something went wrong');
      }
    })
  }
});
