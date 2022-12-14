// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBus from '../../../app/model/bus';
import ExportChoose from '../../../app/model/choose';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Bus: ReturnType<typeof ExportBus>;
    Choose: ReturnType<typeof ExportChoose>;
    User: ReturnType<typeof ExportUser>;
  }
}
