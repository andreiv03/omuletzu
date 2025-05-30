import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const ENV_DEFAULTS = {
	ACCENT_COLOR: "#FACA5C",
	APPLICATION_ID: "747112444253700147",
	NODE_ENV: "development",
};

export const ENV = {
	ACCENT_COLOR: process.env["ACCENT_COLOR"] || ENV_DEFAULTS.ACCENT_COLOR,
	APPLICATION_ID: process.env["APPLICATION_ID"] || ENV_DEFAULTS.APPLICATION_ID,
	NODE_ENV: process.env["NODE_ENV"] || ENV_DEFAULTS.NODE_ENV,
	SECRET_TOKEN: process.env["SECRET_TOKEN"] as string,
} as const;

Object.entries(ENV).forEach(([key, value]) => {
	if (!key || !value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
});
