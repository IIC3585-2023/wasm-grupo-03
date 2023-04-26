const fs = require('fs');
const mergeSort = require('./mergesort');
const listScheduling = require('./list_scheduling')

fs.readFile('./input.txt', (err, inputD) => {
  if (err) throw err;
  const input = inputD.toString().split('\n')
  const n_workers = parseInt(input[0])
  const n_tasks = parseInt(input[1])
  let tasks = []
  for (let i = 0; i < n_tasks; i++) {
    tasks.push(parseInt(input[i + 2]))
  }
  mergeSort(tasks, 0, tasks.length - 1)

  const workersAssigned = listScheduling(tasks, n_workers, n_tasks);
})