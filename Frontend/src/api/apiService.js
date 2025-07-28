import { API_BASE_URL, API_CONFIG } from './config';

export const apiService = {
    async get(endpoint, config = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...API_CONFIG,
            ...config,
            method: 'GET'
        });
        return response.json();
    },

    async post(endpoint, data, config = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...API_CONFIG,
            ...config,
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async put(endpoint, data, config = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...API_CONFIG,
            ...config,
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async delete(endpoint, config = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...API_CONFIG,
            ...config,
            method: 'DELETE'
        });
        return response.json();
    }
};
