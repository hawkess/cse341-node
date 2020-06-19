$('#lettersStandardRadio').click(function () {
    letterLimits();
});

$('#lettersMeteredRadio').click(function () {
    letterLimits();
});

$('#largeEnvelopeRadio').click(function () {
    flatLimits();
});

$('#firstClassRadio').click(function () {
    packageLimits();
});

$('#submitBtn').click(function() {
    $('form').addClass('was-validated');
})

$('form').submit(function () {
    event.preventDefault();
    $.ajax({
        url: '/getrate',
        type: 'POST',
        cache: false,
        data: {
            weight: $('#weightInput').val(),
            units: $('input[name=unitsRadio]:checked').val(),
            type: $('input[name=packageRadio]:checked').val()
        },
        success: function (res) {
            $('#error-group').css('display', 'none');
            $('#priceInfo').attr('value', Number(res.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
        },
        error: function (data) {
            $('#error-group').css('display', 'block');
            var errors = JSON.parse(data.responseText);
            var errorsContainer = $('#errors');
            errorsContainer.innerHTML = '';
            var errorsList = '';

            for (var i = 0; i < errors.length; i++) {
                errorsList += '<li>' + errors[i].msg + '</li>';
            }
            errorsContainer.html('<ul class="list-unstyled invalid-feedback">' + errorsList + '</ul>');
        }
    });
});

function letterLimits() {
    $('#unitsLb').attr('disabled', true);
    $('#unitsLb').attr('checked', false);
    $('#unitsOz').attr('disabled', false);
    $('#unitsOz').attr('checked', true);
    $('#weightInput').attr('max', 3.5);
}

function flatLimits() {
    $('#unitsLb').attr('disabled', true);
    $('#unitsLb').attr('checked', false);
    $('#unitsOz').attr('disabled', false);
    $('#unitsOz').attr('checked', true);
    $('#weightInput').attr('max', 13);
}

function packageLimits() {
    $('#unitsOz').attr('disabled', true);
    $('#unitsOz').attr('checked', false);
    $('#unitsLb').attr('disabled', false);
    $('#unitsLb').attr('checked', true);    
    $('#weightInput').attr('max', 13);
}
