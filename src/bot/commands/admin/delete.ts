import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Users from '../../../model/user.js';
import Profiles from '../../../model/profiles.js';

export const data = new SlashCommandBuilder()
	.setName('delete')
	.setDescription('Deletes a users account')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user whose account you want to delete')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for deleting the account')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false);

export async function execute(interaction) {

	const discordId: string = interaction.options.getUser('user').id;
	const reason: string = interaction.options.getString('reason');

	const deleteAccount = await Users.deleteOne({ discordId: discordId })
		.lean();

	// @ts-expect-error
	if (deleteAccount.username == null) {
		await interaction.reply({ content: "The selected user does not have an account", ephemeral: true });
		return;
	}
	// @ts-expect-error
	await Profiles.deleteOne({ accountId: deleteAccount.discordId })
		.lean();

	const embed = new EmbedBuilder()
		.setTitle("Account deleted")
		.setDescription("The account has been deleted")
		.addFields(
			{
				name: "Reason",
				value: reason,
			},
		)
		.setColor("#2b2d31")
		.setFooter({
			text: "Slurp",
			iconURL: "https://th.bing.com/th/id/OIP.pBqz5q0UL4_9cG7iPhcAXAHaEK?rs=1&pid=ImgDetMain",
		})
		.setTimestamp();

	await interaction.reply({ embeds: [embed], ephemeral: true });
	await interaction.options.getUser('user').send({ content: "Your account has been deleted by an administrator" });
}
