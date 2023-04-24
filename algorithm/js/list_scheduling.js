function findMinimunIndex(array) {
  let min = array[0];
  let minIndex = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] < array[minIndex]) {
      min = array[i];
      minIndex = i;
    }
  }

  return minIndex;
}

function listScheduling(tasks, n_workers, n_tasks) {
  var workers = Array(n_workers).fill([]);
  var current_time_workers = Array(n_workers).fill(0);

  for (let i = 0; i < n_workers; i++) {
    workers[i] = Array(n_tasks).fill(0);
  }

  for (var i = n_tasks - 1; i >= 0; i--) {
    var minimunIndex = findMinimunIndex(current_time_workers);
    current_time_workers[minimunIndex] += tasks[i];
    const tasksIndex = findMinimunIndex(workers[minimunIndex]);
    workers[minimunIndex][tasksIndex] = tasks[i];
  }

  return workers;
}

module.exports = listScheduling;
