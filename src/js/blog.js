$(document).ready(function () {
	const postsDirectory = "posts/";

	// Function to load and display post list
	function loadPostList() {
		$.ajax({
			url: "https://api.github.com/repos/dmelin/dmelin.se.github.io/contents/posts",
			method: "GET",
			success: function (posts) {
				const postList = $("#post-list");
				postList.empty();

				posts.forEach(function (post) {
					if (post.name.endsWith(".html")) {
						const fileName = post.name;
						const postDate = fileName.substring(0, 10);
						const postTitle = fileName.substring(11, fileName.length - 5).replace(/-/g, " ");

						const listItem = $("<li>").append(
							$("<a>")
								.attr("href", "#" + fileName)
								.text(postTitle + " (" + postDate + ")")
						);

						postList.append(listItem);
					}
				});

				// Load the first post by default
				if (posts.length > 0) {
					loadPost(posts[0].name);
				}
			},
		});
	}

	// Function to load and display a post
	function loadPost(fileName) {
		$.ajax({
			url: postsDirectory + fileName,
			method: "GET",
			success: function (content) {
				$("#post-content").html(content);
			},
		});
	}

	// Handle clicks on post links
	$("#post-list").on("click", "a", function (e) {
		e.preventDefault();
		const fileName = $(this).attr("href").substring(1);
		loadPost(fileName);
	});

	// Initial load of post list
	loadPostList();
});
