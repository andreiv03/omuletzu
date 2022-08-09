interface Constants {
  SECRET_TOKEN: string;
  CLIENT_ID: string;
  DEV_GUILD_ID: string;
  MONGODB_URI: string;
};

const constants: Constants = {
  SECRET_TOKEN: process.env.SECRET_TOKEN as string,
  CLIENT_ID: process.env.CLIENT_ID as string,
  DEV_GUILD_ID: process.env.GUILD_ID as string,
  MONGODB_URI: process.env.MONGODB_URI as string
};

Object.entries(constants).forEach(([key, value]) => {
  if (typeof value === "undefined")
    throw new Error(`${key} not found!`);
});

export default constants;