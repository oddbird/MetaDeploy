import fetchMock from 'fetch-mock';

import * as actions from '@/store/scratchOrgs/actions';

import { storeWithApi } from './../../utils';

describe('fetchScratchOrg', () => {
  describe('success', () => {
    beforeEach(() => {
      window.socket = { subscribe: jest.fn() };
    });

    afterEach(() => {
      Reflect.deleteProperty(window, 'socket');
    });

    test('GETs scratch org from api and subscribes to ws events', () => {
      const store = storeWithApi({});
      const org = {
        id: 'org-1',
        job_id: 'org-job-id',
        plan: 'plan-1',
      };
      fetchMock.getOnce(window.api_urls.plan_scratch_org('plan-1'), org);
      const started = {
        type: 'FETCH_SCRATCH_ORG_STARTED',
        payload: 'plan-1',
      };
      const succeeded = {
        type: 'FETCH_SCRATCH_ORG_SUCCEEDED',
        payload: { plan: 'plan-1', org },
      };
      const expected = {
        model: 'scratch_org',
        id: 'org-job-id',
      };

      expect.assertions(2);
      return store.dispatch(actions.fetchScratchOrg('plan-1')).then(() => {
        expect(store.getActions()).toEqual([started, succeeded]);
        expect(window.socket.subscribe).toHaveBeenCalledWith(expected);
      });
    });

    test('handles missing org', () => {
      const store = storeWithApi({});
      fetchMock.getOnce(window.api_urls.plan_scratch_org('plan-1'), 404);
      const started = {
        type: 'FETCH_SCRATCH_ORG_STARTED',
        payload: 'plan-1',
      };
      const succeeded = {
        type: 'FETCH_SCRATCH_ORG_SUCCEEDED',
        payload: { plan: 'plan-1', org: null },
      };

      expect.assertions(2);
      return store.dispatch(actions.fetchScratchOrg('plan-1')).then(() => {
        expect(store.getActions()).toEqual([started, succeeded]);
        expect(window.socket.subscribe).not.toHaveBeenCalled();
      });
    });
  });

  describe('error', () => {
    test('dispatches FETCH_SCRATCH_ORG_FAILED action', () => {
      const store = storeWithApi({});
      fetchMock.getOnce(window.api_urls.plan_scratch_org('plan-1'), 500);
      const started = {
        type: 'FETCH_SCRATCH_ORG_STARTED',
        payload: 'plan-1',
      };
      const failed = {
        type: 'FETCH_SCRATCH_ORG_FAILED',
        payload: 'plan-1',
      };

      expect.assertions(5);
      return store.dispatch(actions.fetchScratchOrg('plan-1')).catch(() => {
        const allActions = store.getActions();

        expect(allActions[0]).toEqual(started);
        expect(allActions[1].type).toEqual('ERROR_ADDED');
        expect(allActions[1].payload.message).toEqual('Internal Server Error');
        expect(allActions[2]).toEqual(failed);
        expect(window.console.error).toHaveBeenCalled();
      });
    });
  });
});

describe('spinScratchOrg', () => {
  describe('success', () => {
    beforeEach(() => {
      window.socket = { subscribe: jest.fn() };
    });

    afterEach(() => {
      Reflect.deleteProperty(window, 'socket');
    });

    test('dispatches SCRATCH_ORG_SPINNING action; subscribes to ws events', () => {
      const store = storeWithApi({});
      const response = {
        id: 'org-1',
        job_id: 'org-job-id',
        plan: 'plan-1',
      };
      fetchMock.postOnce(window.api_urls.plan_scratch_org('plan-1'), {
        status: 201,
        body: response,
      });
      const started = {
        type: 'SCRATCH_ORG_SPIN_REQUESTED',
        payload: {
          plan: 'plan-1',
          email: 'email',
        },
      };
      const succeeded = {
        type: 'SCRATCH_ORG_SPINNING',
        payload: response,
      };
      const expected = {
        model: 'scratch_org',
        id: 'org-job-id',
      };

      expect.assertions(2);
      return store
        .dispatch(actions.spinScratchOrg('plan-1', 'email'))
        .then(() => {
          expect(store.getActions()).toEqual([started, succeeded]);
          expect(window.socket.subscribe).toHaveBeenCalledWith(expected);
        });
    });
  });

  describe('error', () => {
    test('dispatches SCRATCH_ORG_ERROR action', () => {
      const store = storeWithApi({});
      fetchMock.postOnce(window.api_urls.plan_scratch_org('plan-1'), 500);
      const started = {
        type: 'SCRATCH_ORG_SPIN_REQUESTED',
        payload: {
          plan: 'plan-1',
          email: 'email',
        },
      };
      const failed = {
        type: 'SCRATCH_ORG_ERROR',
        payload: 'plan-1',
      };

      expect.assertions(5);
      return store
        .dispatch(actions.spinScratchOrg('plan-1', 'email'))
        .catch(() => {
          const allActions = store.getActions();

          expect(allActions[0]).toEqual(started);
          expect(allActions[1].type).toEqual('ERROR_ADDED');
          expect(allActions[1].payload.message).toEqual(
            'Internal Server Error',
          );
          expect(allActions[2]).toEqual(failed);
          expect(window.console.error).toHaveBeenCalled();
        });
    });
  });
});

[{ type: 'SCRATCH_ORG_CREATED', action: 'createScratchOrg' }].forEach(
  ({ type, action }) => {
    test(`${action} returns action object: ${type}`, () => {
      const payload = { foo: 'bar' };
      const expected = { type, payload };

      // eslint-disable-next-line import/namespace
      expect(actions[action](payload)).toEqual(expected);
    });
  },
);

describe('failScratchOrg', () => {
  test('adds message and dispatches SCRATCH_ORG_FAILED action', () => {
    const store = storeWithApi({});
    const payload = { message: 'Nope.', org: { id: 'org-id' } };
    const failed = { type: 'SCRATCH_ORG_FAILED', payload: payload.org };

    store.dispatch(actions.failScratchOrg(payload));
    const allActions = store.getActions();

    expect(allActions[0].type).toEqual('ERROR_ADDED');
    expect(allActions[0].payload.message).toEqual('Nope.');
    expect(allActions[1]).toEqual(failed);
  });
});
