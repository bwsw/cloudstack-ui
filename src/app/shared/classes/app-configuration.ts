import * as defaultConf from '../../../config/default-config.json';
import * as userConf from '../../../config/config.json';
import { userTagKeys } from '../../core/store/userTags/user-tag-keys';


export class AppConfiguration {

  public static get askToCreateVM(): string {
    return (<any>defaultConf).USER[userTagKeys.askToCreateVM];
  }

  public static get askToCreateVolume(): string {
    return (<any>defaultConf).USER[userTagKeys.askToCreateVolume];
  }

  public static get savePasswordForAllVMs(): string {
    return (<any>defaultConf).USER[userTagKeys.savePasswordForAllVMs];
  }

  public static get firstDayOfWeek(): string {
    return (<any>userConf)['defaultFirstDayOfWeek'] || (<any>defaultConf).USER[userTagKeys.firstDayOfWeek];
  }

  public static get interfaceLanguage(): string {
    return (<any>userConf)['defaultInterfaceLanguage'] || (<any>defaultConf).USER[userTagKeys.lang];
  }

  public static get lastVMId(): string {
    return (<any>defaultConf).USER[userTagKeys.lastVMId];
  }

  public static get sessionTimeout(): string {
    return (<any>defaultConf).USER[userTagKeys.sessionTimeout];
  }

  public static get showSystemTags(): string {
    return (<any>defaultConf).USER[userTagKeys.showSystemTags];
  }

  public static get timeFormat(): string {
    return (<any>userConf)['defaultTimeFormat'] || (<any>defaultConf).USER[userTagKeys.timeFormat];
  }

  public static get theme(): string {
    return (<any>userConf)['defaultThemeName'] || (<any>defaultConf).USER[userTagKeys.theme];
  }

  public static get navigationOrder(): string {
    return (<any>defaultConf).USER[userTagKeys.navigationOrder];
  }
}
