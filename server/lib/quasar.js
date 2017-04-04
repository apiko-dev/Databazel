import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const quasarSettings = Meteor.settings.public.quasar;

const Quasar = {
  quasarUrl: `http://${quasarSettings.host}:${quasarSettings.port}`,

  getData(database, query, cb) {
    const requestPost = {
      type: 'post',
      url: `query/fs/${database.mount}/`,
      options: {
        content: addOrderByIfJoin(query),
        headers: {
          Accept: 'application/json',
          Destination: `${database.name}/tmp.res`,
        },
      },
    };

    this.executeRequest(requestPost, (queryErr, report) => {
      if (queryErr) return cb(queryErr);
      const dataPath = JSON.parse(report.content).out;
      const requestGet = {
        url: `data/fs${dataPath}`,
        options: {
          headers: {
            Accept: 'application/json',
          },
        },
      };
      this.executeRequest(requestGet, cb);
    });
  },

  getMetadata(path, cb) {
    const url = `metadata/fs${path}`;
    this.executeRequest({ url }, cb);
  },

  getMongoQuery(database, query, cb) {
    const url = `compile/fs/${database.mount}/?q=${encodeURI(query)}`;
    this.executeRequest({ url }, cb);
  },

  getMount(path, cb) {
    const url = `mount/fs${path}`;
    this.executeRequest({ url }, cb);
  },

  createMount(mountName, uri, cb) {
    const mount = JSON.stringify({
      mongodb: { connectionUri: uri },
    });
    const request = {
      type: 'post',
      url: 'mount/fs/',
      options: {
        content: mount,
        headers: {
          'X-File-Name': `${mountName}/`,
        },
      },
    };
    this.executeRequest(request, cb);
  },

  deleteMount(mountName, cb) {
    const request = {
      type: 'del',
      url: `mount/fs/${mountName}/`,
    };
    this.executeRequest(request, cb);
  },

  executeRequest(request, cb, index = 0) {
    const { url, type = 'get', options = {} } = request;
    let i = index;

    HTTP[type](`${this.quasarUrl}/${url}`, options, (err, res) => {
      if (err && i < 3) this.executeRequest(request, cb, ++i);
      else {
        let errorObj;
        if (err) {
          errorObj = {
            code: err.response.statusCode,
            message: `Quasar ERROR: "${err.response.data.error.status}"`,
          };
        }
        cb(errorObj, res);
      }
    });
  },
};

export default Quasar;

function addOrderByIfJoin(query) {
  let newQuery = query;
  if (/JOIN/i.test(query) && !/ORDER BY/i.test(query)) {
    const lastField = query.match(/as (`?[\w\s]+`?)\s+FROM/i)[1];
    newQuery = query.replace(/LIMIT|OFFSET/, clause => `ORDER BY ${lastField} ASC ${clause}`);
  }
  return newQuery;
}
