import {
    fetchStates,
    fetchStateById,
    createState,
    updateState,
    deleteState
} from '../api/endpoints/state';

import {
    stateAdapter,
    stateListAdapter
} from '../adapters/stateAdapter';

export const getStates = async () => {
    const {data, error} = await fetchStates();
    if (error) throw new Error(error.message);
    return stateListAdapter(data);
}

export const getStateById = async (id) => {
    const {data, error} = await fetchStateById(id);
    if (error) throw new Error(error.message);
    return stateAdapter(data);
}

export const addState = async (payload) => {
    const {data, error} = await createState(payload);
    if (error) throw new Error(error.message);
    return stateAdapter(data);
};

export const editState = async (id, payload) => {
    const {data, error} = await updateState(id, payload);
    if (error) throw new Error(error.message);
    return stateAdapter(data);
}

export const removeState = async (id) => {
    const {data, error} = await deleteState(id);
    if (error) throw new Error(error.message);
    return stateAdapter(data);
}
