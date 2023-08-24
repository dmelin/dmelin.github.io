$(document).ready(function () {
    var thetime, thetext, thehour, theminute
    var theclock = $("#theclock")
    var thenumbers = {
        1: "ett",
        2: "två",
        3: "tre",
        4: "fyra",
        5: "fem",
        6: "sex",
        7: "sju",
        8: "åtta",
        9: "nio",
        10: "tio",
        11: "elva",
        12: "tolv",
    }
    setInterval(function () {
        thetime = new Date
        thetext = ""

        theminute = thetime.getMinutes()

        thehour = thetime.getHours()

        if (theminute < 5) {
            thetext += "typ"
        } else if (theminute < 10) {
            thetext += "strax över"
        } else if (theminute >= 10 && theminute <= 20) {
            thetext += "ungefär kvart över"
        } else if (theminute < 25) {
            thetext += "snart halv"
            thehour++
        } else if (theminute >= 25 && theminute <= 35) {
            thetext += "runt halv"
            thehour++
        } else if (theminute < 40) {
            thetext += "snart kvart i"
            thehour++
        } else if (theminute < 50) {
            thetext += "ungefär kvart i"
            thehour++
        } else if (theminute >= 50) {
            thetext += "snart"
            thehour++
        } else if (theminute > 55) {
            thetext += "typ"
            thehour++
        }

        thehour = (thehour > 12) ? thehour - 12 : thehour

        theclock.html("klockan är " + thetext + " " + thenumbers[thehour])
    }, 100)
})