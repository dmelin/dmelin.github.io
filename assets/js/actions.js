$(document).ready(function () {
    $(document).scroll(function () {
        var h = $(window).height()
        var distance = $("html").scrollTop()
        var au = (distance / h / 10).toFixed(2)
        $("#distance").html(au + " AU")
    })

    function setTime() {
        (async () => {

            var thetime, thetext, thehour, theminute
            var theclock = $("#theclock")
            var oldtime = theclock.text().trim()
            var thenumbers = {
                1: "one",
                2: "two",
                3: "three",
                4: "four",
                5: "five",
                6: "six",
                7: "seven",
                8: "eight",
                9: "nine",
                10: "ten",
                11: "eleven",
                12: "twelve",
            }
            thetime = new Date
            thetext = ""

            theminute = thetime.getSeconds()

            thehour = thetime.getHours()

            if (theminute < 5) {
                thetext += "about"
            } else if (theminute < 10) {
                thetext += "right after"
            } else if (theminute >= 10 && theminute <= 20) {
                thetext += "almost a quarter past"
            } else if (theminute < 25) {
                thetext += "almost half past"
                // thehour++
            } else if (theminute >= 25 && theminute <= 35) {
                thetext += "around half past"
                // thehour++
            } else if (theminute < 40) {
                thetext += "almost a quarter to"
                thehour++
            } else if (theminute < 50) {
                thetext += "about a quarter to"
                thehour++
            } else if (theminute >= 50) {
                thetext += "almost"
                thehour++
            } else if (theminute > 55) {
                thetext += "about"
                thehour++
            }

            thehour = (thehour > 12) ? thehour - 12 : thehour

            if (thehour === 0) thehour = 12

            thetext = "the clock is " + thetext + " " + thenumbers[thehour]

            if (oldtime !== thetext) {
                oldtime = oldtime.split("")
                newtime = thetext.split("")

                for (i = 0; i < newtime.length + 1; i++) {
                    var sleeptime = (oldtime.length) ? 100 : 1
                    await sleep(sleeptime);

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

    var au = 1000
    var sizemodifier = 10
    var planets = {
        "mercury": {
            "distance": 0.39,
            "diameter": 0.38,
            "color": "#CC5544, #EE99FF, #0000FF",
            "moons": 0
        },
        "venus": {
            "distance": 0.72,
            "diameter": 0.95,
            "color": "#EE99FF, #FFFF00, #FF8C00",
            "moons": 0
        },
        "tellus": {
            "distance": 1,
            "diameter": 1,
            "color": "#0000FF, #00FFFF, #0071C5",
            "moons": 1
        },
        "mars": {
            "distance": 1.52,
            "diameter": 0.53,
            "color": "#FF8C00, #FF0000, #DAA520",
            "moons": 2
        },
        "jupiter": {
            "distance": 5.2,
            "diameter": 11.2,
            "color": "#FFD700, #FFA500, #87CEEB",
            "moons": 79
        },
        "saturn": {
            "distance": 9.54,
            "diameter": 9.45,
            "color": "#DAA520, #87CEEB, #4B70DD",
            "moons": 82
        },
        "uranus": {
            "distance": 19.2,
            "diameter": 4.01,
            "color": "#87CEEB, #4B70DD, #87CEEB",
            "moons": 27
        },
        "neptune": {
            "distance": 30.6,
            "diameter": 3.88,
            "color": "#4B70DD, #87CEEB, #4B70DD",
            "moons": 14
        }
    }
    for (const key in planets) {
        var planet = $("#" + key)
        planet.css("top", (planets[key].distance * au) + "vh")

        var body = $('<div></div>')
        body.addClass("planet").css({
            "background": "url('/assets/images/planets/" + key + ".png')",
            // "width": (planets[key].diameter * sizemodifier) + "vw",
            // "height": (planets[key].diameter * sizemodifier) + "vw"
        })

        var moons = []
        for (i = 0; i < planets[key].moons; i++) {
            moon = $("<div></div>")
            moon.addClass("moon")
            moons.push(moon)
        }
        planet.find("h2").append(moons)
        planet.find(".moon").wrapAll('<div class="moons">')
        planet.find("h2").prepend(body)
    }

    setTime()

})

const DEF_DELAY = 1000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}
