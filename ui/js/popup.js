


function show(role){
    $('[data-role=' + role +']').fadeIn('fast');
}

function hide(role){
    $('[data-role='+role+']').fadeOut('fast');
}


$('#modal').hide();






$('#open-btn').on('click', function(){
    show($(this).data('target'));
})

$('#close-btn').on('click', function(){
    hide($(this).data('target'));
})


$(document).keyup(function(event){
    if (event.keyCode === 27){
        //get the current showed modal
        hide('greetingModal')
    }
})
