// src/models/Fighter.js
const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
    apiId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    powerstats: {
        intelligence: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        strength: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        speed: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        durability: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        power: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        },
        combat: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 100
        }
    },
    biography: {
        fullName: { type: String, default: 'Unknown' },
        alterEgos: { type: String, default: 'No alter egos found' },
        placeOfBirth: { type: String, default: 'Unknown' },
        firstAppearance: { type: String, default: 'Unknown' },
        publisher: { type: String, default: 'Unknown', index: true },
        alignment: { 
            type: String, 
            enum: ['good', 'bad', 'neutral', 'unknown'],
            default: 'unknown',
            index: true
        }
    },
    appearance: {
        gender: { 
            type: String,
            enum: ['Male', 'Female', 'Other', 'Unknown'],
            default: 'Unknown'
        },
        race: { type: String, default: 'Unknown' },
        height: {
            type: [String],
            default: ['0 cm', '0 ft'],
            validate: {
                validator: function(v) {
                    return v.length <= 2;
                },
                message: 'Height can only have two values (metric and imperial)'
            }
        },
        weight: {
            type: [String],
            default: ['0 kg', '0 lbs'],
            validate: {
                validator: function(v) {
                    return v.length <= 2;
                },
                message: 'Weight can only have two values (metric and imperial)'
            }
        },
        eyeColor: { type: String, default: 'Unknown' },
        hairColor: { type: String, default: 'Unknown' }
    },
    work: {
        occupation: { type: String, default: 'Unknown' },
        base: { type: String, default: 'Unknown' }
    },
    connections: {
        groupAffiliation: { type: String, default: 'Unknown' },
        relatives: { type: String, default: 'Unknown' }
    },
    image: {
        url: { 
            type: String,
            default: '',
            validate: {
                validator: function(v) {
                    return v === '' || /^https?:\/\/.+/.test(v);
                },
                message: 'Image URL must be a valid URL or empty string'
            }
        }
    },
    stats: {
        totalFights: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 }
    },
    lastFight: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
fighterSchema.index({ name: 'text', 'biography.fullName': 'text' });
fighterSchema.index({ 'stats.totalFights': -1 });
fighterSchema.index({ createdAt: -1 });

// Virtuals
fighterSchema.virtual('winRate').get(function() {
    if (this.stats.totalFights === 0) return 0;
    return ((this.stats.wins / this.stats.totalFights) * 100).toFixed(2);
});

fighterSchema.virtual('totalPowerLevel').get(function() {
    return Object.values(this.powerstats).reduce((sum, stat) => sum + stat, 0);
});

// Methods
fighterSchema.methods.updateFightRecord = async function(won) {
    this.stats.totalFights += 1;
    if (won) {
        this.stats.wins += 1;
    } else {
        this.stats.losses += 1;
    }
    this.lastFight = new Date();
    return this.save();
};

fighterSchema.methods.getMatchupStats = function(opponent) {
    const statComparison = {};
    for (const [stat, value] of Object.entries(this.powerstats)) {
        statComparison[stat] = {
            difference: value - opponent.powerstats[stat],
            percentage: opponent.powerstats[stat] === 0 ? 100 : 
                ((value / opponent.powerstats[stat]) * 100).toFixed(1)
        };
    }
    return statComparison;
};

// Statics
fighterSchema.statics.getTopFighters = function(limit = 10) {
    return this.find()
        .sort({ 'stats.wins': -1 })
        .limit(limit)
        .select('name powerstats stats image');
};

fighterSchema.statics.findByPublisher = function(publisher) {
    return this.find({ 'biography.publisher': publisher })
        .sort({ name: 1 });
};

// Pre-save middleware
fighterSchema.pre('save', function(next) {
    // Ensure proper capitalization for name
    if (this.isModified('name')) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    
    // Normalize stats to 0-100 range
    for (const stat in this.powerstats) {
        if (this.powerstats[stat] < 0) this.powerstats[stat] = 0;
        if (this.powerstats[stat] > 100) this.powerstats[stat] = 100;
    }
    
    next();
});

const Fighter = mongoose.model('Fighter', fighterSchema);

module.exports = Fighter;