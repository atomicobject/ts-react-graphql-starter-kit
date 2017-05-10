import * as db from '../../db';

import {UserRepository} from '../user';

describe('UserRepository', () => {
  let connection: db.Knex;
  let target : UserRepository;

  beforeAll(() => {
    connection = db.getConnection();
    target = new UserRepository(connection);
  });

  afterAll(() => {
    db.destroyConnection();
  });

  it('can find insert and users', async () => {
    const inserted = await target.insert({
      name: "Joe",
      email: "joe@example.com"
    });

    const user = await target.findById.load(inserted.id);
    if(!user) {
      throw 'could not find user';
    }

    expect(user.name).toEqual("Joe");
    expect(user.email).toEqual("joe@example.com");
  })

  it('handles missing users', async () => {
    const user = await target.findById.load(1234);
    expect(user).toBeUndefined();
  })
});
