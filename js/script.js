let serverURL;
let serverPort;
let url;
let editing = false;
let loginBtn = `<button id="loginBtn" class="btn btn-light" type="button" name="button" onclick="login()">Login</button>`;
let logoutBtn = `<button id="logoutBtn" class="btn btn-light" type="button" name="button" onclick="logout()">Logout</button>`;

$(document).ready(function(){
    if(sessionStorage.userName){
        // you're logged in, nice :)
        $('#logInOutBox').append(logoutBtn);
        $('#logoutBtn').click(function(){
            console.log('got a click');
        });

    } else {
        // you're not logged in
        $('#logInOutBox').append(loginBtn);
        $('#loginBtn').click(function(){
            // console.log('got a click');
            $('.main').addClass('d-none');
            $('#userForm').removeClass('d-none');
        });
    }

    logout = () => {
        console.log('clicked logout button');
        $('#logInOutBox').empty();
        $('#logInOutBox').append(loginBtn);
        sessionStorage.clear();
        $('#cardContainer').addClass('d-none');
    };

    login = () => {
        console.log('clicked login button');
        $('.main').addClass('d-none');
        $('#userForm').removeClass('d-none');
        $('#lUsername').val(null);
        $('#lPassword').val(null);
    };

    if(sessionStorage.userName){
        // you're logged in, nice :)
        $('#logInOutBox').append(logoutBtn);
        logout();
    } else {
        // you're not logged in
        if (!loginBtn){
            $('#logInOutBox').append(loginBtn);
        }
    }
    itemCard = () => {
      $.ajax({
        url: `${url}/allItems`,
        type: 'GET',
        dataType: 'json',
        success: function(data){
          console.log(data);
          $('#cardContainer').empty();
          for (var i = 0; i < data.length; i++) {
              let layout = `<div class="row">
                <div class="card col">
                  <div class="card-body">
                   <div id="worktitle" class="card-title">
                     <h5 class="card-title text-center mt-3" data-id="${data[i].item_name}">${data[i].item_name}</h5>
                     <p class="text-center">${data[i].price}</p>
                   </div>
                  </div>`;
                 if (sessionStorage.userName) {
                     layout += `<div class="btnSet d-flex justify-content-center">
                                    <button class="btn btn-primary btn-sm mr-1 editBtn">EDIT</button>
                                    <button class="btn btn-secondary btn-sm removeBtn">REMOVE</button>
                                </div>`;
                }
              layout += `</div>`;
            $('#cardContainer').append(layout);
          }
        },
        error: function(err){
          console.log(err);
          console.log('Something went wrong');
        }
    });
    };
    itemCard();
});


$.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success:function(keys){
        serverURL = keys.SERVER_URL;
        serverPort = keys.SERVER_PORT;
        url = `${keys.SERVER_URL}:${keys.SERVER_PORT}`;
        // need to run a function to get all the items data, right?
    },
    error: function(){
        console.log('cannot find config.json file, cannot run application');
    }
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
        });
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
                    // console.log(result);
                    sessionStorage.setItem('userID', result._id);
                    sessionStorage.setItem('userName', result.username);
                    sessionStorage.setItem('userEmail', result.email);
                    itemCard();
                    $('#logInOutBox').append(logoutBtn);
                    ////////

                    // create Item
                    $('#pageContainer').append(`<div class="addItemBox mx-5 my-2 text-left">`);

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
                                    sessionStorage.setItem('userID', result._id);
                                    sessionStorage.setItem('userName', result.username);
                                    sessionStorage.setItem('userEmail', result.email);
                                    itemCard();
                                    $('#loginBtn').hide();
                                    $('#logInOutBox').empty();
                                    $('#logInOutBox').append(logoutBtn);
                                    ////////

                                    // result.username -> sessionStorage.username
                                    // result.user_id -> sessionStorge.user_id
                                    // this bad baby tells us who's logged in
                                    // and if we know who's logged in, we know whose ID to attach to items and comments

                                    // create Item
                                    $('#pageContainer').append(`<div class="addItemBox mx-5 my-2 text-left">
                                    <form id="addItemForm">
                                    <div class="form-group">
                                    <label for="itemName">Item Name</label>
                                    <input type="text" class="form-control" id="itemName">
                                    </div>
                                    <div class="form-group">
                                    <label for="itemDescription">Description</label>
                                    <input type="text" class="form-control" id="itemDescription">
                                    </div>
                                    <div class="form-group">
                                    <label for="itemPrice">Price</label>
                                    <input type="number" class="form-control" id="itemPrice">
                                    </div>
                                    <fieldset class="form-group">
                                    <div class="row">
                                    <legend class="col-form-label col-sm-2 pt-0">Clothing Type</legend>
                                    <div class="col-sm-10">
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" id="topsRadio" value="Tops" name="itemType" >
                                    <label class="form-check-label" for="topsRadio">
                                    Tops
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" id="bottomsRadio" value="Bottoms" name="itemType">
                                    <label class="form-check-label" for="bottomsRadio">
                                    Bottoms
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" id="outwewearRadio" value="Outerwear" name="itemType">
                                    <label class="form-check-label" for="outwewearRadio">
                                    Outerwear
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" id="otherRadio" value="Other" name="itemType">
                                    <label class="form-check-label" for="otherRadio">
                                    Other
                                    </label>
                                    </div>
                                    </div>
                                    </div>
                                    </fieldset>
                                    <fieldset class="form-group">
                                    <div class="row">
                                    <legend class="col-form-label col-sm-2 pt-0">Condition</legend>
                                    <div class="col-sm-10">
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" id="newRadio" value="New" name="itemCondition">
                                    <label class="form-check-label" for="newRadio">
                                    New
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" id="usedRadio" value="Used" name="itemCondition">
                                    <label class="form-check-label" for="usedRadio">
                                    Used
                                    </label>
                                    </div>
                                    </div>
                                    </div>
                                    </fieldset>
                                    <button type="submit" class="btn btn-primary">add an item</button>
                                    </form>
                                    </div>`);

                                    $('#addItemForm').submit(() => {
                                        event.preventDefault();
                                        // need to put some validation in here
                                        if (editing ===true) {
                                          const id = $("#itemID").val();
                                          console.log(id);
                                          $.ajax({
                                            url: `${url}/editItem/${id}`,
                                            type: 'PATCH',
                                            data: {
                                              item_name: itemName,
                                              item_description: itemDescription,
                                              price: itemPrice,
                                              clothing_type: itemType,
                                              condition: itemCondition,                                                bought: itemBought,
                                              // need to add image uploading
                                             },
                                            success: function(result){
                                              console.log(result);
                                              editing = false;
                                              const allItems = $('#cardContainer');
                                              console.log(allItems);
                                              // allProducts.each(function(){
                                              //   console.log($(this).data('id'));
                                              //   if ($(this).data('id') === id) {
                                              //     console.log('match');
                                              //       $(this).find('.productName').text(name);
                                              //   }
                                              // });
                                            },
                                            error: function(err) {
                                              console.log(err);
                                              console.log('something went wrong with editing the product');
                                            }
                                        });
                                        } else {
                                        // send data to db
                                        $.ajax({
                                            url: `${url}/addItem`,
                                            type: 'POST',
                                            data: {
                                                // item ID and user ID get added on backend
                                                item_name: itemName,
                                                item_description: itemDescription,
                                                price: itemPrice,
                                                clothing_type: itemType,
                                                condition: itemCondition,                                                bought: itemBought,
                                                // need to add image uploading
                                            },
                                            success: (result) => {
                                                console.log(result);

                                                // clear form values
                                                let itemName = $('#itemName').val();
                                                let itemDescription = $('#itemDescription').val();
                                                let itemPrice = $('#itemPrice').val();
                                                let itemType = $('input[name="itemType"]:checked').val();
                                                let itemCondition = $('input[name="itemCondition"]:checked').val();
                                            },
                                            error: (err) => {
                                                console.log(err);
                                            }
                                        });
                                      }
                                        // send image to server
                                    });


                                    ///////
                                    $('#userForm').addClass('d-none');
                                    $('.main').removeClass('d-none');
                                    $('#addListBtn').removeClass('d-none');
                                }
                            } ,
                            error: function(err){
                                console.log(err);
                                console.log('Something went wrong');
                            }
                        });
                    }
                    ///////
                    // $('#loginBtn').show();

                    $('#userForm').addClass('d-none');
                    $('.main').removeClass('d-none');
                }
            } ,
            error: function(err){
                console.log(err);
                console.log('Something went wrong');
            }
        });
    }
});
          // <img id="workImg" src="${data[i].imgURL}" class="card-img-top">


$("#cardContainer").on('click', '.editBtn', function() {
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
                 sessionStorage.setItem('userID', result['_id']);
                 sessionStorage.setItem('userName', result['username']);
                 sessionStorage.setItem('userEmail', result['email']);
                 $('#logInOutBox').empty();
                 $('#logInOutBox').append(logoutBtn);
                 $('#userForm').addClass('d-none');
                 $('.main').removeClass('d-none');
                 $('#cardContainer').removeClass('d-none');
                   itemCard();
                 ////////
                 // result.username -> sessionStorage.username
                 // result.user_id -> sessionStorge.user_id
                 // this bad baby tells us who's logged in
                 // and if we know who's logged in, we know whose ID to attach to items and comments
             }
         } ,
      error: function(err){
          console.log(err);
          console.log('Something went wrong');
      }
  });
  }
  const id = $('.dataId').data('id');
  console.log(id);
  console.log('button has been clicked');
  $.ajax({
    url:`${url}/allItem/${id}`,
    type: 'POST',
    data: {
        userId: sessionStorage['userID']
    },
    dataType:'json',
    success: function(item){
      console.log(item);
      // $("#itemName").val(item['name']);
      // $("#itemPrice").val(item['price']);
      // $("#itemID").val(item['_id']);
      // $("#addBtn").text('Edit Product').addClass('btn-warning');
      // editing = true;
    },
    error: function(err){
      console.log(err);
      console.log('something went wrong with getting the single product');
    }
    });
});
