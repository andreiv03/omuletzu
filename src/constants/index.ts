interface Constants {
  SECRET_TOKEN: string;
  APPLICATION_ID: string;
};

const constants: Constants = {
  SECRET_TOKEN: process.env.SECRET_TOKEN as string,
  APPLICATION_ID: process.env.APPLICATION_ID as string
};

Object.entries(constants).forEach(([key, value]) => {
  if (typeof value === "undefined")
    throw new Error(`${key} not found!`);
});

export default constants;