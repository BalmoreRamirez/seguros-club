// seed.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    label: String,
    value: String,
});

const typeSchema = new mongoose.Schema({
    label: String,
    value: String,
});

const Category = mongoose.model('Category', categorySchema);
const Type = mongoose.model('Type', typeSchema);

const seedCategories = [
    {label: 'Food', value: 'food'},
    {label: 'Transport', value: 'transport'},
    {label: 'Utilities', value: 'utilities'},
];

const seedTypes = [
    {label: 'Ingreso', value: 'Ingreso'},
    {label: 'Egreso', value: 'Egreso'},
];

const seedDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products');
        console.log('Connected to MongoDB');

        await Category.deleteMany({});
        await Type.deleteMany({});

        await Category.insertMany(seedCategories);
        await Type.insertMany(seedTypes);

        console.log('Database seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding the database:', error);
        mongoose.connection.close();
    }
};

seedDB();