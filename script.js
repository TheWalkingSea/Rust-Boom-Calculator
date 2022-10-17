'use strict'

const inps = document.querySelectorAll(".inputs .resource input");
const outp = document.querySelectorAll(".outputs .resource .toolitip--container p .totalamt");
const outpcontainer = document.querySelectorAll(".outputs .resource .toolitip--container");
const outptags = document.querySelectorAll(".outputs .resource .toolitip--container .totalamt");
const rocket = {
    "pipe": 2,
    "gunpowder": 150,
    "explosive": 10,
    "elem": document.getElementsByName("rocket")[0]
}
const c4 = {
    "explosive": 20,
    "cloth": 5,
    "techtrash": 2,
    "elem": document.getElementsByName("c4")[0]
}
const explo = {
    "metalfrags": 10,
    "gunpowder": 20,
    "sulfur": 10,
    "elem": document.getElementsByName("explo")[0]
}
const satchel = {
    "rope": 1,
    "cloth": 10,
    "gunpowder": 240,
    "metalfrags": 80,
    "elem": document.getElementsByName("satchel")[0]
}

let autoboom = true; // toggle switch on screen

function setOutput(resource, totalcost) {
    outp.forEach((elem) => {
        elem.innerHTML = totalcost[elem.id] ? resource[elem.id] - totalcost[elem.id]: resource[elem.id];
    })
    
    // Add toolitips
    outpcontainer[5].firstElementChild.lastElementChild.innerHTML = parseInt(c4.elem.value)*20; // Explosives
    outpcontainer[6].firstElementChild.firstElementChild.innerHTML = parseInt(c4.elem.value)*2; // Tech Trash
    outpcontainer[8].firstElementChild.firstElementChild.innerHTML = parseInt(c4.elem.value)*5; // Cloth
    outpcontainer[5].firstElementChild.firstElementChild.innerHTML = parseInt(rocket.elem.value)*10; // Explosives
    outpcontainer[4].firstElementChild.firstElementChild.innerHTML = parseInt(rocket.elem.value)*2; //Pipes
    if (parseInt(satchel.elem.value) > 0) {
        // console.log("eeee")
        outpcontainer[0].firstElementChild.lastElementChild.innerHTML = parseInt(satchel.elem.value)*60*4;
        outpcontainer[3].firstElementChild.lastElementChild.innerHTML = parseInt(satchel.elem.value)*20*4;
        outpcontainer[8].firstElementChild.lastElementChild.innerHTML = parseInt(satchel.elem.value)*10;
        outpcontainer[10].firstElementChild.firstElementChild.innerHTML = parseInt(satchel.elem.value)*1;
    }
    
    let explosive = parseInt(outp[5].innerHTML)
    if (explosive < 0) { // Breaks down Explosives
        outp[0].innerHTML = parseInt(outp[0].innerHTML) + 50*explosive; // Gunpowder
        outp[9].innerHTML = parseInt(outp[9].innerHTML) + 3*explosive; // Low Grade
        outp[1].innerHTML = parseInt(outp[1].innerHTML) + 10*explosive; // Sulfur
        outp[3].innerHTML = parseInt(outp[3].innerHTML) + 10*explosive; // Frags
        outpcontainer[0].firstElementChild.firstElementChild.innerHTML = -explosive*50;
        outpcontainer[9].firstElementChild.firstElementChild.innerHTML = -explosive*3;
        outpcontainer[1].firstElementChild.firstElementChild.innerHTML = -explosive*10;
        outpcontainer[3].firstElementChild.firstElementChild.innerHTML = -explosive*10;
        
    }
    const elements = [...outp].map((e)=>(parseInt(e.innerHTML))) // Converts element => inner html => number
    if (elements[0] < 0) { // Sulfur => sulfure ore + charcoal
        let material = -elements[0]*2; // calc sulf and charcoal needed respectively
        // console.log(material)
        // outp[0].innerHTML = 0; // Reset since we are editing other values to make up for gunpowder
        // Makes the conversions
        outp[7].innerHTML = material;
        outp[1].innerHTML = elements[1] - material;
        outpcontainer[1].firstElementChild.firstElementChild.innerHTML = material; // Sulf
        outpcontainer[7].firstElementChild.firstElementChild.innerHTML = material; // Char
        // outp[1].innerHTML = 0;
        outp[2].innerHTML = elements[7] + (elements[1] - material);
        outpcontainer[2].firstElementChild.firstElementChild.innerHTML = material;
            
    }

}

function estimateRockets(resources, totalcost) {
    let rockets = -1; // Dont ask why its -1, it works and idk why
    while (true) {   
        for (let obj in totalcost) {
            if (resources[obj]) {
                if (!((resources[obj] - totalcost[obj]) >= 0)) {
                    console.log(rockets)
                    totalcost["pipe"] -= 2; // Sets back a rocket
                    totalcost["explosive"] -= 10; // Sets back a rocket
                    totalcost["gunpowder"] -= 150; // Sets back a rocket
                    return { "newcost": totalcost, 
                        "a": rockets === -1 ? 0 : rockets };
                } else {
                    if (rocket[obj]) {
                        totalcost[obj] += rocket[obj];
                    }
                }
            }
            else {
                return { "newcost": totalcost, "a": 0 };
            }
            
        }
        ++rockets;
    }}

function getboom(autocompleterockets=false) {
    let resources = {}
    let totalcost = {"pipe": 0, "gunpowder": 0, "explosive": 0} // Sets default values to find the estimated amt of rockets
    inps.forEach((elem) => {
        resources[elem.name] = elem.value;
    })
    if (explo.elem.value !== "0") {
        for (const item in explo) {
            if (typeof(explo[item]) === "number") {
                if (totalcost[item]) {
                    totalcost[item] += explo[item]*parseInt(explo.elem.value);
                } else {
                    totalcost[item] = explo[item]*parseInt(explo.elem.value);
                }
                
            }
        }
    }
    if (c4.elem.value !== "0") {
        for (const item in c4) {
            if (typeof(c4[item]) === "number") {
                if (totalcost[item]) {
                    totalcost[item] += c4[item]*parseInt(c4.elem.value);
                } else {
                    totalcost[item] = c4[item]*parseInt(c4.elem.value);
                }
                
            }
        }
    }
    if (satchel.elem.value !== "0") {
        for (const item in satchel) {
            if (typeof(satchel[item]) === "number") {
                if (totalcost[item]) {
                    totalcost[item] += satchel[item]*parseInt(satchel.elem.value);
                } else {
                    totalcost[item] = satchel[item]*parseInt(satchel.elem.value);
                }
                
            }
        }
    }
    let newcost = totalcost;
    let a;
    if (autoboom) {
        ({ newcost, a } = estimateRockets(resources, totalcost));
        rocket.elem.value = a;
    } else {
        if (rocket.elem.value !== "0") {
            for (const item in rocket) {
                if (typeof(rocket[item]) === "number") {
                    if (newcost[item]) {
                        newcost[item] += rocket[item]*parseInt(rocket.elem.value);
                    } else {
                        newcost[item] = rocket[item]*parseInt(rocket.elem.value);
                    }
                    
                }
            }
        }

    }
    // if (a >= parseInt(rocket.elem.value)) {
    //     rocket.elem.value = a;
    // }
    // console.log(newcost)
    setOutput(resources, newcost);
}


for (let inp of inps) {
    inp.addEventListener("input", (event) => {
        getboom(true)
    })
}
for (let boom of document.querySelectorAll(".boomsel div input")) {
    boom.addEventListener("input", (event) => {
        getboom()
    })
}
const dis = document.getElementById("dis");
dis.addEventListener("click", () => {
    autoboom = !autoboom
    dis.innerHTML = autoboom ?  "Disable autocraft " : "Enable autocraft"
    dis.classList.add(autoboom ? "enabled" : "disabled")
    dis.classList.remove(autoboom ? "disabled" : "enabled");
    getboom();
});
