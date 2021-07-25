function update_info(jenis) {
  $('#edit_info_profile').modal('show')
  $('#title_info_profile').text(jenis == 'name' ? 'Edit name' : 'Edit information')
  $('.eip').val(jenis == 'name' ? $('.name_987').text() : $('.information_987').text())
  $('input[name="kind__"]').val(jenis)
}

$('#FormControlFile1').on('change', function() {
  let reader = new FileReader()
  reader.onload = function(){
    var output = $('#preview-profile')[0]
    output.src = reader.result
  };
  reader.readAsDataURL(event.target.files[0])
})

  function click_to_chat(n) {
    console.log(n);
    location.replace(n);
  }

  function isStorageExist() {
     if(typeof(Storage) === undefined){
         console.log("Your browser does not support local storage");
         return false
     }
     return true;
  }

  function ws(master) {
    localStorage.setItem('INPONOW_WEB_CHAT', JSON.stringify(master))
  }

  function save_tab(n) {
    let data = {
      'tab_opened' : n
    }
    ws(data);
    // console.log(JSON.parse(localStorage.getItem('INPONOW_WEB_CHAT')), 'ini web storage');
  }

  $(document).ready(function() {
    setTimeout(function() {
      $('.alert__').fadeOut();
    }, 3000);

    if (isStorageExist()) {
      let tab = JSON.parse(localStorage.getItem('INPONOW_WEB_CHAT'))
      if (tab != null) {
        if (tab.tab_opened == 'contact-tab') {
          $(`#home-tab`).removeClass('active').removeClass('.show');
          $(`#home`).removeClass('active').removeClass('.show');
          $(`#contact-tab`).addClass('active').addClass('show');
          $(`#contact`).addClass('active').addClass('show');
        }else if (tab.tab_opened == 'profile-tab') {
          $(`#home-tab`).removeClass('active').removeClass('.show');
          $(`#home`).removeClass('active').removeClass('.show');
          $(`#profile-tab`).addClass('active').addClass('show');
          $(`#profile`).addClass('active').addClass('show');
        }
      }
    }
  });

  $('button[name="button_add_friend"]').on('click', function() {
    $('.add__').show();
    $('.list__').hide();
  });

  $('button[name="button_back"]').on('click', function() {
    $('.add__').hide();
    $('.list__').show();
  });

  $('.find__').on('click', () => {
    let val = $('#username__').val();
    if (val != '') {
      $.ajax({
        url: "/find",
        type: 'POST',
        cache: false,
        // dataType: 'JSON',
        data: {
          username: val,
        },
        beforeSend: function() {
          $('.find_area__').html(`<center class="mt-5"><h2>🏄</h2>Loading..</center>`);
        },
        success: function(result) {
          if (result != 0) {
            $('.find_area__').html(result);
          } else {
            $('.find_area__').html('<center class="mt-5"><h2>😢</h2>Username Not Found !</center>');
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error();
        }
      })
    }else {
      $('#liveToast').toast('show')
    }
  })

  const add_friend = (id_, username__) => {
    let tampung_sementara = [];
    $(`tr[row-id="${id_}"] td`).each((i,v) =>{
      if (i !== 3) {
        tampung_sementara.push($(v).text());
      }
    })

    $('.find_area__').html(`<center class="mt-5"><h2>🏄</h2>Sedang Menambahkan Teman..</center>`);

    $.ajax({
      url: "/cek_friend",
      type: 'POST',
      cache: false,
      dataType: 'JSON',
      data: {
        id_friend: id_
      },
      success: function(result_) {
        console.log(result_);
        if (result_ == 1) {

          $.ajax({
            url: "/add_friend",
            type: 'POST',
            cache: false,
            dataType: 'JSON',
            data: {
              id_friend: id_,
              id_group_chat: `${username__}_${tampung_sementara[1]}`
            },
            success: function(result) {
              if (result.success == 1) {
                let count_ = $('.friend_list tbody tr').length;
                $('.friend_list tbody').append(`<tr style="border-bottom:1px solid #cdcdcd;" class="tr_contact" >
                                                  <td style="width:65px"><img src="${result.img_profile_friend != '' ? result.img_profile_friend : '/img/default.png'}" style="width:55px;height:55px;border-radius:50%" alt=""> </td>
                                                  <td onclick="click_to_chat('/index/${id_}')" style="vertical-align:middle;width:70%;cursor:pointer">${tampung_sementara[2]}</td>
                                                  <td><img src="/font/delete.png" class="trash-custom mt-2" style="z-index:2" onclick="del_contact(${id_}, '${tampung_sementara[2]}')"> </td>
                                                </tr>`);
                $('.find_area__').html(`<center class="mt-5"><h2>🏄</h2>${tampung_sementara[2]} added successfully</center>`);
                setTimeout(function () {
                  $('.find_area__').html(``);
                }, 579);
              }else {
                $('.find_area__').html(`<center class="mt-5"><h2>🏄</h2>Failed to add ${tampung_sementara[2]}, try again later</center>`);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              console.error();
            }
          })


        }else {
          $('.find_area__').html(`<center class="mt-5"><h2>🏄</h2>${tampung_sementara[2]} has become your friend..</center>`);
        }

      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error();
      }
    })

  }

  function searhContact(th) {
    var $rows = $('.friend_list tr');
    $(th).keyup(function() {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

        $rows.show().filter(function() {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });
  }

  function respo() {
    if ($(window).width() > 768) {
      $('.nbr0012').removeClass('mt-2');
    } else {
      $('.nbr0012').addClass('mt-2');
    }
  }
  respo();
  $(window).resize(function() {
    respo();
  })

  function del_chat(id,name) {
    $('#areyousure').modal('show')
    $('.btndelyes').attr('onclick', `delchat(${id}, '/delete_chat')`)
    $('#namefr').text(name+' chat? you will also delete all pictures in this chat!').css('text-transform', 'lowercase')
  }

  function del_contact(id,name) {
    $('#areyousure').modal('show')
    $('.btndelyes').attr('onclick', `delchat(${id}, '/delete_contact')`)
    $('#namefr').text(name + `, you will also delete chat history from ${name}`).css('text-transform', 'lowercase')
  }

  function delchat(id, url) {
    $.ajax({
      url: `${url}`,
      type: 'POST',
      cache: false,
      dataType: 'JSON',
      data: {
        id_friend: id,
      },
      beforeSend: function() {
        $('.notification_del_area').html(`<div class="alert shadow alert-dismissible fade show" style="background:#1ab065;color:#ececec" role="alert">
          <b style="text-transform:capitalize">
          Prosessing deleted data...
        </div>`);
      },
      success: function(result) {
        if (result) {
          $('.notification_del_area').html(`<div class="alert shadow alert-dismissible fade show" style="background:#1ab065;color:#ececec" role="alert">
            <b style="text-transform:capitalize">
             Data has been deleted.
          </div>`);
          // $(th).parent().parent('tr').remove();
          if (url == '/delete_chat') {
            $(`.ea098${id}`).remove()
          }else {
            $(`.ea097${id}`).remove()
            $(`.ea098${id}`).remove()
          }

          $('#areyousure').modal('hide')
          setTimeout(function () {
            $('.notification_del_area').html('');
          }, 3000);
        } else {
          $('.notification_del_area').html(`<div class="alert shadow alert-dismissible fade show" style="background:#e84242;color:#ececec" role="alert">
            <b style="text-transform:capitalize">
             Something was wrong with connection 😢, try again..
          </div>`);
          // $('.find_area__').html('<center class="mt-5"><h2></h2>Username Not Found !</center>');
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error();
      }
    })
  }
