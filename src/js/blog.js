$(document).ready(function () {
	const postsDirectory = "posts/";
    var myPosts;

    const url = decodeURI(window.location.href.split("?")[1]);
    
	// Function to load and display post list
	function loadPostList() {
		$.ajax({
			url: "https://api.github.com/repos/dmelin/dmelin.github.io/contents/posts",
			method: "GET",
            success: function (posts) {
                myPosts = posts;
				const postList = $("#post-list");
				postList.empty();

                myPosts.forEach(function (post, key) {
					if (post.name.endsWith(".html")) {
						const fileName = post.name;
						const postDate = fileName.substring(0, 10);
						const postTitle = fileName.substring(11, fileName.length - 5).replace(/-/g, " ");

						const listItem = $("<li>").append(
							$("<a>")
                                .attr("href", "#" + fileName)
                                .attr("post-id", key)
								.text(postTitle + " (" + postDate + ")")
						);

						postList.append(listItem);
					}
				});

				// Load the first post by default
                if (myPosts.length > 0 && url == "undefined") {
                    loadPost(0);
                } else if (url != "undefined") {
                    myPosts.forEach(function (post, key) {
                        console.log(post.name, url);
                        if (post.name == `${url}.html`) {
                            loadPost(key);
                            return;
                        }
                    });
                }
			},
		});
	}

	// Function to load and display a post
    function loadPost(postId) {
        const targetURL = myPosts[postId].download_url + "?random=" + Math.random();
        console.info(`Loading post from ${targetURL}`);
		$.ajax({
			url: targetURL,
            method: "GET",
            cache: false,
            success: function (content) {
                console.info('Post loaded', content);
                const $postContent = $(content);
                const $container = $("<div>").html($postContent);
                console.log($container.find("post-title").length);
			},
		});
	}

	// Handle clicks on post links
	$("#post-list").on("click", "a", function (e) {
		e.preventDefault();
		loadPost($(this).attr("post-id"));
	});

	// Initial load of post list
	loadPostList();
});
