#include <stdio.h>
#include <stdlib.h>
#include "mergesort.h"
#include "list_scheduling.h"

int main()
{
  int n_workers;
  int n_tasks;

  FILE *fptr;

  fptr = fopen("../../input.txt", "r");

  if(fptr == NULL)
  {
    printf("Error!");   
    exit(1);             
  }

  fscanf(fptr, "%d",&n_workers);
  fscanf(fptr, "%d",&n_tasks);

  printf("%d\n",n_workers);
  printf("%d\n",n_tasks);

  int* tasks = calloc(n_tasks, sizeof(int));

  for (int j = 0; j < n_tasks; j++)
  {
    fscanf(fptr, "%d", &tasks[j]);
  }

  mergeSort(tasks, 0, n_tasks - 1);

  // int** workers = calloc(n_workers, sizeof(int*));

  int** workersAssigned = listScheduling(tasks, n_workers, n_tasks);

  //print array of arrays
  for (int i = 0; i < n_workers; i++)
  {
    for (int j = 0; j < n_tasks; j++)
    {
      printf("%d ", workersAssigned[i][j]);
    }
    printf("\n");
  }
  
  // close file
  fclose(fptr);
  free(tasks);

  for (int i = 0; i < n_workers; i++)
  {
    free(workersAssigned[i]);
  }
  free(workersAssigned);
  return 0;
}