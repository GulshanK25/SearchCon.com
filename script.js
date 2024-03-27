class User {
    constructor(id, username, image, firstname, lastname, emailid, phone) {
        this.id = id;
        this.username = username;
        this.image = image;
        this.firstname = firstname;
        this.lastname = lastname;
        this.emailid = emailid;
        this.phone = phone;
    }

    get fullName() {
        return `${this.firstname} ${this.lastname}`;
    }
    
}


function showUserDetailsOnHover(user) {
    const userDetailsContainer = document.getElementById('userdetails');
    document.getElementById('userdetails-username').textContent =  `Username: ${user.username} `;
    document.getElementById('userdetails-fullname').textContent = `Full Name: ${user.fullName} `;
    document.getElementById('userdetails-email').textContent =  `Useremail: ${user.emailid} `;
    document.getElementById('userdetails-phone').textContent =  `Phone #: ${user.phone} `;

    userDetailsContainer.style.display = 'block';
}


document.addEventListener('DOMContentLoaded', function () {
    fetch('https://dummyjson.com/posts')
        .then(res => {
            if (!res.ok) {
                throw new Error('Posts could not be fetched.');
            }
            return res.json();
        })
        .then(data => {
            let postsContainer = document.querySelector('.posts-container');
            const postsToDisplay = data.posts;
            let currentPage = 1;
            const itemsPerPage = 6; // Number of items to show per page

            function displayPosts(page) {
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const postsToDisplaySubset = postsToDisplay.slice(startIndex, endIndex);

                postsToDisplaySubset.forEach(post => {
                    displayPostAndComments(post, postsContainer);
                });
            }

            displayPosts(currentPage);

            function setupInfiniteScroll() {
                let timeout; 
                let buffer = 200; // Adjusted buffer to account for dynamic content height

                window.onscroll = () => {
                    clearTimeout(timeout);

                    timeout = setTimeout(() => {
                        let scrollPosition = window.innerHeight + window.scrollY;
                        let adjustedOffsetHeight = Math.max(document.body.offsetHeight, buffer);

                        if (scrollPosition >= adjustedOffsetHeight - buffer) {
                            currentPage++;

                            if ((currentPage - 1) * itemsPerPage < postsToDisplay.length) {
                                displayPosts(currentPage);
                            }
                        }
                    }, 300);
                };
            }

            setupInfiniteScroll();

        }).catch(error => {
            console.error(error);
        });

    setupdetailCloseBehavior();
});
function setupdetailCloseBehavior() {
    const closeuserdetails = document.querySelector('.userdetails-content .close');
    const userdetails = document.getElementById('userdetails');

    if (closeuserdetails && userdetails) {
        closeuserdetails.onclick = function () {
            userdetails.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target === userdetails) {
                userdetails.style.display = 'none';
            }
        };
    }
}

function displayPostAndComments(post, postsContainer) {
    const postElement = document.createElement('article');
    postElement.classList.add('post');
    postElement.innerHTML = `
        <div class="post-header">
            <img class="profile_icon" src="" alt="User icon">
            <h2 class="username" data-userid="${post.userId}">Loading username...</h2>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-body">${post.body}</p>
        <div class="post-footer">
            <span class="post-id">Comments:  </span>
        </div>
        <section class="comments">
            <!-- Comments will be dynamically inserted here -->
        </section>
    `;

    postsContainer.appendChild(postElement);

    fetch(`https://dummyjson.com/users/${post.userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('User data not available.');
            }
            return res.json();
        })
        .then(userData => {
            const user = new User(
                userData.id,
                userData.username,
                userData.image,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.phone
            );
            const usernameElement = postElement.querySelector('.username');
            const profileIconElement = postElement.querySelector('.profile_icon');

            if (usernameElement) {
                usernameElement.textContent = user.username;
            }

            if (profileIconElement) {
                profileIconElement.src = user.image;
            }

            updateUserDetails(postElement, user);

            // Fetch and display comments for the post
            fetch(`https://dummyjson.com/comments/post/${post.id}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Comments could not be loaded.');
                    }
                    return res.json();
                })
                .then(data => {
                    const commentsSection = postElement.querySelector('.comments');
                    const commentsData = data.comments || [];

                    // Display comments
                    if (commentsSection) {
                        commentsData.forEach(comment => {
                            const commentDiv = document.createElement('div');
                            commentDiv.classList.add('comment');

                            const commenterUsername = document.createElement('span');
                            commenterUsername.textContent = `Commented by : @${comment.user.username}`;
                            commentDiv.appendChild(commenterUsername);

                            const commentContent = document.createElement('p');
                            commentContent.textContent = comment.body;
                            commentDiv.appendChild(commentContent);
                            commentsSection.appendChild(commentDiv);
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        })
        .catch(error => {
            console.error(error);
        });
}

function updateUserDetails(postElement, user) {
    const usernameElement = postElement.querySelector('.username');
   
    if (usernameElement) {
        usernameElement.addEventListener('click', () => {
            showuserdetails(user);
        });

        usernameElement.addEventListener('mouseenter', () => {
            showUserDetailsOnHover(user);
        });

        usernameElement.addEventListener('mouseleave', () => {
            hideUserDetailsOnHover();
        });
    }
}






function hideUserDetailsOnHover() {
    const userDetailsContainer = document.getElementById('userdetails');
    userDetailsContainer.style.display = 'none';
}

function validateForm() {
    // Reset error messages
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('confirmError').textContent = '';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const confirmChecked = document.getElementById('confirm').checked;
    if (/\d/.test(name)) {
        document.getElementById('nameError').textContent = 'Name should not contain integers.';
        return false;
    }
    if (!/^.+@.+\..+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Email must contain "@" and ".".';
        return false;
    }
    if (!confirmChecked) {
        document.getElementById('confirmError').textContent = 'Please confirm to send.';
        return false;
    }
    alert('Form submitted successfully!');
}

