import axios from 'axios';

const INVENTORY_API_BASE_URL = "http://localhost:9080/inventory"; // Sesuaikan dengan endpoint backend

class InventoryService {
    getInventory() {
        return axios.get(INVENTORY_API_BASE_URL);
    }

    createInventoryItem(item) {
        return axios.post(INVENTORY_API_BASE_URL, item);
    }

    getInventoryItemById(itemId) {
        return axios.get(INVENTORY_API_BASE_URL + '/' + itemId);
    }

    updateInventoryItem(item, itemId) {
        return axios.put(INVENTORY_API_BASE_URL + '/' + itemId, item);
    }

    deleteInventoryItem(itemId) {
        return axios.delete(INVENTORY_API_BASE_URL + '/' + itemId);
    }
}

export default new InventoryService();
