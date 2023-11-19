const firebaseConfig = {
    apiKey: "AIzaSyD05IcVDfMqI4jpCaAgr8dRBKykEtPpojc",
    authDomain: "superchat-d6246.firebaseapp.com",
    databaseURL: "https://superchat-d6246-default-rtdb.firebaseio.com",
    projectId: "superchat-d6246",
    storageBucket: "superchat-d6246.appspot.com",
    messagingSenderId: "306638710041",
    appId: "1:306638710041:web:ddf5fbf0be912cb60a5188",
    measurementId: "G-PXTT6E6J3S"
};

firebase.initializeApp(firebaseConfig);

var titles = document.querySelectorAll(".peom-Title")
var texts = document.querySelectorAll(".poem-First-Little-Text")

var today = false
var yesterday = false
var pre7Days = false
var pre30Days = false

var datesPathsFormatted = []
var datesPathsFormatted2 = []
var datesPathsCreated = []

var poemsData = []

var currentOpenedIndex = 0

var confirmDelete = false;

const apiKey = 'pTFdtB7nkvUbpcUtForgIX9NaX7YNgFYFM2QZ2eHbkmLox4u1P6mF5Zk';
var searchQuery = 'Poem Background Images'; // Replace with your search query

const style = document.createElement('style');
var r = document.querySelector(':root');
var words = document.querySelectorAll(".word");

var imageIndex = 10

var dateTimes = []

function generateRandomLetters() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < 20; i++) {
        // Get a random index from the alphabet string
        const randomIndex = Math.floor(Math.random() * alphabet.length);

        // Append the random letter to the string
        randomString += alphabet.charAt(randomIndex);
    }

    return randomString;
}

function categorizeDates(dateArray) {
    const currentDate = new Date();  // Current date and time

    const result = dateArray.map((dateString) => {
        const date = new Date(dateString);
        const timeDifference = currentDate.getTime() - date.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference === 0) {
            return "Current day";
        } else if (daysDifference === 1) {
            return "Previous day";
        } else if (daysDifference <= 7) {
            return "Last 7 days";
        } else if (daysDifference <= 30) {
            return "Last 30 days";
        } else {
            return "Over a month ago";
        }
    });

    return result;
}

// Example usage:
const dateArray = ["2023-11-01T12:00:00", "2023-11-05T08:00:00", "2023-11-15T18:30:00"];
const result = categorizeDates(dateArray);

function checkCompletion() {
    var title = document.getElementById("poem-Title-Change").value

    if(title != "") {
        document.getElementById("create-Poem").style.opacity = "1"
    } else {
        document.getElementById("create-Poem").style.opacity = "0.5"
    }
}

function datePath(date) {
    sec = new Date(date).getSeconds()
    min = new Date(date).getMinutes()
    hour = new Date(date).getHours()
    day = new Date(date).getDate()
    month = new Date(date).getMonth()
    year = new Date(date).getFullYear()

    if(sec < 10) {
        sec = 0 + String(sec)
    }

    if(min < 10) {
        min = 0 + String(min)
    }

    if(hour < 10) {
        hour = 0 + String(hour)
    }

    if(day < 10) {
        day = 0 + String(day)
    }

    if(month < 10) {
        month = 0 + String(month)
    }

    return(String(year) + String(month) + String(day) + String(hour) + String(min) + String(sec))
}

function createPoem() {
    var title = document.getElementById("poem-Title-Change").value

    if(title != "") {
        dateInfo = datePath(String(new Date()))
        firebase.database().ref("Poems/" + dateInfo).set({
            "last_Updated":String(new Date()),
            "poem_Text": "",
            "poem_HTML": "",
            "poem_Title": title,
            "date_Created": String(new Date())
        }).then(function() {
            document.getElementById("create-Poem-Content").style.transition = ".5s"
            document.getElementById("create-Poem-Content").style.opacity = "0"
            document.getElementById("poem-Title-Text").textContent = title
            setTimeout(function() {
                document.getElementById("poem-Title-Text").style.opacity = "1"
                document.getElementById("has-Been-Created-Text").style.opacity = "1"
                document.getElementById("checkmark-Element").style.animation = "fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both"
                document.getElementById("checkmark-Element-2").style.animation = "stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards"
                document.getElementById("checkmark-Element-3").style.animation = " stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards"

                setTimeout(function() {
                    document.querySelector("body").style.transition = ".5s"
                    document.querySelector("body").style.opacity = "0"
                
                    setTimeout(function() {
                        window.location = "/edit/?pid=" + dateInfo
                    }, 500)
                }, 2000)
            }, 1500)
        })
    } else if(title != "" && imgSRC == "") {
        alert("Add Poem Cover Image")
    } else if(title == "" && imgSRC != "") {
        alert("Add Title To Poem")
    } else {
        alert("Add Title & Poem Cover Image")
    }
}

function formatTimeAgo(lastEditedDate, currentDate) {
    const timeDifference = currentDate.getTime() - lastEditedDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds}s ago`;
    } else if (minutes <= 60) {
        return `${minutes}m ago`;
    } else if (hours <= 24) {
        return `${hours}h ago`;
    } else if (days <= 7) {
        return `${days}d ago`;
    } else if (weeks <= 4) {
        return `${weeks}w ago`;
    } else if (months <= 12) {
        return `${months}mo ago`;
    } else {
        return `${years}y ago`;
    }
}

function checkToday(lastEditedDate) {
    var currentDate = new Date()
    const timeDifference = currentDate.getTime() - lastEditedDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    // console.log(days)
    if(days < 1) {
        return true;
    } else {
        // console.log("false")
        return false;
    }
}

function checkYesterday(lastEditedDate) {
    var currentDate = new Date()
    const timeDifference = currentDate.getTime() - lastEditedDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (days >= 1 && days < 2) {
        return true;
    } else {
        return false
    }
}

function check7Days(lastEditedDate) {
    var currentDate = new Date()
    const timeDifference = currentDate.getTime() - lastEditedDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (days < 7) {
        return true;
    } else {
        return false
    }
}

function check30Days(lastEditedDate) {
    var currentDate = new Date()
    const timeDifference = currentDate.getTime() - lastEditedDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (days >= 7 && days < 30) {
        return true;
    } else {
        return false
    }
}

var index = 0
var time = 0

firebase.database().ref("Poems/").once("value", function(snapshot) {
    snapshot.forEach(function(child) {
        poemsData.push(child.val())
        datesPathsFormatted.push(datePath(child.val().last_Updated))
        datesPathsFormatted2.push(datePath(child.val().last_Updated))
        datesPathsCreated.push(datePath(child.val().date_Created))
        dateTimes.push(child.val().last_Updated)
        console.log(datePath(child.val().last_Updated))
        // console.log(child.val())

        // const lastEditedDate = new Date(child.val().last_Updated);
        // const currentDate = new Date();
        // const formattedTimeAgo = formatTimeAgo(lastEditedDate, currentDate);
        // // console.log(formattedTimeAgo);
        // var element = document.createElement("div")

        // element.classList.add("writing-Container")

        // element.id = "element-Remove-Id-" + index

        // element.setAttribute("onclick", "openPoem(" + index + ")")
        // element.style.opacity = "0"

        // element.innerHTML = '<div id="img-Glow"></div><div class="text-Container"><div class="peom-Title">' + child.val().poem_Title + '</div><div class="poem-First-Little-Text">' + child.val().poem_Text + '</div></div><div class="date">' + formattedTimeAgo + '</div>'
        
        // if(checkToday(lastEditedDate)) {
        //     document.getElementById("today-Days-Poems").prepend(element)
        //     today = true
        // } else if(checkYesterday(lastEditedDate)) {
        //     document.getElementById("yesterday-Days-Poems").prepend(element)
        //     yesterday = true
        // } else if(check7Days(lastEditedDate)) {
        //     document.getElementById("previous-7-Days-Poems").prepend(element)
        //     pre7Days = true
        // }
    })

    // console.log(datesPathsFormatted)
    var newPoemsDate = datesPathsFormatted.sort()
    console.log(newPoemsDate)
    console.log(datesPathsFormatted2)


    for(var i=0;i<poemsData.length;i++) {
        var index1 = datesPathsFormatted2.indexOf(newPoemsDate[i])
        const lastEditedDate = new Date(poemsData[index1].last_Updated);
        const currentDate = new Date();
        const formattedTimeAgo = formatTimeAgo(lastEditedDate, currentDate);
        // console.log(formattedTimeAgo);
        var element = document.createElement("div")

        element.classList.add("writing-Container")

        element.id = "element-Remove-Id-" + index

        element.setAttribute("onclick", "openPoem(" + index + ")")
        element.style.opacity = "0"

        element.innerHTML = '<div id="img-Glow"></div><div class="text-Container"><div class="peom-Title">' + poemsData[index1].poem_Title + '</div><div class="poem-First-Little-Text">' + poemsData[index1].poem_Text + '</div></div><div class="date">' + formattedTimeAgo + '</div>'
        
        if(checkToday(lastEditedDate)) {
            document.getElementById("today-Days-Poems").prepend(element)
            today = true
        } else if(checkYesterday(lastEditedDate)) {
            document.getElementById("yesterday-Days-Poems").prepend(element)
            yesterday = true
        } else if(check7Days(lastEditedDate)) {
            document.getElementById("previous-7-Days-Poems").prepend(element)
            pre7Days = true
        } else if(check30Days(lastEditedDate)) {
            document.getElementById("previous-30-Days-Poems").prepend(element)
            pre30Days = true
            console.log("30 Days ago")
        }
        index += 1
    }

    if(today) {
        var element = document.createElement("div")

        element.classList.add("sub-Header")

        element.innerText = "Today"

        document.getElementById("today-Poem-Container").prepend(element)
    }

    if(yesterday) {
        var element = document.createElement("div")

        element.classList.add("sub-Header")

        element.innerText = "Yesterday"

        document.getElementById("yesterday-Poem-Container").prepend(element)
    }

    if(pre7Days) {
        
        var element = document.createElement("div")

        element.classList.add("sub-Header")

        element.innerText = "Previous 7 Days"

        document.getElementById("previous-7-Days-Poem-Container").prepend(element)
    }

    if(pre30Days) {
        
        var element = document.createElement("div")

        element.classList.add("sub-Header")

        element.innerText = "Previous 30 Days"

        document.getElementById("previous-30-Days-Poem-Container").prepend(element)
    }


    setTimeout(function() {
        document.querySelector("body").style.transition = ".5s"
        document.querySelector("body").style.opacity = "1"
        setTimeout(function() {
            var elements = document.querySelectorAll(".writing-Container")
            document.getElementById("loader").style.transition = ".5s"
            document.getElementById("loader").style.opacity = "0"
            document.getElementById("writing-Container").style.transition = ".5s"
            document.getElementById("writing-Container").style.opacity = "1"
            document.getElementById("bottom-Break").style.transition = ".5s"
            document.getElementById("bottom-Break").style.opacity = "1"
            setTimeout(function() {
                for(var i=0;i<elements.length;i++) {
                    elements[i].style.transition = ".5s"
                    elements[i].style.opacity = "1"
                    elements[i].style.transitionDelay = time + "s"
                    if(i<5) {
                        time += .05
                    }
                }
                // document.getElementById("writing-Container").style.transition = ".5s"
                // document.getElementById("writing-Container").style.opacity = "1"
                // setTimeout(function() {
                //     document.getElementById("writing-Container").style.transition = ".5s"
                    titles = document.querySelectorAll(".peom-Title")
                    texts = document.querySelectorAll(".poem-First-Little-Text")
                // }, 500)
    
                // setTimeout(function() {        
                //     openPoem(1)
                // }, 500)
            }, 100)
        }, 1000)
    }, 500)
})

function showCreateOption() {
    document.getElementById("create-Poem-Container").style.zIndex = "10"
    document.getElementById("create-Poem-Container").style.opacity = "0"

    document.getElementById("create-Poem-Container").style.transition = ".5s"
    document.getElementById("create-Poem-Container").style.opacity = "1"
    document.getElementById("create-Poem-Container").style.top = "50%"
    document.getElementById("background-Shadown").style.zIndex = "10"
    document.getElementById("background-Shadown").style.transition = ".5s"
    document.getElementById("background-Shadown").style.opacity = "1"

    setTimeout(function() {
        document.getElementById("create-Poem-Container").style.transition = "0s"
        document.getElementById("background-Shadown").style.transition = "0s"
    })
}

function closeCreateOption() {
    document.getElementById("create-Poem-Container").style.transition = ".5s"
    document.getElementById("background-Shadown").style.transition = ".5s"
    document.getElementById("background-Shadown").style.opacity = "0"
    // document.querySelector("body").style.background = "var(--otherCurrent-Color)"

    setTimeout(function() {
        document.getElementById("create-Poem-Container").style.opacity = "0"
        document.getElementById("create-Poem-Container").style.transition = "0s"
        document.getElementById("background-Shadown").style.opacity = "0"
        document.getElementById("background-Shadown").style.transition = "0s"
        setTimeout(function() {        
            document.getElementById("background-Shadown").style.zIndex = "-1"
            document.getElementById("create-Poem-Container").style.zIndex = "-1"
        }, 200)
    })
}

// showCreateOption()

function deletePoem(deleteIndex) {
    if(confirmDelete) {
        lastEditedDate = new Date(dateTimes[deleteIndex])
        document.getElementById("second-Visable-Bottom-Poem-Edit-Container").style.opacity = "0"
        document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.transition = ".5s"
        document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.opacity = "0"

        setTimeout(function() {
            document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.display = "none"
            document.getElementById("second-Visable-Bottom-Poem-Edit-Container").style.display = "flex"
            setTimeout(function() {
                document.getElementById("second-Visable-Bottom-Poem-Edit-Container").style.transition = ".5s"
                document.getElementById("second-Visable-Bottom-Poem-Edit-Container").style.opacity = "1"
                
                document.getElementById("checkmark-Element-1").style.animation = "fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both"
                document.getElementById("checkmark-Element-2-1").style.animation = "stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards"
                document.getElementById("checkmark-Element-3-1").style.animation = " stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards"
                document.getElementById("element-Remove-Id-" + deleteIndex).remove()

                if(checkToday(lastEditedDate) && document.getElementById("today-Days-Poems").innerHTML == '') {
                    document.getElementById("today-Poem-Container").style.display = "none"
                } else if(checkYesterday(lastEditedDate) && document.getElementById("yesterday-Days-Poems").innerHTML == '') {
                    document.getElementById("yesterday-Poem-Container").style.display = "none"
                } else if(check7Days(lastEditedDate) && document.getElementById("previous-7-Days-Poems").innerHTML == '') {
                    document.getElementById("previous-7-Days-Poem-Container").style.display = "none"
                } else if(check30Days(lastEditedDate) && document.getElementById("previous-30-Days-Poems").innerHTML == '') {
                    document.getElementById("previous-30-Days-Poem-Container").style.display = "none"
                }
                setTimeout(function() {
                    closePoem()
                }, 3000)
            }, 500)
        }, 500)

        console.log(datesPathsCreated[deleteIndex])
        firebase.database().ref("Poems/" + datesPathsCreated[deleteIndex]).once("value", function(snapshot) {
            var data = snapshot.val()
            firebase.database().ref("Poems/" + datesPathsCreated[deleteIndex]).remove()
            firebase.database().ref("Deleted_Poems/" + datesPathsCreated[deleteIndex]).set({
                "last_Updated":data.last_Updated,
                "poem_Text":data.poem_Text,
                "poem_Title":data.poem_Title,        
                "date_Created": data.date_Created
            })
        })
    } else {
        document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.transition = ".5s"
        document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.opacity = "0"

        document.getElementById("bottom-Edit-Text-Container").style.transition = ".5s"
        document.getElementById("bottom-Edit-Text-Container").style.opacity = "0"

        setTimeout(function() {
            document.getElementById("poem-Text").style.display = "none"
            document.getElementById("delete-Text").style.display = "flex"
            document.getElementById("write-Poem").style.display = "none"

            setTimeout(function() {
                document.getElementById("bottom-Edit-Text-Container").style.transition = ".5s"
                document.getElementById("bottom-Edit-Text-Container").style.opacity = "1"
                document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.transition = ".5s"
                document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.opacity = "1"
            }, 500)
        }, 500)
    }
    
    confirmDelete = true
}

function openPoem(currentIndex) {
    currentOpenedIndex = currentIndex
    document.getElementById("poem-Text").style.display = ""
    document.getElementById("delete-Text").style.display = "none"
    document.getElementById("write-Poem").style.display = "flex"
    document.getElementById("second-Visable-Bottom-Poem-Edit-Container").style.display = "none"
    document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.transition = "0s"
    document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.opacity = "1"
    document.getElementById("first-Visable-Bottom-Poem-Edit-Container").style.display = "flex"
    document.getElementById("delete-Button").setAttribute("onclick", "deletePoem('" + currentIndex + "')")
    currentIndex = (index - currentIndex) - 1

    document.getElementById("title-Of-Deleted-Poem").innerText = titles[currentIndex].innerText
    document.getElementById("poem-Title").innerText = titles[currentIndex].innerText
    document.getElementById("poem-Text").innerText = texts[currentIndex].innerText
    
    document.getElementById("bottom-Poem-Edit-Container").style.zIndex = "10"
    document.getElementById("bottom-Poem-Edit-Container").style.opacity = "3"

    document.getElementById("bottom-Poem-Edit-Container").style.transition = ".5s"
    document.getElementById("bottom-Poem-Edit-Container").style.opacity = "1"
    document.getElementById("bottom-Poem-Edit-Container").style.top = "50%"
    document.getElementById("background-Shadown").style.zIndex = "3"
    document.getElementById("background-Shadown").style.transition = ".5s"
    document.getElementById("background-Shadown").style.opacity = "1"

    setTimeout(function() {
        document.getElementById("bottom-Poem-Edit-Container").style.transition = "0s"
        document.getElementById("background-Shadown").style.transition = "0s"
    }, 500)
}

function closePoem() {
    document.getElementById("bottom-Poem-Edit-Container").style.transition = ".5s"
    document.getElementById("bottom-Poem-Edit-Container").style.opacity = "0"
    document.getElementById("background-Shadown").style.transition = ".5s"
    document.getElementById("background-Shadown").style.opacity = "0"

    setTimeout(function() {
        document.getElementById("bottom-Poem-Edit-Container").style.opacity = "0"
        document.getElementById("bottom-Poem-Edit-Container").style.transition = "0s"
        document.getElementById("background-Shadown").style.opacity = "0"
        document.getElementById("background-Shadown").style.transition = "0s"
        setTimeout(function() {        
            document.getElementById("background-Shadown").style.zIndex = "-10"
            document.getElementById("bottom-Poem-Edit-Container").style.zIndex = "-1"
        }, 200)
    }, 500)
    confirmDelete = false
}

function editPoem() {
    // currentOpenedIndex = (index - currentOpenedIndex) - 1
    openEditPoem(datesPathsCreated[datesPathsFormatted2.indexOf(datesPathsFormatted[currentOpenedIndex])])
}

function openEditPoem(filePath) {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"

    setTimeout(function() {
        window.location = "edit/?pid=" + filePath
    }, 500)
}

// Check the current orientation
// const orientation = window.orientation;

// if (orientation === 0 || orientation === 180) {
//   // Portrait orientation
//   alert('Portrait');
// } else if (orientation === 90 || orientation === -90) {
//   // Landscape orientation
//   alert('Landscape');
// }

// document.getElementById("poem-Title-Change").addEventListener("paste", checkCompletion())