const randomWords = [
    "atomic",
    "cybernetic",
    "digital",
    "electric",
    "futuristic",
    "genetic",
    "hovering",
    "intelligent",
    "jet-powered",
    "laser",
    "magnetic",
    "mechanical",
    "nuclear",
    "organic",
    "plasma",
    "quantum",
    "rocket",
    "solar",
    "sonic",
    "space",
    "super",
    "techno",
    "telepathic",
    "time-traveling",
    "turbocharged",
    "ultra",
    "virtual",
    "vintage",
    "wooden",
    "alien",
    "android",
    "apocalyptic",
    "artificial intelligence",
    "astronomical",
    "augmented reality",
    "autonomous",
    "bionic",
    "biotech",
    "blockchain",
    "brain-computer interface",
    "cargo",
    "chemical",
    "cloned",
    "combustion",
    "communication",
    "computer",
    "construction",
    "cryptocurrency",
    "cybersecurity",
    "data",
    "delivery",
    "design",
    "digital twin",
    "drone",
    "education",
    "electric vehicle",
    "energy",
    "entertainment",
    "environment",
    "exoskeleton",
    "financial",
    "flying",
    "food",
    "gaming",
    "genetic engineering",
    "globalization",
    "green technology",
    "healthcare",
    "holographic",
    "humanoid",
    "hyperloop",
    "industrial",
    "information",
    "infrastructure",
    "innovation",
    "internet of things",
    "logistics",
    "manufacturing",
    "medical",
    "military",
    "mining",
    "mobile",
    "nanotechnology",
    "neural network",
    "nuclear fusion",
    "ocean",
    "oil and gas",
    "planetary colonization",
    "plastic",
    "pollution",
    "renewable energy",
    "robotics",
    "satellite",
    "semiconductor",
    "self-driving",
    "smart city",
    "social media",
    "space exploration",
    "space tourism",
    "supply chain",
    "sustainability",
    "symbiotic",
    "synthetic",
    "teleportation",
    "transportation",
    "unmanned aerial vehicle",
    "urbanization",
    "virtual assistant",
    "virtual reality",
    "voice recognition",
    "water",
    "wearable technology",
    "weather",
    "wind power",
    "wireless",
    "zero-emission",
]
const items = [
    "book",
    "orange",
    "car",
    "tree",
    "flower",
    "mountain",
    "river",
    "ocean",
    "lake",
    "beach",
    "forest",
    "desert",
    "snow",
    "rain",
    "sun",
    "moon",
    "star",
    "cloud",
    "sky",
    "rainbow",
    "pot of gold",
    "unicorns",
    "dragons",
    "fairies",
    "mermaids",
    "pirates",
    "aliens",
    "robots",
    "dinosaurs",
    "superheroes",
    "villains",
    "magic",
    "wishes",
    "dreams",
    "nightmares",
    "music",
    "art",
    "dance",
    "poetry",
    "literature",
    "cinema",
    "theater",
    "video games",
    "sports",
    "travel",
    "adventure",
    "learning",
    "discovery",
    "friendship",
    "family",
    "community",
    "house",
    "apartment",
    "chair",
    "table",
    "bed",
    "sofa",
    "TV",
    "computer",
    "phone",
    "clothes",
    "shoes",
    "food",
    "drink",
    "money",
    "tools",
    "toys",
    "games",
    "books",
    "magazines",
    "newspapers",
    "sports equipment",
    "musical instruments",
    "art supplies",
    "gardening supplies",
    "cleaning supplies",
    "pets",
    "plants",
    "vehicles",
    "buildings",
    "furniture",
    "appliances",
    "electronics",
    "jewelry",
    "artwork",
    "collectibles",
    "antiques",
    "souvenirs",
    "gifts",
    "trash",
    "recycling",
    "compost",
    "hazardous waste",
    "penis",
    "boobs",
    "arse",
    "vagina"
];
const pencilIn = [
    "usual hand",
    "wrong hand",
    "mouth",
    "fist",
    "fist, up side down"
]

var maxTime = 120
var time = maxTime

$(document).ready(function () {
    $("#goCrazy").click(function (e) {
        $(this).toggleClass("yes")
        $(this).toggleClass("btn-success")
        $(this).toggleClass("btn-light")

        $("#theButton").click()
    })
    $("#theButton").click(function (e) {
        time = maxTime
        $("#theResult").addClass("gone")
        $("#theMethod").addClass("gone")
        $("#theClock").addClass("gone")

        var theWord = $("#theWord").val()

        if (theWord === "") {
            alert("Enter a word first")
            return false
        }

        if (theWord == "random") {
            theWord = items[Math.floor(Math.random() * items.length)]
        }
        var theCategory = randomWords[Math.floor(Math.random() * randomWords.length)]

        var theMethod = ($("#goCrazy").hasClass("yes")) ? pencilIn[Math.floor(Math.random() * pencilIn.length)] : pencilIn[0]

        setTimeout(function (e) {
            $("#theResult").html(theCategory + " " + theWord)
            $("#theResult").removeClass("gone")
            $("#theClock").removeClass("gone")

            if ($("#goCrazy").hasClass("yes")) {
                setTimeout(function (e) {
                    $("#theMethod").html("using your " + theMethod)
                    $("#theMethod").removeClass("gone")
                    $("#theClock").removeClass("gone")
                }, 500)
            }

        }, 600)
    })

    setInterval(function (e) {
        time = time - 1

        if (time < 0) time = 0

        var theClass = "alert-success"

        if ((maxTime - time) / maxTime < 0.75) theClass = "alert-warning"
        if ((maxTime - time) / maxTime < 0.33) theClass = "alert-danger"

        $("#theClock").removeClass("alert-success")
        $("#theClock").removeClass("alert-warning")

        $("#theClock").addClass(theClass)

        $("#theClock").html(time)
    }, 1000)
})
