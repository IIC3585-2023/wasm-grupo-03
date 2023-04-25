const TASKS = {
  'Fácil': 1500,
  'Medio': 20000,
  'Difícil': 100000
}
const WORKERS = 3

Module.onRuntimeInitialized = () => {
  console.log('Runing WASM...')
  document.getElementById('run-wasm').onclick = () => {
    const n_workers = WORKERS;
    const n_tasks = 10;
    const tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const tasksArray = Uint32Array.from(tasks);

    const startTime = performance.now();
    const taskArrayPtr = Module._malloc(tasksArray.byteLength);
    Module.HEAPU32.set(tasksArray, taskArrayPtr>>2);
    const workersPtr = Module.ccall(
      'listScheduling',
      'number',
      ['number', 'number', 'number'],
      [taskArrayPtr, n_workers, n_tasks]);

    const workersAssigned = new Uint32Array(Module.HEAPU32.buffer, workersPtr, offsetResult(n_workers, n_tasks));

    const workersAssignedFiltered = filterWorkersAssigned(workersAssigned, n_workers, n_tasks);

    const resultWorkersAssigned = extractResult(workersAssignedFiltered, n_workers, n_tasks);
    const endTime = performance.now();
    console.log('Wasm Time:', endTime - startTime);
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

document.getElementById('run-js').onclick = () => {
  console.log('Runing JS...')
  const level = document.getElementById('level');
  const n_workers = WORKERS;
  const n_tasks = TASKS[level.value];
  const tasks = [];
  for (let i = 0; i < n_tasks; i++) {
    tasks.push(Math.floor(Math.random() * 150) + 1);
  }
  const startTime = performance.now();

  mergeSort(tasks, 0, tasks.length - 1)
  const workersAssigned = listScheduling(tasks, n_workers, n_tasks);
  const endTime = performance.now();
  console.log({ workersAssigned })
  console.log('Js Time:', endTime - startTime);
}
