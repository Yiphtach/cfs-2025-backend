const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    powerstats: {
        intelligence: { type: Number, default: 0 },
        strength: { type: Number, default: 0 },
        speed: { type: Number, default: 0 },
        durability: { type: Number, default: 0 },
        power: { type: Number, default: 0 },
        combat: { type: Number, default: 0 }
    },
    biography: {
        fullName: { type: String, default: '' },
        alterEgos: { type: String, default: '' },
        placeOfBirth: { type: String, default: '' },
        firstAppearance: { type: String, default: '' },
        publisher: { type: String, default: '' },
        alignment: { type: String, default: '' }
    },
    appearance: {
        gender: { type: String, default: '' },
        race: { type: String, default: '' },
        height: { type: [String], default: [] },
        weight: { type: [String], default: [] },
        eyeColor: { type: String, default: '' },
        hairColor: { type: String, default: '' }
    },
    work: {
        occupation: { type: String, default: '' },
        base: { type: String, default: '' }
    },
    connections: {
        groupAffiliation: { type: String, default: '' },
        relatives: { type: String, default: '' }
    },
    image: {
        url: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Fighter = mongoose.model('Fighter', fighterSchema);

module.exports = Fighter;
// The Fighter model is a Mongoose model that represents a superhero fighter. The schema defines the structure of the Fighter model with the following fields: