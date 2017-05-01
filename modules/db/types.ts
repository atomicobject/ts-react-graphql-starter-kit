///
/// This file should contain TS type definitions for DB table types.
///

export type TaskRecord = {
  taskId: number,
  taskEmpId: number,
  taskProjId: number,
  taskStart: number,
  taskStop: number,
  taskNotes: string,
  taskStoryId: number | undefined,
  taskDate: Date
}