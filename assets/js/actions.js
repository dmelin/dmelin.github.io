$(document).ready(function () {
    function setTime() {
        (async () => {

            var thetime, thetext, thehour, theminute
            var theclock = $("#theclock")
            var oldtime = theclock.html()
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

            thetext = "klockan är " + thetext + " " + thenumbers[thehour]

            if (oldtime !== thetext) {
                oldtime = oldtime.split("")
                newtime = thetext.split("")

                for (i = 0; i < newtime.length + 1; i++) {
                    await sleep(50);

                    showtext = newtime.slice(0, i).join("") + oldtime.slice(i, oldtime.length).join("")
                    theclock.html(showtext)
                }
                theclock.html(thetext)

                console.log("time changed!")
            }

            setTimeout(function () {
                setTime()
            }, 500)
        })()

    }
    setTime()
})

const DEF_DELAY = 1000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}
