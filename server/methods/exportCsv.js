import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { exec } from 'child_process';
import { Async } from 'meteor/meteorhacks:async';
import Future from 'fibers/future';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export default () => {
  Meteor.methods({
    'exportCsv.mongoexport'(chart, query) {
      check(chart, Object);
      check(query, String);
      if (!Meteor.user()) throw new Meteor.Error('403', 'Permission denied');
      this.unblock();
      const future = new Future();
      const basePath = path.resolve('.').split('.meteor')[0];
      return createCommand(chart, query, basePath, res => {
        exec(res.command, err => {
          if (err) throw new Meteor.Error(err);
          future.return(res.outFilePath);
        });
        return future.wait();
      });
    },
    'exportCsv.downloadFile'(outFilePath, csv) {
      check(outFilePath, String);
      check(csv, Match.Maybe(String));
      if (!Meteor.user()) throw new Meteor.Error('403', 'Permission denied');
      const future = new Future();
      const file = csv || fs.readFileSync(outFilePath, 'utf8');
      let fileName = outFilePath.slice(outFilePath.lastIndexOf('/') + 1);
      const zip = new JSZip();
      zip.file(fileName, file).generateAsync({
        type: 'uint8array',
        compression: 'DEFLATE',
      }).then(content => {
        fileName = fileName.replace('.csv', '');
        future.return({ content, fileName });
      });
      return future.wait();
    },
  });
};

function createCommand(chart, query, basePath, callback) {
  const response = Async.runSync(done => {
    Meteor.call('quasar.getMount', chart.database.mount, (err, res) => {
      done(err, res);
    });
  });
  if (response.error) throw new Meteor.Error(response.error);
  const connectionUri = response.result.connectionUri;
  const user = connectionUri.match(/:\/\/(\w+):/)[1];
  const password = connectionUri.match(/:(\w+)/)[1];
  const host = connectionUri.match(/@(.+?):/)[1];
  const port = connectionUri.match(/:(\d+)\//)[1];
  const db = connectionUri.match(/\d\/(.+)/)[1];
  const currentPath = { rest: 'server/private/' };
  currentPath.base = basePath;
  const { queryObject: { from: collection, fields }, chartName } = chart;
  const queryOption = query ? `-q ${query}` : '';
  const fieldsNames = fields.map(field => field.name).join(',');
  const outFilePath = `${currentPath.base}${currentPath.rest}${chartName}.csv`;
  const command = `mongoexport -h ${host} --port ${port}` +
    ` -u ${user} -p ${password}` +
    ` -d ${db} -c ${collection}` +
    ` ${queryOption} --type=csv` +
    ` --fields ${fieldsNames} -o ${outFilePath}`;
  return callback({ command, outFilePath });
}
