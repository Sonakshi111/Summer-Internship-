export const submitBatchAllotment = (req, res) => {
    try {
        // Your batch allotment logic here
        res.status(200).json({ message: 'Batch allotment successful' });
    } catch (error) {
        console.error('Error in batch allotment:', error);
        res.status(500).json({ error: 'Failed to process batch allotment' });
    }
};
