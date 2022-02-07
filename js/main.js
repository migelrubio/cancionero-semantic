//defaults
let cols = 3
let minFont = 12
let maxFont = 20
let content = ""
let title = ""
let subtitle = ""
let mode = "edit"
let currId = null;
let ultimas = [];

$(function() {
  $('#columns-input').val(cols);
  $('#min-size-input').val(minFont);
  $('#max-size-input').val(maxFont);
})

/** Sets mode and modal content based on button clicked */
$('#editModal').on('show.bs.modal', function (event) {
  mode = event.relatedTarget.getAttribute('data-bs-mode')
  let modalTitle = editModal.querySelector('.modal-title')
  modalTitle.textContent = mode == 'edit' ? 'Editar' : 'Nuevo'
  if (mode == 'edit') {
    $('#title-input').val(title);
    $('#subtitle-input').val(subtitle);
    $('#content-input').val(content);
  } else {
    $('#title-input').val("");
    $('#subtitle-input').val("");
    $('#content-input').val("");
  }
});

$('#searchModal').on('show.bs.modal', function (event) {
  $('#search-input').val("");
  $('#search-list').html("");
  getUltimas();
});

$('#searchModal').on('shown.bs.modal', function (event) {
  $('#search-input').focus();
});

function test(){
  $.ajax({
    method: "POST",
    url: "main.php",
    data: { 
      cmd:"nueva", 
      nombre: "John", 
      interpretes: "Boston", 
      contenido: "Prueba" 
    }
  })
    .done(function( msg ) {
      console.log(msg);
    });
}

function getUltimas(){
  $('#recent-list').hide()
  $.ajax({
    method: "POST",
    url: "main.php",
    dataType: "json",
    data: {
      cmd: "ultimas"
    }
  })
    .done(function( data ) {
      ultimas = data;
      console.log(ultimas);
      let html = "<h6 class='text-muted'>Últimas canciones</h6>";
      for (let i = 0; i < ultimas.length; i++) {
        html += "<li class='list-group-item'><a onclick='load("+ultimas[i].id+")' class='btn'>";
        html += "<h6><span>" + ultimas[i].nombre + " </span>";
        html += "<small class='text-muted'>"+ultimas[i].interpretes+"</small></h6>";
        html += "</a></li>";
      }
      $('#recent-list').html(html);
      $('#recent-list').show();
    });
}

function load(id){
  $.ajax({
    method: "POST",
    url: "main.php",
    dataType: "json",
    data: {
      cmd: "cancion",
      id: id
    }
  })
    .done(function( data ) {
      console.log(data);
      currId = data.id;
      $('#title-input').val(data.nombre);
      $('#subtitle-input').val(data.interpretes);
      $('#content-input').val(data.contenido);
      $('#searchModal').modal('hide');
      refreshData();
    });
}

function guardar() {
  if (mode == 'edit') {
    $.ajax({
      method: "POST",
      url: "main.php",
      data: {
        cmd: "modificar",
        id: currId,
        nombre: sinComillas($('#title-input').val()), 
        interpretes: sinComillas($('#subtitle-input').val()), 
        contenido: sinComillas($('#content-input').val()) 
      }
    })
      .done(function( msg ) {
        alert(msg, 'success');
        $('#editModal').modal('hide');
        refreshData();
      });
  } else {
    $.ajax({
      method: "POST",
      url: "main.php",
      data: { 
        cmd:"nueva", 
        nombre: sinComillas($('#title-input').val()), 
        interpretes: sinComillas($('#subtitle-input').val()), 
        contenido: sinComillas($('#content-input').val()) 
      }
    })
      .done(function( msg ) {
        alert(msg, 'success');
        currId  = msg.id;
        refreshData();
        $('#editModal').modal('hide');
      });
  }
}

function buscar(){
  let busqueda = $('#search-input').val();
  if (busqueda.length > 0) {
    $('#recent-list').hide();
    $.ajax({
      method: "POST",
      url: "main.php",
      dataType: "json",
      data: {
        cmd: "buscar",
        data: busqueda
      }
    })
      .done(function( data ) {
        let html = "<h6 class='text-muted'>Resultados</h6>";
        for (let i = 0; i < data.length; i++) {
          html += "<li class='list-group-item'><a onclick='load("+data[i].id+")' class='btn'>";
          html += "<h6><span>" + data[i].nombre + " </span>";
          html += "<small class='text-muted'>"+data[i].interpretes+"</small></h6>";
          html += "</a></li>";
        }
        $('#search-list').html(html).show();
        if (data.length == 0) {
          $('#search-list').append("<li class='list-group-item'>No se encontraron resultados</li>");
        }
      });
  } else{
    $('#search-list').html("").hide();
    $('#recent-list').show();
  }
}

/* type: primary, secondary, success, danger, warning, info, light, dark */
function alert(message, type) {
  $('#alert').removeClass('invisible');
  $('#alert').html(message);
  $('#alert').addClass('alert-'+type);
  setTimeout(function() {
    $('#alert').addClass('invisible');
    $('#alert').removeClass('alert-'+type);
  }, 3000);
}

function sinComillas(txt){
  return txt.replace(/'/g, '\\\'').replace(/"/g, '\\\"');
}

function refreshData() {
  $('#message').addClass('hidden');
  cols = $('#columns-input').val();
  minFont = $('#min-size-input').val();
  maxFont = $('#max-size-input').val();
  content = $('#content-input').val();
  title = $('#title-input').val();
  subtitle = $('#subtitle-input').val();
  //console.log(cols + ', ' + minFont + ', ' + maxFont + ', ' + content);

  $('#title').html(title);
  $('#subtitle').html(subtitle);
  let col = 0;
  let fits = true;

  for (let font = maxFont; font >= minFont; font--) {
      //console.log("font: " + font);
      fits = true;
      col = 0;
      //clearColumns
      $('.column').remove();
      //addColumns
      for (let x = 0; x < cols; x++) {
          $('#columns').append('<div class="column" id="col'+x+'" style="width:'+ 100/cols +'%"><div></div></div>');
      }
      
      let lines = content.split('\n');
      //console.log(lines);
      $('.column').css('font-size', font+'px');

      for (let x = 0; x < lines.length; x++) {
          if (lines[x].length == 0) {
              lines[x] = "&nbsp;";
          }
          $('#col'+col+' div').append('<pre>' + lines[x] + '</pre>');
          //console.log($('#col'+col).height());
          //console.log($('#page').height());
          //70 es el margin-top de #columns
          if ($('#col'+col+' div').height() + 70 + font > $('#page').height()) {
              $('#col'+col+' div').children().last().remove();
              x--;
              col++;
          }
          if (col == cols) {
              fits = false;
              break;
          }
      }
      //console.log("fits: " + fits);
      if (fits) break;
      if (font == minFont) {
          //console.log("doesnt fit");
          alert("No hay suficiente espacio para mostrar el contenido", "danger");
      }
  }
  if (currId != null) $('#btn-editar').prop('disabled', false); 
}