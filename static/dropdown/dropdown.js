$(document).ready(function(){
    $('.hp-dropdown__select').live('click',function(){
        $(this).siblings('.hp-dropdown__options-wrap').toggleClass('active');
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
        }
    });
    $('.hp-dropdown .hp-dropdown__option').live('click',function(){
        var html = $(this).html();
        var value = $(this).find('span').data('value');
        console.log(value);
        $(this).closest('.hp-dropdown__options-wrap').siblings('.hp-dropdown__select').find('.hp-dropdown__select-wrap').html(html);
        $(this).closest('.hp-dropdown__options-wrap').removeClass('active');
        $(this).closest('.hp-dropdown__options-wrap').prev().removeClass('active');
        $(this).closest('.hp-dropdown').data('value',value);
        console.log($(this).closest('.hp-dropdown').data('value'));

        getDataByCountry($(this).closest('.hp-dropdown').data('value'))

    });
});