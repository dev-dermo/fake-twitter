interface Tweet {
  id: number;
  body: string;
  user_id: number;
  username: string;
}

interface User {
  id: number;
  username: string;
  tweets?: Tweet[];
}

async function getAllUsers() {
  const response = await fetch('/api/users', {
    method: 'GET',
  });

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  return response.json();
}

async function getAllTweets() {
  const response = await fetch('/api/tweets', {
    method: 'GET',
  });

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  return response.json();
}

async function getOneUser(id: number) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    alert('Something went wrong!');
  }

  return response.json();
}

async function renderUsers(users: User[]) {
  const usersListEl = document.querySelector('#users-list');

  if (usersListEl) {
    users.forEach((user: User) => {
      const listItemEl = document.createElement('li');
      const userLinkEl = document.createElement('a');
      userLinkEl.href = `/users?id=${user.id}`;
      userLinkEl.textContent = user.username;
      listItemEl.appendChild(userLinkEl);

      if (user.tweets) {
        const tweetsListEl = document.createElement('ul');
        user.tweets.forEach((tweet: Tweet) => {
          const tweetListItemEl = document.createElement('li');
          tweetListItemEl.textContent = `${tweet.body}`;
          tweetsListEl.appendChild(tweetListItemEl);
        });

        listItemEl.appendChild(tweetsListEl);
      }


      usersListEl.appendChild(listItemEl);
    });
  }


}

async function renderTweets(tweets: Tweet[]) {
  const tweetsListEl = document.querySelector('#tweets-list');

  tweets.forEach((tweet: Tweet) => {
    const tweetListItemEl = document.createElement('li');
    tweetListItemEl.innerHTML = `${tweet.body} by <a href="/users?id=${tweet.user_id}">${tweet.username}</a>`
    tweetsListEl?.appendChild(tweetListItemEl);
  });
  // example
  //   [
  //     {
  //         "id": 9,
  //         "username": "peter",
  //         "body": "Latests",
  //         "user_id": 2
  //     },
  //     {
  //         "id": 8,
  //         "username": "mary",
  //         "body": "Not all tweets say my name",
  //         "user_id": 3
  //     },
  //     {
  //         "id": 7,
  //         "username": "mary",
  //         "body": "Mary made a tweet",
  //         "user_id": 3
  //     },
  //     {
  //         "id": 5,
  //         "username": "peter",
  //         "body": "Tweet 2\r\n",
  //         "user_id": 2
  //     },
  //     {
  //         "id": 4,
  //         "username": "peter",
  //         "body": "Peter now has twitter!",
  //         "user_id": 2
  //     },
  //     {
  //         "id": 3,
  //         "username": "peter",
  //         "body": "Peter now has twitter!",
  //         "user_id": 2
  //     },
  //     {
  //         "id": 2,
  //         "username": "dmurphy",
  //         "body": "This is my second tweet",
  //         "user_id": 1
  //     },
  //     {
  //         "id": 1,
  //         "username": "dmurphy",
  //         "body": "This is diarmuids first tweet",
  //         "user_id": 1
  //     }
  // ]
}

document.addEventListener('DOMContentLoaded', async () => {
  const currentUrl = window.location.pathname;

  if (currentUrl.startsWith('/users')) {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const userIdFormEl: HTMLInputElement | null = document.querySelector('#user_id');
    const tweetFormEl: HTMLFormElement | null = document.querySelector('#tweet-form');

    if (id) {
      if (userIdFormEl && tweetFormEl) {
        userIdFormEl.value = id;
        tweetFormEl.style.display = 'block';
      }

      const user = await getOneUser(parseInt(id));
      console.log(user);
      renderUsers(user);
    } else {
      const users = await getAllUsers();
      renderUsers(users);
    }
  } else if (currentUrl.startsWith('/tweets')) {
    const tweets = await getAllTweets();
    console.log(tweets);
    renderTweets(tweets);
  } else if (currentUrl === '/') {
    // do the homepage thing
    const userFormEl: HTMLFormElement | null = document.querySelector('#user-form');

    if (userFormEl) {
      userFormEl.style.display = 'block';
    }
  }
});