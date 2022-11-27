$(function () {
    // size is how many results
    var size = 20;
    // necessary elements
    var fromDate = document.getElementById("fromDate");
    var toDate = document.getElementById("toDate");
    var searchResults = $("#searchResults")
    // ticketmaster parameters for API
    var checkBox = ""
    var music = "&classificationName=music&"
    var sports = "&classificationName=sports&"
    var other = ""
    // event listeners
    var searchBtn = $("#searchBtn");
    var checkBoxes = $(".custom-checkbox");
    var eventName; 
    var eventDate;
    var saveBtn;
// delcare 16-18 globally to use them in the favorites list?

    checkBoxes.on("click", function (event) {
        var checkId = $(event.target).attr("id");
        if (checkId === "checkSports") {
            // have something clear search results
            checkBox = sports;
        } else if (checkId === "checkMusic") {
            // have something clear search results
            checkBox = music;
        } else if (checkId === "checkOther") {
            // have something clear search results
            checkBox = other;
        }
    })

    searchBtn.on("click", function () {
        getAPI();
    });

    function getAPI() {
        var ticketmasterUrl = "https://app.ticketmaster.com/discovery/v2/events.json?" + checkBox + "size=" + size + "&city=[philadelphia]&localStartDateTime=" + fromDate.value + "T00:00:00," + toDate.value + "T23:59:59&apikey=CHo9U7G9NvQH3YdZsAJYBoNV5by3z3Hq";

        fetch(ticketmasterUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                for (let i = 0; i < data._embedded.events.length; i++) {
                    // assign API data
                    eventName = data._embedded.events[i].name;
                    var venue = data._embedded.events[i]._embedded.venues[0].name;
                    var venueLat = data._embedded.events[i]._embedded.venues[0].location.latitude;
                    var venueLon = data._embedded.events[i]._embedded.venues[0].location.longitude;
                    var venueAddress = data._embedded.events[i]._embedded.venues[0].address.line1;
                    eventDate = data._embedded.events[i].dates.start.localDate;
                    var eventDateB = eventDate.split('-');
                    eventDate = eventDateB[1] + "-" + eventDateB[2] + "-" + eventDateB[0];
                    var eventTime = data._embedded.events[i].dates.start.localTime;
                    var ticketUrl = data._embedded.events[i].url;
                    var imageLink = data._embedded.events[i].images[8].url;
                    // var minPrice = data._embedded.events[i].priceRanges[0].min
                    // console.log(minPrice);
                    // create elements
                    var imgSectEl = $('<section class="media-left level m-0 is-mobile"></section>');
                    var imgSizeEl = $('<p class="image custom-img"></p>')
                    var posterEl = $(`<img src="'${imageLink}'" alt="">`);
                    var figureEl = $('<figure class="m-2 px-4 py-3 col-surface2 level customMedia"></figure>');
                    var topSectEl = $('<section class="is-two-thirds has-text-left pl-4">');
                    var anchorEl = $(`<a href="${ticketUrl}"><h3 class="col-on-surface subtitle is-5 custom-textBox">${eventName}</h3></a>`);
                    var venueEl = $(`<h3 class="col-on-surface custom-textBox"><b>${venue}</b></h3>`);
                    var dateEl = $(`<h3 class="col-on-surface">${eventDate}</h3>`);
                    var bottomSectEl = $('<section class="is-one-quarter is-justify-content-right buttons"></section>');
                    var foodBtn = $('<button class="button custom-btn3 col-on-primary is-small m-1"><b>Food Nearby</b></button>');
                    var saveBtn = $('<button class="button custom-btn4 col-on-primary is-small favorite m-1"><i class="fa-regular fa-bookmark col-on-primary"></i></button>');
                    // append elements
                    figureEl.append(imgSectEl);
                    imgSectEl.append(imgSizeEl);
                    imgSectEl.append(topSectEl)
                    imgSizeEl.append(posterEl)
                    searchResults.append(figureEl);
                    // figureEl.append(topSectEl);
                    topSectEl.append(anchorEl);
                    topSectEl.append(venueEl);
                    topSectEl.append(dateEl); //maybe could just be month and day
                    figureEl.append(bottomSectEl);
                    bottomSectEl.append(foodBtn);
                    bottomSectEl.append(saveBtn);
                    findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl);
                }
            });

            // saveBtn.on("click", function (event) {
            //     event.preventDefault();
            //     console.log("hit");
            //     localStorage.setItem(eventTime, eventName);
                // var saveBtn = documemt.querySelector(".favorite");
                // var saveBtn = $('<button class="button custom-btn4 col-on-primary is-small favorite m-1"><i class="fa-solid fa-bookmark col-on-primary"></i></button>');
                // saveFavorites ();
            // });

        // var favoritesList = documemt.getElementById("favoritesList")
        // function saveFavorites () {
            // var saveBtn = $('<button class="button custom-btn4 col-on-primary is-small favorite m-1"><i class="fa-solid fa-bookmark col-on-primary"></i></button>');
            // change class from fa-regular to fa-solid to display a dark bookmark
        // }

        // PSEUDO CODE:
        // when save button is clicked, show name/date is saved to local storage
        // AND event is added to favorites list
        // AND bookmark icon class is changed to dark/filled in 

        // when added to favorites list:
        // list item is created dynamically
        // and classes assigned for styling 

        // when page loads, items saved in local storage populate favorites list 



        function findFood(venue, venueAddress, venueLat, venueLon, eventTime, ticketUrl, imageLink, ticketUrl) {
            // limit is how many results
            var limit = 20;
            var geoapifyUrl = "https://api.geoapify.com/v2/places?categories=catering&bias=proximity:" + venueLon + "," + venueLat + "&limit=" + limit + "&apiKey=abbaf448e8fd46d789223be439a4096c";

            fetch(geoapifyUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // all properties
                     console.log(data.features[0].properties);
                    // name
                    var foodName = data.features[0].properties.name;
                    console.log("Restaurant Name: " + foodName);
                    // address
                    var foodAddress = data.features[0].properties.address_line2;
                    console.log("Restaurant Address: " + foodAddress);
                    // distance from venue
                    var distance = data.features[0].properties.distance;
                    console.log(distance);
                });
        }
    }

            
    // using any clicks on the document, specifying for the saveBtn, should register the click even on dynamically created element
    var saveBtn = document.querySelector(".favorite")
    $(document).on("click", saveBtn, function () {
        localStorage.setItem(eventDate, eventName);
        console.log("hit");
    });
});