// Save data using model instance
async function createData(model, data) {
    try {
        const instance = await model.create(data);
        return instance;
    } catch (err) {
        throw err;
    }
}

// Get single data with filter
async function getSingleData(model, query = {}, select = []) {
    console.log(select);
    try {
        const result = await model.findOne({
            where: query,
            attributes: select.length > 0 ? select : undefined
        });
        return result;
    } catch (err) {
        throw err;
    }
}

// Update/patch data based on any query
async function updateData(model, data, query) {
    try {
        const result = await model.update(data, {
            where: query
        });
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createData,
    getSingleData,
    updateData,
};