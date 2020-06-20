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
