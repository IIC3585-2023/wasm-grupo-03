#include <stdlib.h>
#include "mergesort.h"

int findMinimunIndex(int* array, int lenArray)
{
  int min = array[0];
  int index = 0;
  for (int i = 1; i < lenArray; i++)
  {
    if (array[i] < min)
    {
      min = array[i];
      index = i;
    }
  }

  return index;
}

int** listScheduling(int* tasks, int n_workers, int n_tasks)
{
  int* current_time_workers = calloc(n_workers, sizeof(int));
  int** workers = calloc(n_workers, sizeof(int*));
  mergeSort(tasks, 0, n_tasks - 1);
  for (int i = 0; i < n_workers; i++)
  {
    workers[i] = calloc(n_tasks, sizeof(int));
  }
  
  for (int i = n_tasks - 1; i >= 0; i--)
  {
    int minimunIndex = findMinimunIndex(current_time_workers, n_workers);
    current_time_workers[minimunIndex] += tasks[i];
    int taskIndex = findMinimunIndex(workers[minimunIndex], n_tasks);
    workers[minimunIndex][taskIndex] = tasks[i];
  }
  free(current_time_workers);

  return workers;
}
