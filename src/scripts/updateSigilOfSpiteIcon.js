import mongoose from 'mongoose';
import Ability from '../models/ability.js';
import Config from '../config/config.js';

async function updateSigilOfSpiteIcon() {
    try {
        // Connect to MongoDB
        await mongoose.connect(Config.databaseURI);
        console.log('Connected to MongoDB');

        // Find the Sigil of Spite ability by name and class
        const sigilOfSpiteAbility = await Ability.findOne({
            name: 'Sigil of Spite',
            class: 'demonhunter',
            ability_type: 'class'
        });

        if (!sigilOfSpiteAbility) {
            console.log('Sigil of Spite ability not found');
            return;
        }

        console.log('Found Sigil of Spite ability:', {
            id: sigilOfSpiteAbility._id,
            name: sigilOfSpiteAbility.name,
            currentIcon: sigilOfSpiteAbility.icon,
            spellId: sigilOfSpiteAbility.spell_id
        });

        // Update the icon URL
        const newIconUrl = 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_demonhunter_elysiandecree.jpg';

        const updatedAbility = await Ability.findByIdAndUpdate(
            sigilOfSpiteAbility._id,
            { icon: newIconUrl },
            { new: true }
        );

        console.log('Successfully updated Sigil of Spite ability icon:');
        console.log('Old icon:', sigilOfSpiteAbility.icon);
        console.log('New icon:', updatedAbility.icon);

        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error updating Sigil of Spite ability icon:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the script
updateSigilOfSpiteIcon();
