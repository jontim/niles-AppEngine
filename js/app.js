function toggleContentVisibility(user) {
    if (user && user.email.endsWith("@neuroleadership.com")) {
        document.getElementById('publicContent').style.display = 'none';
        document.getElementById('privateContent').style.display = 'block';
    } else {
        document.getElementById('publicContent').style.display = 'block';
        document.getElementById('privateContent').style.display = 'none';
    }
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: "neuroleadership.com" });

    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            if (user.email.endsWith("@neuroleadership.com")) {
                document.getElementById('loginStatus').textContent = `Welcome, ${user.displayName}`;
                document.getElementById('publicContent').style.display = 'none';
                document.getElementById('privateContent').style.display = 'block';
            } else {
                document.getElementById('loginStatus').textContent = "Access restricted to neuroleadership.com domain.";
                firebase.auth().signOut();
            }
        })
        .catch(error => {
            console.error('Login Error:', error);
            document.getElementById('loginStatus').textContent = "Error during login: " + error.message;
        });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('publicContent').style.display = 'none';
        document.getElementById('privateContent').style.display = 'block';
    } else {
        document.getElementById('publicContent').style.display = 'block';
        document.getElementById('privateContent').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', googleLogin);
    }

    const videos = [
        'static/MEDIA/Niles joke 2.webm',
        'static/MEDIA/Niles joke 3.webm',
        'static/MEDIA/Niles joke 4.webm',
        'static/MEDIA/Niles joke 5.webm',
        'static/MEDIA/Niles joke 6.webm'
    ];
    const specificVideo = 'static/MEDIA/Niles joke 1_1.webm';
    const heroVideo = document.getElementById('hero-video');
    const askButton = document.getElementById('ask-button');
    let clickCount = 0;

    askButton.addEventListener('click', () => {
        clickCount++;
        if (clickCount <= 2) {
            const randomVideo = videos[Math.floor(Math.random() * videos.length)];
            heroVideo.src = randomVideo;
            heroVideo.style.display = 'block';
            heroVideo.play();
        } else if (clickCount === 3) {
            heroVideo.src = specificVideo;
            heroVideo.style.display = 'block';
            heroVideo.play();
        }
        
        const promptInput = document.getElementById('query-input');
        const responseBox = document.getElementById('response-box');
        const selectedIntent = document.querySelector('input[name="intent"]:checked');
        
        if (selectedIntent && promptInput.value.trim() !== '') {
            const number = selectedIntent.value;
            const prompt = number + ' ' + promptInput.value;
        
            responseBox.textContent = `Your query: ${promptInput.value}\nProcessing...`;
        
            fetch('/api/run-script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt, username: 'username' }),  // Replace 'username' with the actual username
            })
            .then(response => response.json())
            .then(data => {
                responseBox.textContent = `Your query: ${promptInput.value}\nResponse: ${data.response}`;
            })
            .catch((error) => {
                console.error('Error:', error);
                responseBox.textContent = `Your query: ${promptInput.value}\nError: ${error}`;
            });
        }

            // Clear the input box
            promptInput.value = '';

        } else {
            if (!selectedIntent) {
                console.error('No intent selected');
                responseBox.textContent = 'Please select an option to proceed.';
            }
            if (promptInput.value.trim() === '') {
                console.error('No query provided');
                responseBox.textContent = 'Please enter a query to proceed.';
            }
        }
    });

    heroVideo.addEventListener('ended', () => {
        heroVideo.style.display = 'none';
    });

// Remove the extra closing curly braces
// });


