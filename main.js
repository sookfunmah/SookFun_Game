const brands = [
  {
    iconName: "hippo",
    Name: "Hippo",
    color: "#ff0000",
  },
  {
    iconName: "frog",
    Name: "Frog",
    color: "#fd5c63",
  },
  {
    iconName: "fish",
    Name: "Fish",
    color: "#FfA500",
  },
  {
    iconName: "spider",
    Name: "Spider",
    color: "#a4c639",
  },
  {
    iconName: "kiwi-bird",
    Name: "Kiwi-bird",
    color: "#990033",
  },
  {
    iconName: "horse",
    Name: "Horse",
    color: "#b52e31",
  },
  {
    iconName: "crow",
    Name: "Crow",
    color: "#663399",
  },
  {
    iconName: "cat",
    Name: "Cat",
    color: "#FFD700",
  },
  {
    iconName: "dove",
    Name: "Dove",
    color: "#0000ff",
  },
  {
    iconName: "dragon",
    Name: "Dragon",
    color: "#d4af37",
  },
  {
    iconName: "dog",
    Name: "Dog",
    color: "#Bb00bb",
  },
  {
    iconName: "bug",
    Name: "Bug",
    color: " #39ff14",
  },
];

let correct = 0;
let total = 0;
const totalDragItems = 5;
const totalDropBoxes = 5;

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const playAgainBtn = scoreSection.querySelector("#play-again-btn");

const dragItemsDisplay = document.querySelector(".drag-items");
const dropBoxesDisplay = document.querySelector(".drop-boxes");


const displayNote = document.querySelector("#notificationText")


let dragElements;
let dropElements;

InitiateGame();

function InitiateGame() {
  //generate the drag icons
  const randomDragIcons = genRandomArrayIcon(totalDragItems, brands);
  console.log(randomDragIcons);

  //generate the drop boxes(text) from the generated Drag Icon. Drop-boxes must be <= than drag Icon
  let randomDropBoxes;
  if (totalDropBoxes < totalDragItems) {
    randomDropBoxes = genRandomArrayIcon(totalDropBoxes, randomDragIcons);
  } else {
    randomDropBoxes = randomDragIcons;
  }

  //sort the random drop boxes and
  const sortRandomDropBoxes = [...randomDropBoxes].sort((a, b) =>
    a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
  );

  // Append and display the drag icon into DOM
  dragItemsDisplay.innerHTML = ''
  for (i = 0; i < randomDragIcons.length; i++) {
    const iconHTML = `
    <i class = "fas fa-${randomDragIcons[i].iconName} draggable" draggable ="true"
    style = "Color : ${randomDragIcons[i].color}"
    id = "${randomDragIcons[i].iconName}"></i>`;
    dragItemsDisplay.innerHTML += iconHTML;
  }

  //Append drop boxes into the DOM 
  for (let i = 0; i < sortRandomDropBoxes.length; i++) {
    dropBoxesDisplay.insertAdjacentHTML("afterbegin", // start putting from top of the dottted box
  `<div class = "drop-boxes">
    <span class = "label" > ${sortRandomDropBoxes[i].Name}</span>
    <span class = "droppable" data-icon = "${sortRandomDropBoxes[i].iconName}"></span>
  </div>`
    )
  }

  //point to CSS properties
  dragElem = document.querySelectorAll(".draggable");
  dropElem = document.querySelectorAll(".droppable");

  //Add Event listener dragstart for each drag icon and calls function dragStart when dragstart event occurs.
  dragElem.forEach((elem) => {
    elem.addEventListener("dragstart", dragStart);
  });

  dropElem.forEach((elem) => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
  });
}

//Events fired on the drop boxes
//gets data  of icon's id when user start dragging in text format
//e stands for event
function dragStart(e){
  e.dataTransfer.setData("text",e.target.id)
}

//calls for CSS properties "droppable-hover" when icon is dragged into the box
function dragEnter(e){
  if(e.target.classList && e.target.classList.contains("droppable") &&!e.target.classList.contains("dropped")){
  e.target.classList.add("droppable-hover")
  
  }
}

//remove the default control of dragOver
function dragOver(e){
  if(e.target.classList && e.target.classList.contains("droppable") && !e.target.classList.contains("dropped")){
    e.preventDefault()
  }
}

//remove "droppable-hover" when icon leaves box
function dragLeave(e){
  if(e.target.classList && e.target.classList.contains("droppable") && !e.target.classList.contains("dropped")){
    e.target.classList.remove("droppable-hover")
  }
}




function drop(e){
  e.preventDefault()
  e.target.classList.remove("droppable-hover")
  const dragElemName = e.dataTransfer.getData("text")
  const dropElemName = e.target.getAttribute("data-icon")

  const correctMatch = dragElemName === dropElemName
  
  total++
  console.log(total)

  if (correctMatch){
      const dragElementCheck = document.getElementById(dragElemName)
      console.log("drop"+dropElemName)
      console.log("drag"+dragElemName)
      e.target.classList.add("dropped")
      dragElementCheck.classList.add("dragged")
      dragElementCheck.setAttribute("draggable","false")
      e.target.innerHTML = `<i class = "fas fa-${dragElemName}" style = "color:${dragElementCheck.style.color}"></i>`
     
      correct++
      console.log(correct)
      audio.src = "./audio/win.wav"
      audio.addEventListener("loadeddata", ()=>{ 
        audio.play()
  })
  } else if (!correctMatch) {
    audio.src = "./audio/error.mp3"
    audio.addEventListener("loadeddata", ()=>{ 
    audio.play()
    })
}
  

 

  scoreSection.style.opacity = 0 ;
  setTimeout(()=>{
    correctSpan.innerHTML = correct;
    totalSpan.innerHTML = total;
    scoreSection.style.opacity = 1;
  },100)

  if(correct === Math.min(totalDropBoxes,totalDragItems)){
    if(correct === total){
      
      displayNote.innerHTML= "You Win!"
      //Play the success song
      audio.src = "./audio/success-trumpet.mp3"
      audio.addEventListener("loadeddata", ()=>{ 
      audio.play()
    })
    }

    if(total > correct){
      displayNote.innerHTML= "Too Bad!  So Sad!  You Lose!"
      audio.src = "./audio/fail.wav"
      audio.addEventListener("loadeddata", ()=>{ 
      audio.play()
    })
    }
      
    playAgainBtn.style.display = "block"
    setTimeout(()=>{
      playAgainBtn.classList.add("play-again-btn-entrance")
    },400)

  }
}

//Function when user clicks the button
playAgainBtn.addEventListener('click', playAgainBtnClik)
const audio = new Audio()  

function playAgainBtnClik(){
  console.log("button clicked")

  //Sound effect upon clicking button
  audio.src = "./audio/place.wav"
  audio.addEventListener("loadeddata", ()=>{ 
    audio.play()
  })
  console.log("Audio file path:" , audio.src)


  playAgainBtn.classList.remove("play-again-btn-entrance");
  correct = 0;
  total = 0;
  dragItemsDisplay.style.opacity = 0 ;
  dropBoxesDisplay.style.opacity = 0;

 

  setTimeout(()=>{
    scoreSection.style.opacity = 0;
  },100)

  setTimeout(()=>{
    playAgainBtn.style.display = "none"
    location.reload()
  },1000)

}

//function to randomly generate the array

function genRandomArrayIcon(n, originalArray) {
  let dummy = [];
  let clonedArray = [...originalArray];

  for (i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    dummy.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return dummy;
}

//Background music playing with pulsing button
let theSong = document.getElementById("theSong")
let theSongBtn = document.getElementById("theSongBtn")

theSongBtn.onclick = function(){
  if(theSong.paused){
    theSong.play()
    theSongBtn.innerHTML= "Pause 🔇"
    theSongBtn.classList.add("playing"); // Add playing class for animation
    theSong.volume = 0.1
  } 
  else { 
    theSong.pause()
    theSongBtn.innerHTML= "PLay ♫"
    theSongBtn.classList.remove("playing"); // Remove playing class
  }
  
}

