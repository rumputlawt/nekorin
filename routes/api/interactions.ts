import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import tweetnacl from "tweetnacl";
import { decodeHex } from "@std/encoding/hex";
import {
	type APIInteraction,
	type APIInteractionResponse,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "@discordjs/core";
import { define } from "../../utils/core.ts";

export const handler = define.handlers({
	async POST(ctx) {
		const body = await ctx.req.text();
		const timestamp = ctx.req.headers.get("x-signature-timestamp");
		const signature = ctx.req.headers.get("x-signature-ed25519");
		const publicKey = Deno.env.get("PUBLIC_KEY");

		const unauthorized = new HttpError(
			STATUS_CODE.Unauthorized,
			"Signature, Timestamp, or Public Key is undefined",
		);

		if (!timestamp || !signature || !publicKey) {
			throw unauthorized;
		} else {
			const valid = tweetnacl.sign.detached.verify(
				new TextEncoder().encode(timestamp + body),
				decodeHex(signature),
				decodeHex(publicKey),
			);

			if (!valid) {
				throw unauthorized;
			} else {
				const interaction: APIInteraction = JSON.parse(body);
				let payload: APIInteractionResponse;

				switch (interaction.type) {
					case InteractionType.Ping: {
						payload = {
							type: InteractionResponseType.Pong,
						};
						break;
					}
					case InteractionType.ApplicationCommand: {
						payload = {
							type: InteractionResponseType
								.ChannelMessageWithSource,
							data: {
								content:
									"Application Command handler isn't done yet.",
								flags: MessageFlags.Ephemeral,
							},
						};
						break;
					}
					case InteractionType.MessageComponent: {
						payload = {
							type: InteractionResponseType
								.ChannelMessageWithSource,
							data: {
								content:
									"Message Component handler isn't done yet.",
								flags: MessageFlags.Ephemeral,
							},
						};
						break;
					}
					case InteractionType.ApplicationCommandAutocomplete: {
						payload = {
							type: InteractionResponseType
								.ApplicationCommandAutocompleteResult,
							data: {
								choices: [],
							},
						};
						break;
					}
					case InteractionType.ModalSubmit: {
						payload = {
							type: InteractionResponseType
								.ChannelMessageWithSource,
							data: {
								content:
									"Message Component handler isn't done yet.",
								flags: MessageFlags.Ephemeral,
							},
						};
						break;
					}
				}

				return Response.json(payload);
			}
		}
	},
});
