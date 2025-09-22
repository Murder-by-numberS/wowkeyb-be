import mongoose from 'mongoose';
import Ability from '../models/ability.js';
import Config from '../config/config.js';

async function updateDisruptIcon() {
    try {
        // Connect to MongoDB
        await mongoose.connect(Config.databaseURI);

        console.log('Connected to MongoDB');

        // Find the Disrupt ability by name and class
        const disruptAbility = await Ability.findOne({
            name: 'Disrupt',
            class: 'demonhunter',
            ability_type: 'class'
        });

        if (!disruptAbility) {
            console.log('Disrupt ability not found');
            return;
        }

        console.log('Found Disrupt ability:', {
            id: disruptAbility._id,
            name: disruptAbility.name,
            currentIcon: disruptAbility.icon,
            spellId: disruptAbility.spell_id
        });

        // Update the icon URL
        const newIconUrl = 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_consumemagic.jpg';

        const updatedAbility = await Ability.findByIdAndUpdate(
            disruptAbility._id,
            { icon: newIconUrl },
            { new: true }
        );

        console.log('Successfully updated Disrupt ability icon:');
        console.log('Old icon:', disruptAbility.icon);
        console.log('New icon:', updatedAbility.icon);

        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error updating Disrupt ability icon:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the script
updateDisruptIcon();
