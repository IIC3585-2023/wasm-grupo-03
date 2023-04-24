console.log('Index.js working...')

Module.onRuntimeInitialized = () => {
  const { listScheduling, sum } = Module;
  console.log("listScheduling", { listScheduling })
  console.log("sum", { sum })

  console.log('Module is ready');
  const n_workers = 4;
  const n_tasks = 5;
  const tasks = [1, 2, 3, 4, 5];
  const workersAssigned = listScheduling(tasks, n_workers, n_tasks);
  console.log(workersAssigned);
};
