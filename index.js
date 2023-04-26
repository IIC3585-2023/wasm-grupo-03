const TASKS = {
  'Super Fácil': 100,
  'Fácil': 1500,
  'Medio': 8000,
  'Difícil': 15000
}
const WORKERS = 20;
const jsLoading = document.getElementById('js-loading-icon');
const jsTime = document.getElementById('js-time');
const wasmLoading = document.getElementById('wasm-loading-icon');
const wasmTime = document.getElementById('wasm-time');

// WASM Module //

Module.onRuntimeInitialized = () => {
  document.getElementById('run-wasm').onclick = () => {
    wasmTime.style.display = "none";
    const { tasks, n_workers, n_tasks } = buildInitialWorkersTasks();
    
    const tasksArray = Uint32Array.from(tasks);

    const taskArrayPtr = Module._malloc(tasksArray.byteLength);
    Module.HEAPU32.set(tasksArray, taskArrayPtr>>2);

    let workersPtr;
    wasmTime.style.display = "none";
    wasmLoading.style.display = "flex";
    setTimeout( () => {
      const startTime = performance.now();
      workersPtr = Module.ccall(
        'listScheduling',
        'number',
        ['number', 'number', 'number'],
        [taskArrayPtr, n_workers, n_tasks]);

      const endTime = performance.now();
      
      const workersAssigned = new Uint32Array(Module.HEAPU32.buffer, workersPtr, offsetResult(n_workers, n_tasks));
      const workersAssignedFiltered = filterWorkersAssigned(workersAssigned, n_workers, n_tasks);
      const resultWorkersAssigned = extractResult(workersAssignedFiltered, n_workers, n_tasks);
      addWorkersAssignment(resultWorkersAssigned);
      
      Module._free(taskArrayPtr);
      
      wasmTime.children[0].children[0].innerHTML = `${Math.round((endTime - startTime) * 100) / 100} ms`;
      wasmLoading.style.display = "none";
      wasmTime.style.display = "flex";
    }, 0)
  }
}

function offsetResult(n_workers, n_tasks) {
  return offsetCurrentTime(n_workers) + n_workers * (offsetAssignedWorkers(n_tasks));
}

function offsetParticularWorker(n_workers, n_tasks, i) {
  return i * (offsetAssignedWorkers(n_tasks)) + offsetCurrentTime(n_workers);
}

function filterWorkersAssigned(workersArray, n_workers, n_tasks) {
  const workersArrayFiltered = new Array(n_workers);
  for (let i = 0; i < n_workers; i++) {
    workersArrayFiltered[i] = new Uint32Array(workersArray.slice(offsetParticularWorker(n_workers, n_tasks, i), offsetParticularWorker(n_workers, n_tasks, i) + n_tasks));
  }

  return workersArrayFiltered;
}

function offsetCurrentTime(n_workers) {
  if (n_workers % 2 === 0) {
    return n_workers + 2;
  }
  return n_workers + 1;
}

function offsetAssignedWorkers(n_tasks) {
  if (n_tasks % 2 === 0) {
    return n_tasks + 2;
  }
  return n_tasks + 1;
}

function extractResult(workersAssigned, n_workers, n_tasks) {
  var resultArray = [];

  for (var i = 0; i < n_workers; i++) {
    resultArray.push([]);
  }

  for (let i = 0; i < n_workers; i++) {
    for (let j = 0; j < n_tasks; j++) {
      if (workersAssigned[i][j] !== 0)
        resultArray[i].push(workersAssigned[i][j]);
    }
  }
  return resultArray;
}

function buildInitialWorkersTasks() {
  const n_workers = WORKERS;
  const level = document.getElementById('level');
  const n_tasks = TASKS[level.value];
  const tasks = [];

  for (let i = 0; i < n_tasks; i++) {
    tasks.push(Math.floor(Math.random() * 20000) + 1);
  }

  return {tasks, n_workers, n_tasks};
}

async function runScheduling(tasks, n_workers, n_tasks) {
  const startTime = performance.now();
  mergeSort(tasks, 0, tasks.length - 1);
  const workersAssigned = listScheduling(tasks, n_workers, n_tasks);
  const endTime = performance.now();
  return {time: endTime - startTime, workersAssigned: workersAssigned};
}

function addWorkersToDOM() {
  for (let i = 0; i < 20; i++) {
    const workerRow = document.createElement('div');
    workerRow.setAttribute('id', `worker-row-${i}`);
    workerRow.classList.add('flex', 'p-1', 'bg-gray-100', 'rounded-lg', 'max-w-7xl', 'overflow-x-scroll', 'gap-2');
  
    const workerNumber = document.createElement('p');
    workerNumber.classList.add('bg-purple-600', 'py-1', 'px-3', 'rounded-lg', 'text-white', 'text-lg');
    workerNumber.innerHTML = `${i + 1}`;
    workerRow.appendChild(workerNumber);
    document.getElementById('assignment').appendChild(workerRow);
  }
}

function addWorkersAssignment(resultWorkers) {
  const oldTasksElements = document.getElementsByClassName("task") || [];
  const tasksLength = oldTasksElements.length;
  for (let i = 0; i < tasksLength; i++) {
    oldTasksElements[0].remove();
  }

  for (let i = 0; i < resultWorkers.length; i++) {
    const worker = resultWorkers[i];
    for (let j = 0; j < worker.length; j++) {
      const element = worker[j];
      if (element !== 0) {
        const workerRow = document.getElementById(`worker-row-${i}`);
        const task = document.createElement('p');
        task.classList.add('bg-gray-800', 'py-1', 'px-3', 'rounded-full', 'text-white', 'text-lg', 'task');
        task.innerHTML = `${element}`;
        workerRow.appendChild(task);
      }
    }
  }
}

document.getElementById('run-js').onclick = async () => {
  const {tasks, n_workers, n_tasks} = buildInitialWorkersTasks();
  jsLoading.style.display = "flex";
  jsTime.style.display = "none";
  setTimeout( () => {
    runScheduling(tasks, n_workers, n_tasks).then(({time, workersAssigned}) => {
      jsLoading.style.display = "none";
      jsTime.children[0].children[0].innerHTML = `${Math.round(time * 100) / 100} ms`;
      jsTime.style.display = "flex";
      addWorkersAssignment(workersAssigned);
    });
  }, 0)
}

document.getElementById('level').onchange = (e) => document.getElementById('tasks').innerHTML = TASKS[level.value];

addWorkersToDOM();