const { describe, it } = global;
import { assert } from 'chai';
import actions from '../collection_fields';

describe('workplace.actions.collection_fields', () => {
  describe('getAvailableCollectionFields', () => {
    it('should convert data to array', () => {
      const result = actions.getAvailableCollectionFields({}, { test: 1 });
      assert.isArray(result);
    });
  });
});
