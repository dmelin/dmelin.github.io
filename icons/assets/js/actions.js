document.addEventListener('DOMContentLoaded', function () {

    $("sl-color-picker").each(function () {
        $(this).on("sl-change", function (el) {
            var targetColor = ($(this).parent().hasClass("color-bg")) ? "color-bg" : "color-fg"
            var newColor = $(this).val() //parent().find(".color-picker__user-input").val()
            console.log("color changed", newColor)
            $("dm-icon").attr(targetColor, newColor)
        })
    })

    const dialog = document.querySelector('.dialog-overview');
    const closeButton = dialog.querySelector('sl-button[variant="primary"]');
    const copyButton = dialog.querySelector('sl-button[variant="secondary"]');
    const codeArea = dialog.querySelector('sl-textarea');

    closeButton.addEventListener('click', () => dialog.hide())

    copyButton.addEventListener("click", () => {
        codeArea.select()
        document.execCommand("copy")
        codeArea.setSelectionRange(0, 0)

        copyButton.variant = "success"
        copyButton.innerHTML = 'Copied!'
        console.log("copied!")
    })
    $("icon").click(function () {
        copyButton.variant = "secondary"
        copyButton.innerHTML = 'Copy'
        var code = $($(this).prop("innerHTML"));

        var codeString = $(code).html("").prop("outerHTML").replace('=""', "")

        dialog.label = "icon: " + $(this).data("name")
        codeArea.value = codeString
        dialog.show()
    })

    $("#search").on("sl-change, sl-input", function () {
        var search = $(this).val()

        if (search === "") {
            $("icon").show(100)
        } else {
            $("icon:not([data-search*='" + $(this).val() + "'])").hide(100)
            $("icon[data-search*='" + $(this).val() + "']").show(100)
        }
    })
    $("icon").each(function () {
        var title = $("<p>")
        title.html($(this).attr("data-name"))
        $(this).append(title)
    })
})