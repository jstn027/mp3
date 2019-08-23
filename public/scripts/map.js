const MAP_CONTAINER = document.querySelector(".philippine-map_container");
const MAP_VIEW = document.querySelector(".philippine-map_view");
const LOCATION_INFO_BOX = document.querySelector(".philippine-location_info")
const LOCATION_INFO = document.querySelector(".location_info_container")
const LOCATION_CLOSE = document.querySelector(".location_close")

let panning = false, lastPosition = {}, currentTranslate = {x: 0, y: -660};

let locations = {
  location_balete: {
    title: `Balete Drive`,
    location: `Quezon City, Metro Manila`,
    writeup: `Balete Drive in Quezon City, Philippines, has a resident ghost which any local can tell you about. Their famous ‘White Lady’ ghost haunts motorists in the midnight hours, and all have learned not to pick-up hitchhikers, or stare into their rear-view mirrors when on that road.`,
    maps_link: `https://goo.gl/maps/UNHv2CpcVHQCbWKv7`,
    comments: [
      { user_photo: 'images/bonesaw.jpg',
        user_name: 'Bonesaw McGraw',
        comment: `  What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.`
      },
      { user_photo: 'images/bonesaw.jpg',
        user_name: 'Bonesaw 2nd Account',
        comment: `Luh`
      }
    ]
  },
  location_laperal: {
    title: `Laperal White House`,
    location: `Baguio City, Benguet`,
    writeup: `One day, the caretaker of the house, who stays in another house within the premises, ordered a guard to cut down a fortune plant on one side of the house. The guard fell ill and could not walk for days. A guard also shared his personal experience inside. Once while he was doing the rounds inside, he received a call from his wife. The call went fine until she asked who he was with at the time. The wife apparently kept hearing a woman’s voice. Thing is, the guard was all alone.`,
    maps_link: `https://goo.gl/maps/6Rirawxte1JRUkxHA`,
    comments: [
      { user_photo: 'images/bonesaw.jpg',
        user_name: 'Bonesaw 2nd Account',
        comment: `  Luh`
      }]
  },
    location_gorordo: {
    title: `Casa Gorordo Museum`,
    location: `Cebu City, Cebu`,
    writeup: `Located in Cebu City, it previously served as the family residence of Juan Gorordo, the first Filipino bishop of the Philippines. He died in the master's bedroom in 1934. Believers, however, claim of a female specter who is said to be the ghost of one of Gorordo's spinster sisters.`,
    maps_link: `https://goo.gl/maps/Bj2xRVWSeGECRR648`,
    comments: []
  },
    location_lambusan: {
    title: `Lambusan Public Cemetery`,
    location: `Barangay Lambusan, San Remigio, Cebu`,
    writeup: `Located in Barangay Lambusan, San Remigio, it is situated in one of the poorest areas of the northern sector of the province. Several of the remains of the deceased were reportedly piled in a common area, as their families and relatives had no more enough money to pay for the yearly rent of the tombs. Ghost sightings in the cemetery have been reported by believers.`,
    maps_link: `https://goo.gl/maps/qGCS7WZJaLKkyZpw6`,
    comments: []
  }
}

function holdPan(e) {
  if(e.target.classList[0] != 'philippine-location_info')
    panning = true;
}

function releasePan() {
  panning = false;
  lastPosition = {};
}

function pan(event) {
  if (panning){
    if (typeof(lastPosition.x) != 'undefined') {
        var deltaX = lastPosition.x - event.clientX,
            deltaY = lastPosition.y - event.clientY;

        currentTranslate.x += deltaX;
        currentTranslate.y -= deltaY;
        MAP_VIEW.style.transform = `translate(${currentTranslate.x}px,${currentTranslate.y}px)`

    }

    lastPosition = {
        x : event.clientX,
        y : event.clientY
    };
  }
}

function toggleSideView(e){
  if(e.target.className == 'philippine-map_location' ||
    e.target.className == 'location_image' )
    LOCATION_INFO_BOX.style.display = 'block'
  if(e.target.className == 'location_close')
    LOCATION_INFO_BOX.style.display = 'none'
}

function locationClick(e) {
  let locationId = e.target.closest('.philippine-map_location').id

  LOCATION_INFO.innerHTML = ""

    let title = document.createElement('div')
      title.className = 'location_row location_title'
      title.innerHTML = locations[locationId].title
    LOCATION_INFO.appendChild(title)
    let vote = document.createElement('div')
      vote.className = 'location_upvote'
      let voteString =
      `
          <img class="vote_up vote" draggable="false" src="images/arrow-up.svg" /> Vote
          <img class="vote_down vote" draggable="false" style="transform: rotate(180deg)" src="images/arrow-up.svg" />

      `
      vote.innerHTML = voteString
      // LOCATION_INFO.appendChild(vote)

    let location = document.createElement('div')
      location.className = 'location_row location'
      location.innerHTML = locations[locationId].location
    LOCATION_INFO.appendChild(location)

    let writeup = document.createElement('div')
      writeup.className = 'location_row location_writeup'
      writeup.innerHTML = locations[locationId].writeup
    LOCATION_INFO.appendChild(writeup)

    let mapsLinkContainer = document.createElement('div')
      mapsLinkContainer.className = 'location_row'

      let mapsLink = document.createElement('a')
        mapsLink.href = locations[locationId].maps_link
        mapsLink.target = "_blank"
        mapsLink.className = "location_maps-link"
        mapsLink.innerHTML = `<img draggable="false" src="images/google-maps-logo.svg" />Open in Google Maps`

      mapsLinkContainer.appendChild(mapsLink)
      mapsLinkContainer.appendChild(vote)
      LOCATION_INFO.appendChild(mapsLinkContainer)

      let commentsContainer = document.createElement('div')
        commentsContainer.classList.add("location_comments")

        let commentsTitle = document.createElement('div')
        commentsTitle.className = "location_row location_title"
        commentsTitle.innerHTML = "comments"

      commentsContainer.appendChild(commentsTitle)

      let comment = document.createElement('div')
        comment.className = "location_comment_content"
      if(locations[locationId].comments.length != 0){


        let comments = locations[locationId].comments
        for(let commentData in comments){
          comment = document.createElement('div')
          comment.className = "location_comment_content"

          let commentString =
          ` <hr/>
            <div class="location_row location_user">
              <img src="${comments[commentData].user_photo}" class="user_photo"
              <div class="user_name">
                ${comments[commentData].user_name}
              </div>
              <div class="location_row location_comment">
                ${comments[commentData].comment}
              </div>
            </div>
            `
          comment.innerHTML = commentString;

          commentsContainer.appendChild(comment)
        }
      } else {
        comment.innerHTML = '<hr /> <div class="location_row"> No comments found for this location. </div>'
        commentsContainer.appendChild(comment)
      }

      LOCATION_INFO.appendChild(commentsContainer)
      toggleSideView(e);
}


const locationImage = '<img class="location_image" draggable="false" src="images/location.svg" />'
function generateLocation(x, y, id){
  let newLocation = document.createElement('div')
  newLocation.classList.add("philippine-map_location")
  newLocation.id = id;
  newLocation.style.top = y + 'px';
  newLocation.style.left = x + 'px';
  newLocation.innerHTML = locationImage;
  newLocation.addEventListener("click", locationClick)

  MAP_VIEW.appendChild(newLocation);
}

generateLocation(700,1130, "location_balete")
generateLocation(614,810, "location_laperal")
generateLocation(1200,1900, "location_gorordo")
generateLocation(1190,1830, "location_lambusan")

LOCATION_CLOSE.addEventListener("click", toggleSideView)
MAP_CONTAINER.addEventListener("mousemove", pan);
document.addEventListener("mousedown", holdPan);
document.addEventListener("mouseup", releasePan);
