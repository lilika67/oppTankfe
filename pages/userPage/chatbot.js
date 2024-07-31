document.querySelectorAll('.question').forEach(button => {
    button.addEventListener('click', function () {
        const message = button.textContent;
        const answerContainer = button.nextElementSibling;
        const botResponse = getBotResponse(message);
        answerContainer.textContent = botResponse;
        answerContainer.style.display = 'block';
    });
});

document.getElementById('chatbot-button').addEventListener('click', function () {
    document.getElementById('chatbot-modal').style.display = 'block';
});

document.querySelector('.close-button').addEventListener('click', function () {
    document.getElementById('chatbot-modal').style.display = 'none';
});

window.addEventListener('click', function (event) {
    const modal = document.getElementById('chatbot-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function getBotResponse(message) {
    const responses = {
        'How can I create my new account?': 'To create an account click on the registration.',
        'How can I apply for a job?': 'To apply for a job click on the view jobs.',
        'How can I view my job applications?': 'To view your job applications click on the my applications.',
        'How can I track my progress?': 'To track your progress click on the progress.',
        'How can I access my account?': 'To access your account click on the login.',
        'How can I change my password?': 'To change your password click on the profile.',
        'How can I logout?': 'To logout click on the logout.',
        'What is opportunityTank?': 'Opportunity Tank is a platform which connects different companies to talents in Rwanda.',
    };
    return responses[message] || "I'm sorry, I don't understand that.";
}
