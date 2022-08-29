// Packages
const crypto = require("node:crypto");
const Discord = require("discord-oauth2");
require("dotenv").config();

// Initalize Discord Oauth2
const auth = new Discord({
	clientId: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
	//redirectUri: "https://api.antiraid.xyz/auth/callback",
	redirectUri: "http://localhost:3000/auth/callback",
});

module.exports = (database) => {
	// Get the Authorization URL
	const getAuthURL = async (redirect) => {
		const state = JSON.stringify({
			redirect: redirect,
		});

		const url = auth.generateAuthUrl({
			scope: ["identify", "guilds"],
			state: state,
			responseType: "code",
		});

		return url;
	};

	// Get the Access Token
	const getAccessToken = async (code) => {
		const token = await auth
			.tokenRequest({
				code: code,
				scope: ["identify", "guilds"],
				grantType: "authorization_code",
			})
			.catch((err) => {
				return {
					error: err,
				};
			});

		return token;
	};

	// Get the Refresh Token
	const getRefreshToken = async (refreshToken) => {
		const token = await auth
			.tokenRequest({
				refreshToken: refreshToken,
				grantType: "refresh_token",
				scope: ["identify", "guilds"],
			})
			.catch((err) => {
				return {
					error: err,
				};
			});

		return token;
	};

	// Revoke the Access Token
	const revokeAccessToken = async (accessToken) => {
		const credentials = Buffer.from(
			`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
		).toString("base64");

		auth.revokeToken(accessToken, credentials).catch((err) => {
			return {
				error: err,
			};
		});

		return {
			success: true,
			message: "Access Token Revoked",
		};
	};

	// Get the User Info
	const getUserInfo = async (accessToken) => {
		const user = await auth.getUser(accessToken).catch((err) => {
			return {
				error: err,
			};
		});

		return user;
	};

	// Get the User Guilds
	const getGuilds = async (accessToken) => {
		const guilds = await auth.getUserGuilds(accessToken).catch((err) => {
			return {
				error: err,
			};
		});

		return guilds;
	};

	// Expose the functions
	return {
		discord: {
			getAuthURL,
			getAccessToken,
			getRefreshToken,
			revokeAccessToken,
			getUserInfo,
			getGuilds,
		},
	};
};
