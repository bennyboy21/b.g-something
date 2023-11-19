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

// Get the URL
var url = window.location;

// Create a URLSearchParams object
var params = new URLSearchParams(url.search);

// Get the values of specific parameters
var pid = params.get("pid");
var preHTML = ""
var preTitle = ""

// Log the values
console.log("pid: " + pid); // Output: param1: value1

firebase.database().ref("Poems/" + pid).once("value", function(snapshot) {
    console.log(snapshot.val())

    var poemText = snapshot.val().poem_HTML
    // var textForPoem = poemText.replace("__NEWLINE__", "<br>");
    // textForPoem = "<div>" + textForPoem + "</div>"

    document.getElementById("title-Change").value = snapshot.val().poem_Title
    document.querySelector(".textareaElement").innerHTML = poemText
    if(poemText == "") {
        document.querySelector(".textareaElement").style.padding = "15px 10px"
    }

    preHTML = document.querySelector(".textareaElement").innerHTML
    preTitle = snapshot.val().poem_Title

    setInterval(function() {
        var currentHTML = document.querySelector(".textareaElement").innerHTML
        var currentTitle =  document.getElementById("title-Change").value
        if(currentHTML != preHTML) {
            preHTML = currentHTML
            saveData()
            document.getElementById("saving-Saved-Text").textContent = "Saving..."
        } else if(currentHTML == preHTML) {
            document.getElementById("saving-Saved-Text").textContent = "Saved"
        }

        if(currentTitle != preTitle) {
            preTitle = currentTitle
            updateTitle()
            document.getElementById("saving-Saved-Text").textContent = "Saving..."
        } else if(currentTitle == preTitle) {
            document.getElementById("saving-Saved-Text").textContent = "Saved"
        }
    }, 500)
    setTimeout(function() {
        loadBody()
    }, 500)
})

function removeStylesFromHTML(htmlString) {
    // Create a DOMParser
    const parser = new DOMParser();

    // Parse the HTML string
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Traverse the DOM and remove style attributes
    function removeStyles(element) {
        element.removeAttribute('style'); // Remove style attribute from the current element

        // Recursively remove styles from child elements
        for (let i = 0; i < element.children.length; i++) {
            removeStyles(element.children[i]);
        }
    }

    // Start removing styles from the body element
    removeStyles(doc.body);

    // Serialize the modified DOM back to an HTML string
    const cleanedHTML = new XMLSerializer().serializeToString(doc);

    return cleanedHTML;
}

function cleanHTML(htmlString) {
    // Create a DOMParser
    const parser = new DOMParser();

    // Parse the HTML string
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Function to create a P element and move content to it
    function createAndMoveToP(element) {
        const pElement = doc.createElement('p');
        pElement.textContent = element.textContent;
        element.parentNode.replaceChild(pElement, element);
    }

    // Traverse the DOM and perform specific transformations
    function transformElement(element) {
        if (element.nodeName === 'DIV') {
            // Check if the first child is a text node
            if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
                // Wrap the text content in a P element
                createAndMoveToP(element.firstChild);
            }

            // Create a new P element for the other children DIVs
            const otherChildrenP = doc.createElement('p');

            // Move the remaining contents of the DIV to the new P element
            while (element.firstChild) {
                otherChildrenP.appendChild(element.firstChild);
            }

            // Replace the DIV with the new P element
            element.parentNode.replaceChild(otherChildrenP, element);
        }

        // Recursively transform child elements
        for (let i = 0; i < element.children.length; i++) {
            transformElement(element.children[i]);
        }
    }

    // Transform the body element
    transformElement(doc.body);

    // Serialize the modified DOM back to an HTML string
    const transformedHTML = new XMLSerializer().serializeToString(doc);

    return transformedHTML;
}

function updateTitle() {
    firebase.database().ref("Poems/" + pid).update({
        "poem_Title": preTitle,
    })
}

function saveData() {
    var textElement = document.querySelector(".textareaElement")
    var textarea = textElement;

    var string = removeStylesFromHTML(String(textarea.innerHTML))
    if(string.slice(0, 3) != "<p>") {
        if(string.indexOf("<p>") != -1) {
            var firstText = string.slice(0, string.indexOf("<p>"))
            string = "<p>" + firstText + "</p>" + string.slice(string.indexOf("<p>"), string.length)
        } else {
            var firstText = string.slice(string.indexOf("<body>"), string.indexOf("</body>"))
            string = string.slice(0, string.indexOf("<body>")) + "<p>" + firstText + "</p></body></html>"
        }
        // <p><html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>jadhclkdsjhclkasjdhclkjshdlckjh</body></html</p>>
    } else if(string.length < 3) {
        string += "<p></p>"
    }

    firebase.database().ref("Poems/" + pid).update({
        "poem_Text": textarea.textContent,
        "poem_HTML": cleanHTML(string),
        "last_Updated": String(new Date())
    })
}

function loadBody() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "1"
    
    setTimeout(function() {
        document.querySelector("body").style.transition = "0"
    })
}

function goHome() {
    document.querySelector("body").style.transition = ".5s"
    document.querySelector("body").style.opacity = "0"

    setTimeout(function() {
        window.location = "../"
    })
}