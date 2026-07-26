/*========================
  LOGIN
========================*/
function login(){
const u=document.getElementById("username");
const p=document.getElementById("password");
const m=document.getElementById("msg");
if(!u||!p)return;

if(u.value.trim()=="Bhoomi"&&p.value.trim()=="1234"){
m.style.color="#22c55e";
m.innerHTML="Login Successful ✓";
setTimeout(()=>location.href="dashboard.html",800);
}else{
m.style.color="#ef4444";
m.innerHTML="Invalid Username or Password";
}
}

/*========================
  LOGOUT
========================*/
function logout(){
location.href="login.html";
}

/*========================
  THEME
========================*/
function toggleTheme(){
document.body.classList.toggle("light");
localStorage.setItem("theme",
document.body.classList.contains("light")?"light":"dark");
updateThemeIcon();
}

function updateThemeIcon(){
const i=document.querySelector(".theme-btn i")||document.querySelector("#themeBtn i");
if(!i)return;
i.className=document.body.classList.contains("light")
?"fa-solid fa-sun"
:"fa-solid fa-moon";
}

/*========================
  CLOCK
========================*/
function liveClock(){
const c=document.getElementById("clock");
if(!c)return;

setInterval(()=>{
const d=new Date();
c.innerHTML=d.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit',
second:'2-digit'
});
},1000);
}

/*========================
  STORAGE
========================*/
let planner=JSON.parse(localStorage.getItem("planner"))||[];
let tasks=JSON.parse(localStorage.getItem("tasks"))||[];
let diet=JSON.parse(localStorage.getItem("diet"))||[];

/*========================
  PLANNER
========================*/
function addPlan(){

const t=document.getElementById("planTime");
const a=document.getElementById("planTask");

if(!t||!a)return;

if(t.value==""||a.value.trim()=="")return;

planner.push({
time:t.value,
task:a.value
});

localStorage.setItem("planner",JSON.stringify(planner));

t.value="";
a.value="";

renderPlanner();
updateCards();

}

function deletePlan(i){

planner.splice(i,1);

localStorage.setItem("planner",JSON.stringify(planner));

renderPlanner();
updateCards();

}

function renderPlanner(){

const box=document.getElementById("planList");

if(!box)return;

box.innerHTML="";

planner.forEach((p,i)=>{

box.innerHTML+=`
<p>
🕒 <b>${p.time}</b> - ${p.task}
<button onclick="deletePlan(${i})">Delete</button>
</p>
`;

});

}

/*========================
  TASKS
========================*/
function addTask(){

const t=document.getElementById("taskInput");

if(!t)return;

let value=t.value.trim();

if(value=="")return;

tasks.push({
text:value,
done:false
});

localStorage.setItem("tasks",JSON.stringify(tasks));

t.value="";

renderTasks();
updateCards();

}

function toggleTask(i){

tasks[i].done=!tasks[i].done;

localStorage.setItem("tasks",JSON.stringify(tasks));

renderTasks();
updateCards();

}

function deleteTask(i){

tasks.splice(i,1);

localStorage.setItem("tasks",JSON.stringify(tasks));

renderTasks();
updateCards();

}

function renderTasks(){

const box=document.getElementById("taskList");

if(!box)return;

box.innerHTML="";

tasks.forEach((t,i)=>{

box.innerHTML+=`
<p>

<input
type="checkbox"
${t.done?"checked":""}
onchange="toggleTask(${i})">

<span style="text-decoration:${t.done?"line-through":"none"}">

${t.text}

</span>

<button onclick="deleteTask(${i})">

Delete

</button>

</p>
`;

});

}

/*========================
  DASHBOARD CARDS
========================*/
function updateCards(){

const task=document.getElementById("taskCount");
const meal=document.getElementById("mealCount");
const plan=document.getElementById("planCount");
const streak=document.getElementById("streakCount");

if(task)task.innerHTML=tasks.length;

if(meal)meal.innerHTML=diet.length;

if(plan)plan.innerHTML=planner.length;

if(streak){

let completed=tasks.filter(t=>t.done).length;

streak.innerHTML=completed;

}

}

/*========================
  DIET TRACKER
========================*/
function addMeal(){
const m=document.getElementById("meal");
const c=document.getElementById("calories");
if(!m||!c)return;

let meal=m.value.trim();
let cal=c.value.trim();

if(meal==""||cal=="")return;

diet.push({
meal:meal,
calories:Number(cal)
});

localStorage.setItem("diet",JSON.stringify(diet));

m.value="";
c.value="";

renderDiet();
updateCards();
updateChart();
}

function deleteMeal(i){
diet.splice(i,1);
localStorage.setItem("diet",JSON.stringify(diet));
renderDiet();
updateCards();
updateChart();
}

function renderDiet(){

const box=document.getElementById("dietList");
if(!box)return;

box.innerHTML="";

diet.forEach((d,i)=>{

box.innerHTML+=`
<p>
🍎 <b>${d.meal}</b>

<span style="float:right">${d.calories} kcal</span>

<button onclick="deleteMeal(${i})">Delete</button>
</p>
`;

});

}

/*========================
  POMODORO TIMER
========================*/
let timer;
let total=1500;

function updateTimer(){

const min=Math.floor(total/60);
const sec=total%60;

const t=document.getElementById("time");

if(t)
t.innerHTML=
`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}

function startTimer(){

if(timer)return;

timer=setInterval(()=>{

if(total>0){

total--;

updateTimer();

}else{

clearInterval(timer);

timer=null;

alert("🎉 Pomodoro Completed!");

}

},1000);

}

function resetTimer(){

clearInterval(timer);

timer=null;

total=1500;

updateTimer();

}


new Chart(document.getElementById("studyChart"), {
    type: 'bar',
    data: {
        labels: ['Mon','Tue','Wed','Thu','Fri'],
        datasets: [{
            label: 'Study Hours',
            data: [2,4,3,5,6]
        }]
    }
});

/*========================
  ANALYTICS
========================*/
let chart;

function updateChart(){

const canvas=document.getElementById("chart");

if(!canvas)return;

if(chart) chart.destroy();

chart=new Chart(canvas,{

  type: "bar",
  data: {
    labels: ["Planner", "Tasks", "Diet"],
    datasets: [{
      label: "StudySync",
      data: [planner.length, tasks.length, diet.length],
      backgroundColor: ["#60a5fa", "#34d399", "#f97316"],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }

});

}

/*========================
  CLEAR DATA
========================*/
function clearData(){

if(!confirm("Delete all saved data?")) return;

planner=[];
tasks=[];
diet=[];

localStorage.removeItem("planner");
localStorage.removeItem("tasks");
localStorage.removeItem("diet");

renderPlanner();
renderTasks();
renderDiet();

updateCards();
updateChart();

}

/*========================
  PAGE LOAD (FINAL)
========================*/
window.onload=()=>{

if(localStorage.getItem("theme")=="light")
document.body.classList.add("light");

updateThemeIcon();

renderPlanner();
renderTasks();
renderDiet();

updateCards();

liveClock();

updateTimer();

updateChart();

};