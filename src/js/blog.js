const gitURL = "https://api.github.com/repos/dmelin/dmelin.github.io/contents/posts";

$(document).ready(function () {
	getPosts()
        .then((posts) => {
            console.log(posts);
            posts.posts.forEach((post, key) => {
                const title = post.name.replace(".html", "").split("-").slice(3);
                $("#post-list").append(`
                    <li>
                        <a href="#" data-post="${key}">
                            <span class="title">${title}</span>
                        </a>
                    </li>
                `);
            })
		})
		.catch((error) => {
			console.log("error", error);
		});
});

function getPosts() {
	const postData = sessionStorage.getItem("posts");
    if (postData) {
        const posts = JSON.parse(postData);
        console.log("Loaded posts from cache");

        if (Date.now() / 1000 - posts.expires <= 0) {
            return new Promise((resolve, reject) => {
                resolve(resolve(posts));
            });
        } else {

        }
    }

    return new Promise((resolve, reject) => {
        console.log("Loading posts from GitHub", gitURL);
        $.ajax({
            url: gitURL,
            success: function (data) {
                storePosts(data);
                resolve(data);
            },
            error: function (error) {
                storePosts(error);
                reject(error);
            },
        });
    });
}

function storePosts(posts) {
	sessionStorage.setItem(
		"posts",
		JSON.stringify({
			expires: Date.now() / 1000 + 10000,
			posts: posts,
		})
	);
}
