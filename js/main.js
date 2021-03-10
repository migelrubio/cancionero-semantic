// Shorthand for $( document ).ready()
$(function() {
    $('.ui.modal').modal({
        closable: false,
        onDeny: function() {
            //console.log("modal denied");
        },
        onApprove: function() {
            //console.log("modal approved");
            refreshData();
        }
    });
    $('#columns-input').val(cols);
    $('#min-size-input').val(minFont);
    $('#max-size-input').val(maxFont);
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
apiKey: "AIzaSyCasKfe9KQEvz7wEwddczMNKXwMHM_wCRs",
authDomain: "cancionero-89f91.firebaseapp.com",
databaseURL: "https://cancionero-89f91.firebaseio.com",
projectId: "cancionero-89f91",
storageBucket: "cancionero-89f91.appspot.com",
messagingSenderId: "649171532371",
appId: "1:649171532371:web:30bda2294ad1c4710164a6",
measurementId: "G-XL8HXB55Y0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//defaults
var cols = 3;
var minFont = 12;
var maxFont = 20;
var content = "";
var title = "";
var subtitle = "";

function openModal() {
    $('.ui.modal').modal("show");
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
    var col = 0;
    var fits = true;

    for (var font = maxFont; font >= minFont; font--) {
        //console.log("font: " + font);
        fits = true;
        col = 0;
        //clearColumns
        $('.column').remove();
        //addColumns
        for (var x = 0; x < cols; x++) {
            $('#columns').append('<div class="column" id="col'+x+'" style="width:'+ 100/cols +'%"><div></div></div>');
        }
        
        var lines = content.split('\n');
        //console.log(lines);
        $('.column').css('font-size', font+'px');

        for (var x = 0; x < lines.length; x++) {
            if (lines[x].length == 0) {
                lines[x] = "&nbsp;";
            }
            $('#col'+col+' div').append('<pre>' + lines[x] + '</pre>');
            //console.log($('#col'+col).height());
            //console.log($('#page').height());
            if ($('#col'+col+' div').height() + 90 + font > $('#page').height()) {
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
            $('#message').removeClass('hidden');
            $('#message p').html("No hay suficiente espacio");
        }
    }
    
    
}
