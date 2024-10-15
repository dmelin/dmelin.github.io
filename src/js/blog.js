const gitURL = "https://api.github.com/repos/dmelin/dmelin.github.io/contents/posts";
var myPosts;

var requestedPost = location.href.split("?post=")[1];

$(document).ready(function () {
    getPosts()
        .then((posts) => {
            myPosts = posts;
            myPosts.forEach((post, key) => {
                const postMeta = post.name.replace(".html", "").split("-");
                const title = postMeta.slice(3);
                const date = postMeta.slice(0, 3).join("-");

                var link = $("<a>");

                var linkTitle = $("<span>");
                linkTitle.text(title).addClass("title");

                var linkDate = $("<span>");
                linkDate.text(date).addClass("date");

                link.append(linkTitle).append(linkDate)
                    .attr("href", `?post=${date}-${title}`)
                    .attr("post-id", key);
                link.click(function (e) {
                    e.preventDefault();
                    const postId = $(this).attr("post-id");
                    const postUrl = `?post=${date}-${title}`

                    history.pushState({ postId: postId }, "", postUrl);

                    getPost(postId);
                });
                const listItem = $("<li>");
                listItem.append(link);
                $("#post-list").append(listItem);
            })

            if (requestedPost !== undefined) {
                getPost(requestedPost);
            } else {
                getPost(myPosts.length - 1);
            };
        })
		.catch((error) => {
			console.log("error", error);
		});
});

function getPosts() {
	const postData = sessionStorage.getItem("posts");
    if (postData) {
        const posts = JSON.parse(postData);

        let expired = posts.expires - Date.now() / 1000;
        if (expired >= 1000) {
            return new Promise((resolve, reject) => {
                console.log("loaded from cache")
                resolve(posts.posts);
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
                reject(error);
            },
        });
    });
}

function getPost(id) {
    if (isNaN(id)) id = getPostIdFromTitle(id);

    if (id < 0) {
        console.error("Post not found", id);
        // handlePostNotFound();
        return;
    }

    $("[post-id].active").removeClass("active");
    $(`[post-id=${id}]`).addClass("active");

    const postUrl = myPosts[id].download_url;

    $.ajax({
        url: postUrl,
        success: function (data) {
            var postContent = $("<div>").html(data);
            var postMeta = $("<div>");
            postMeta.addClass("meta").append(postContent.find("post-time")).append(postContent.find("post-category"));
            
            var postTitle = $("<h2>").text(postContent.find("post-title").text());

            postContent.find("article").prepend(postTitle);
            postContent.find("article").prepend(postMeta);
            $("#post-content").html(postContent);
            Prism.highlightAll();
        },
        error: function (error) {
            console.log("error", error);
        },
    });
    console.log("post", id);
}

function storePosts(posts) {
	sessionStorage.setItem(
		"posts",
		JSON.stringify({
			expires: Date.now() / 1000 + 60*60*1,
			posts: posts,
		})
	);
}

function getPostIdFromTitle(title) {
    return myPosts.findIndex((post) => post.name === `${title}.html`);
}

window.onpopstate = function (event) {
	if (event.state && event.state.postId) {
		var postId = event.state.postId;
		getPost(postId);
	}
};