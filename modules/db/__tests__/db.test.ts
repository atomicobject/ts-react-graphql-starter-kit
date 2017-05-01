import * as db from '..';
import * as config from 'config'

import {TaskRecord} from '../types';

describe('the database connection', () => {
  afterAll(() => {
    db.destroyConnection();
  });

  it('is configured by the environment', () => {
    expect(config.get('environment')).toEqual('test')
    expect(config.get('databaseUrl')).toMatch(/^postgres:/)
  });
  
  it('does something', async () => {
    const conn = db.getConnection();
    const taskInfo: TaskRecord = await conn
      .table("task")
      .where("taskId", 22)
      .select('*')
      .first();

    expect(taskInfo.taskStart).toEqual(9.5);
    expect(taskInfo.taskStart).toEqual(9.5);
    expect(taskInfo.taskEmpId).toEqual(1);
    expect(taskInfo.taskProjId).toEqual(1);
    expect(taskInfo.taskDate).toEqual(new Date(2003, 5, 25));
    expect(taskInfo.taskNotes).toEqual("PunchIt");
    expect(taskInfo.taskStoryId).toEqual(486);
  })
});