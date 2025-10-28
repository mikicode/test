document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('purchaseModal');
    const form = document.getElementById('purchaseForm');
    const payButton = form.querySelector('.pay-button');
    
    // Walidacja formularza
    const emailInput = document.getElementById('email');
    const discordInput = document.getElementById('discord');
    const termsCheckbox = document.querySelector('input[name="terms"]');
    const privacyCheckbox = document.querySelector('input[name="privacy"]');
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');

    let currentProductId = null;

    function validateForm() {
        const isEmailValid = emailInput.value.trim() !== '' && emailInput.checkValidity();
        const isDiscordValid = discordInput.value.trim() !== '';
        const isTermsChecked = termsCheckbox.checked;
        const isPrivacyChecked = privacyCheckbox.checked;
        const isPaymentMethodSelected = Array.from(paymentMethodRadios).some(radio => radio.checked);

        if (isEmailValid && isDiscordValid && isTermsChecked && isPrivacyChecked && isPaymentMethodSelected) {
            payButton.disabled = false;
        } else {
            payButton.disabled = true;
        }
    }

    [emailInput, discordInput, termsCheckbox, privacyCheckbox, ...paymentMethodRadios].forEach(element => {
        element.addEventListener('input', validateForm);
        element.addEventListener('change', validateForm);
    });

    // Obsługa formularza
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (payButton.disabled) return;

        const formData = new FormData(form);
        const data = {
            productId: currentProductId,
            email: formData.get('email'),
            discord: formData.get('discord'),
            paymentMethod: formData.get('paymentMethod'),
            terms: formData.get('terms') === 'on',
            privacy: formData.get('privacy') === 'on'
        };

        try {
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.redirectUrl;
            } else {
                alert(`Błąd: ${result.message}`);
            }
        } catch (error) {
            console.error('Błąd podczas przetwarzania zakupu:', error);
            alert('Wystąpił błąd. Spróbuj ponownie później.');
        }
    });

    // Otwieranie i zamykanie modalu
    window.openPurchaseModal = (productId, productName, price) => {
        currentProductId = productId;
        document.getElementById('modalProductName').textContent = productName;
        document.getElementById('modalPrice').textContent = `${price} PLN`;
        modal.classList.add('active');
        validateForm();
    };

    window.closePurchaseModal = () => {
        modal.classList.remove('active');
    };

    // Zamykanie modalu po kliknięciu poza nim
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePurchaseModal();
        }
    });
});