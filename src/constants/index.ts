interface Constants {
  SECRET_TOKEN: string;
  CLIENT_ID: string;
  DEV_GUILD_ID: string;
};

const constants: Constants = {
  SECRET_TOKEN: process.env.SECRET_TOKEN as string,
  CLIENT_ID: process.env.CLIENT_ID as string,
  DEV_GUILD_ID: process.env.DEV_GUILD_ID as string
};

Object.entries(constants).forEach(([key, value]) => {
  if (typeof value === "undefined")
    throw new Error(`${key} not found!`);
});

export default constants;