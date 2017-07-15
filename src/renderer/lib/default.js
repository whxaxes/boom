import { remote } from 'electron';

export default {
  musicPath: remote.app.getPath('music'),
  playStyle: 'column',
};
