import mongoose from 'mongoose';
import Ability from '../models/ability.js';
import Config from '../config/config.js';

async function updateConsumeMagicIcon() {
    try {
        // Connect to MongoDB
        await mongoose.connect(Config.databaseURI);
        console.log('Connected to MongoDB');

        // Find the Consume Magic ability by name and class
        const consumeMagicAbility = await Ability.findOne({
            name: 'Consume Magic',
            class: 'demonhunter',
            ability_type: 'class'
        });

        if (!consumeMagicAbility) {
            console.log('Consume Magic ability not found');
            return;
        }

        console.log('Found Consume Magic ability:', {
            id: consumeMagicAbility._id,
            name: consumeMagicAbility.name,
            currentIcon: consumeMagicAbility.icon,
            spellId: consumeMagicAbility.spell_id
        });

        // Update the icon URL
        const newIconUrl = 'https://wow.zamimg.com/images/wow/icons/large/spell_misc_zandalari_council_soulswap.jpg';

        const updatedAbility = await Ability.findByIdAndUpdate(
            consumeMagicAbility._id,
            { icon: newIconUrl },
            { new: true }
        );

        console.log('Successfully updated Consume Magic ability icon:');
        console.log('Old icon:', consumeMagicAbility.icon);
        console.log('New icon:', updatedAbility.icon);

        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error updating Consume Magic ability icon:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the script
updateConsumeMagicIcon();
