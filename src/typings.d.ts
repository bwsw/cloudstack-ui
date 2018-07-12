/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/* Definition of src/config/config.json and src/config/default-config.json */
declare module '*config.json' {
  const value: any;
  export default value;
}
