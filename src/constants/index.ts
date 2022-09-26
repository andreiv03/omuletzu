export const constants = {
  APPLICATION_ID: process.env.APPLICATION_ID as string,
  SECRET_TOKEN: process.env.SECRET_TOKEN as string
};

Object.entries(constants).forEach(([key, value]) => {
  if (typeof value === "undefined")
    throw new Error(`${key} not found!`);
});
