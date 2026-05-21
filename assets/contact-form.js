(function ($) {
    'use strict';

    function showMessage($container, type, message) {
        $container.html(
            '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
            message +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span></button></div>'
        ).fadeIn('fast');
    }

    function initContactForm(formSelector) {
        var $form = $(formSelector);

        if (!$form.length || $form.data('ml22p-contact-init')) {
            return;
        }

        $form.data('ml22p-contact-init', true);

        var $submitButton = $form.find('.houzez-submit-button');
        var $messageContainer = $form.find('.ele-form-messages');
        var $errorContainer = $form.find('.error-container');
        var $ajaxLoader = $form.find('.houzez-loader-js');

        $form.on('submit', function (event) {
            event.preventDefault();

            var email = $.trim($form.find('[name="email"]').val());
            var message = $.trim($form.find('[name="message"]').val());
            var name = $.trim($form.find('[name="name"]').val());
            var firstName = $.trim($form.find('[name="first_name"]').val());
            var lastName = $.trim($form.find('[name="last_name"]').val());

            if (!name && (firstName || lastName)) {
                name = $.trim(firstName + ' ' + lastName);
            }

            if (!name) {
                showMessage($messageContainer, 'danger', 'Bitte geben Sie Ihren Namen ein.');
                return;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage($messageContainer, 'danger', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            if (!message) {
                showMessage($messageContainer, 'danger', 'Bitte geben Sie eine Nachricht ein.');
                return;
            }

            $ajaxLoader.addClass('loader-show');
            $submitButton.prop('disabled', true);
            $messageContainer.fadeOut('fast');
            $errorContainer.fadeOut('fast');

            $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                data: $form.serialize(),
                dataType: 'json'
            }).done(function (response) {
                if (response && response.success) {
                    $form[0].reset();
                    showMessage($messageContainer, 'success', response.msg);
                    return;
                }

                showMessage(
                    $messageContainer,
                    'danger',
                    (response && response.msg) || 'Beim Senden ist ein Fehler aufgetreten.'
                );
            }).fail(function () {
                showMessage(
                    $messageContainer,
                    'danger',
                    'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@ml22p.at.'
                );
            }).always(function () {
                $ajaxLoader.removeClass('loader-show');
                $submitButton.prop('disabled', false);
            });
        });
    }

    $(function () {
        initContactForm('#houzez-form-542d604');
        initContactForm('#houzez-form-3670d56');
    });
}(jQuery));
