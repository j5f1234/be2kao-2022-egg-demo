import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  sequelize: {
    enable: true,
    package: "egg-sequelize"
  },

  validate: {
    enable: true,
    package: 'egg-validate'
  },
};


export default plugin;
